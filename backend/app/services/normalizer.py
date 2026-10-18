"""
Normalizer Service for BHUMIVerse.
Handles conservative normalization of:
1. Bengali and English numerals (০-৯ <-> 0-9)
2. Land area units (decimal/shatak, katha, bigha, acre, sqft)
3. Plot identifiers (District, Upazila, Mouza, Khatian, Dag)
4. Name tokens for distinct identity checks (protecting against false-positive merges)
"""

import re
from typing import Optional, Dict, Any, Tuple

BENGALI_DIGITS = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
}

DIGITS_TO_BENGALI = {v: k for k, v in BENGALI_DIGITS.items()}

# Conversions relative to Decimal / Shatak (শতক)
# 1 Decimal = 435.6 sq ft
# 1 Katha = 1.65 decimals = 720 sq ft
# 1 Bigha = 20 katha = 33 decimals = 14,400 sq ft
# 1 Acre = 100 decimals = 43,560 sq ft
DECIMAL_TO_SQFT = 435.6
KATHA_TO_DECIMAL = 1.65
BIGHA_TO_DECIMAL = 33.0
ACRE_TO_DECIMAL = 100.0


def normalize_numerals(text: Optional[str]) -> str:
    """
    Converts Bengali numerals to English standard digits.
    Leaves other characters untouched.
    """
    if not text:
        return ""
    
    result = []
    for char in str(text):
        result.append(BENGALI_DIGITS.get(char, char))
    return "".join(result).strip()


def to_bengali_numerals(text: Optional[str]) -> str:
    """
    Converts English digits to Bengali numerals for localized display.
    """
    if not text:
        return ""
    result = []
    for char in str(text):
        result.append(DIGITS_TO_BENGALI.get(char, char))
    return "".join(result)


def normalize_whitespace(text: Optional[str]) -> str:
    """
    Trims leading/trailing whitespace and compresses multi-spaces.
    """
    if not text:
        return ""
    return re.sub(r'\s+', ' ', str(text)).strip()


def normalize_identifier(identifier: Optional[str]) -> str:
    """
    Normalizes deed number, dag number, or khatian number.
    Preserves case insensitive alpha-numeric structure.
    """
    if not identifier:
        return ""
    cleaned = normalize_whitespace(identifier)
    cleaned = normalize_numerals(cleaned)
    # Remove common punctuation noise while preserving slashes/hyphens for composite dags
    cleaned = re.sub(r'[^A-Za-z0-9\/\-]', '', cleaned).upper()
    return cleaned


def normalize_plot_composite_key(
    district: Optional[str],
    upazila: Optional[str],
    mouza: Optional[str],
    khatian_no: Optional[str],
    dag_no: Optional[str]
) -> str:
    """
    Builds a deterministic composite key for comparing plots.
    Example: DHAKA|GULSHAN|BAUNIA|KH-102|DAG-405
    """
    dist_clean = normalize_whitespace(district).upper() if district else "UNKNOWN_DIST"
    upaz_clean = normalize_whitespace(upazila).upper() if upazila else "UNKNOWN_UPAZ"
    mouz_clean = normalize_whitespace(mouza).upper() if mouza else "UNKNOWN_MOUZA"
    kh_clean = f"KH-{normalize_identifier(khatian_no)}" if khatian_no else "KH-UNKNOWN"
    dag_clean = f"DAG-{normalize_identifier(dag_no)}" if dag_no else "DAG-UNKNOWN"

    return f"{dist_clean}|{upaz_clean}|{mouz_clean}|{kh_clean}|{dag_clean}"


def normalize_land_area(
    raw_amount: Any,
    raw_unit: Optional[str] = "decimal"
) -> Dict[str, Optional[float]]:
    """
    Normalizes diverse land area measures into standard decimals and sq.ft.
    Supports units: decimal (শতক/শতাংশ), katha (কাঠা), bigha (বিঘা), acre (একর), sqft.
    Returns:
    {
        "decimals": float,
        "sqft": float,
        "acres": float,
        "is_reliable": bool
    }
    """
    if raw_amount is None:
        return {"decimals": None, "sqft": None, "acres": None, "is_reliable": False}

    str_amount = normalize_numerals(str(raw_amount))
    match = re.search(r"[-+]?\d*\.?\d+", str_amount)
    if not match:
        return {"decimals": None, "sqft": None, "acres": None, "is_reliable": False}

    try:
        val = float(match.group(0))
    except ValueError:
        return {"decimals": None, "sqft": None, "acres": None, "is_reliable": False}

    unit = (raw_unit or "decimal").lower().strip()

    decimals = 0.0
    is_reliable = True

    if any(u in unit for u in ["decimal", "shatak", "shatangsho", "শতক", "শতাংশ", "ডি"]):
        decimals = val
    elif any(u in unit for u in ["katha", "কাঠা", "কা"]):
        decimals = val * KATHA_TO_DECIMAL
    elif any(u in unit for u in ["bigha", "বিঘা"]):
        decimals = val * BIGHA_TO_DECIMAL
    elif any(u in unit for u in ["acre", "একর"]):
        decimals = val * ACRE_TO_DECIMAL
    elif any(u in unit for u in ["sqft", "square feet", "বর্গফুট", "sq ft"]):
        decimals = val / DECIMAL_TO_SQFT
    else:
        # Unknown unit
        is_reliable = False
        decimals = val

    sqft = decimals * DECIMAL_TO_SQFT
    acres = decimals / 100.0

    return {
        "decimals": round(decimals, 4),
        "sqft": round(sqft, 2),
        "acres": round(acres, 4),
        "is_reliable": is_reliable
    }


def are_names_plausibly_different(name1: Optional[str], name2: Optional[str]) -> Tuple[bool, str]:
    """
    Prevents false positive assumptions that two people with similar names
    are the same entity.
    E.g. 'Md. Rafiqul Islam' vs 'Rafiqul Islam Khan' or 'Abdul Karim' vs 'Abdul Karim Mollah'.
    Returns (is_different, rationale).
    """
    if not name1 or not name2:
        return (True, "One or both names are missing or incomplete.")

    n1 = normalize_whitespace(name1).lower()
    n2 = normalize_whitespace(name2).lower()

    if n1 == n2:
        return (False, "Exact matching name string.")

    # Token comparison
    tokens1 = set(re.findall(r'\w+', n1))
    tokens2 = set(re.findall(r'\w+', n2))

    common_honorifics = {'md', 'mohammad', 'muhammad', 'al', 'haj', 'alhaj', 'sk', 'sheikh', 'begum', 'mst', 'mrs', 'mr'}
    sig1 = tokens1 - common_honorifics
    sig2 = tokens2 - common_honorifics

    if sig1 != sig2:
        return (True, f"Names possess distinct components ('{' '.join(sig1)}' vs '{' '.join(sig2)}'). Do not assume same legal persona without NID confirmation.")

    return (False, "Names appear phonetically or token-wise synonymous, requiring human reviewer verification.")
