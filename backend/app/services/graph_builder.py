"""
Fraud Network Graph Builder.
Constructs entity relationship graph across Plots, Documents, Transactions,
Buyer/Seller Aliases, and Cases.
"""

from typing import List, Dict, Any, Set
from backend.app.models.schemas import (
    GraphNode,
    GraphEdge,
    NetworkGraphData,
    CaseDetailResponse,
    DocumentItem,
    TransactionRecord,
    LandRecord,
    Finding
)
from backend.app.services.normalizer import normalize_identifier


class GraphBuilder:
    """
    Constructs node-link relationship structures for interactive fraud network visualization.
    Uses anonymized/synthetic identifiers (e.g. BUYER-A, PLOT-405, DOC-DEED-101).
    """

    @classmethod
    def build_case_graph(
        cls,
        case: CaseDetailResponse,
        findings: List[Finding]
    ) -> NetworkGraphData:
        """
        Builds the relationship network for a specific case.
        """
        nodes: Dict[str, GraphNode] = {}
        edges: List[GraphEdge] = []
        edge_keys: Set[str] = set()

        def add_edge(src: str, tgt: str, label: str, is_conflict: bool = False):
            key = f"{src}->{tgt}:{label}"
            if key not in edge_keys and src in nodes and tgt in nodes:
                edge_keys.add(key)
                edges.append(GraphEdge(source=src, target=tgt, label=label, is_conflict=is_conflict))

        # 1. Case Root Node
        case_node_id = f"case_{case.id}"
        nodes[case_node_id] = GraphNode(
            id=case_node_id,
            label=f"Case {case.tracking_id}",
            type="case",
            severity=case.risk_level,
            properties={
                "tracking_id": case.tracking_id,
                "title": case.title,
                "risk_level": case.risk_level,
                "status": case.status
            }
        )

        # 2. Plot Nodes
        for lr in case.land_records:
            plot_node_id = f"plot_{normalize_identifier(lr.district)}_{normalize_identifier(lr.mouza)}_{normalize_identifier(lr.dag_no)}"
            if plot_node_id not in nodes:
                nodes[plot_node_id] = GraphNode(
                    id=plot_node_id,
                    label=f"Plot Dag-{lr.dag_no} ({lr.mouza})",
                    type="plot",
                    severity="info",
                    properties={
                        "dag_no": lr.dag_no,
                        "khatian_no": lr.khatian_no,
                        "mouza": lr.mouza,
                        "district": lr.district,
                        "upazila": lr.upazila,
                        "area_decimals": lr.recorded_land_area_decimal
                    }
                )
            add_edge(case_node_id, plot_node_id, "linked_case")

        # 3. Document Nodes
        for doc in case.documents:
            doc_node_id = f"doc_{doc.id}"
            nodes[doc_node_id] = GraphNode(
                id=doc_node_id,
                label=f"{doc.doc_category.title()} ({doc.file_name[:18]}...)",
                type="document",
                severity="low" if doc.ocr_status == "completed" else "medium",
                properties={
                    "file_name": doc.file_name,
                    "category": doc.doc_category,
                    "hash_sha256": doc.file_hash_sha256,
                    "confidence": doc.confidence_score
                }
            )
            add_edge(case_node_id, doc_node_id, "contains_document")

            # Link document to plot if fields extracted
            d_dag = next((f.normalized_value for f in doc.extracted_fields if f.field_name == "dag_no"), None)
            d_mouza = next((f.normalized_value for f in doc.extracted_fields if f.field_name == "mouza"), None)
            d_dist = next((f.normalized_value for f in doc.extracted_fields if f.field_name == "district"), None)

            if d_dag and d_mouza and d_dist:
                plot_ref_id = f"plot_{normalize_identifier(d_dist)}_{normalize_identifier(d_mouza)}_{normalize_identifier(d_dag)}"
                if plot_ref_id in nodes:
                    add_edge(doc_node_id, plot_ref_id, "refers_to_plot")

        # 4. Transaction and Persona Nodes
        conflict_findings = [f for f in findings if f.rule_id in ("RULE_B_DOUBLE_SELLING", "RULE_G_DOCUMENT_DIFFERENCES")]

        for txn in case.transactions:
            txn_node_id = f"txn_{txn.id or normalize_identifier(txn.deed_no or txn.plot_identifier)}"
            nodes[txn_node_id] = GraphNode(
                id=txn_node_id,
                label=f"Txn: Deed {txn.deed_no or 'N/A'}",
                type="transaction",
                severity="medium" if conflict_findings else "info",
                properties={
                    "deed_no": txn.deed_no,
                    "transaction_date": str(txn.transaction_date) if txn.transaction_date else None,
                    "amount_bdt": txn.consideration_bdt,
                    "type": txn.transaction_type
                }
            )
            add_edge(case_node_id, txn_node_id, "contains_transaction")

            # Buyer Node
            if txn.buyer_name:
                buyer_node_id = f"buyer_{normalize_identifier(txn.buyer_name)}"
                if buyer_node_id not in nodes:
                    nodes[buyer_node_id] = GraphNode(
                        id=buyer_node_id,
                        label=f"Buyer: {txn.buyer_name}",
                        type="buyer",
                        severity="info",
                        properties={"alias": txn.buyer_name, "role": "buyer"}
                    )
                add_edge(txn_node_id, buyer_node_id, "transferred_to")

            # Seller Node
            if txn.seller_name:
                seller_node_id = f"seller_{normalize_identifier(txn.seller_name)}"
                if seller_node_id not in nodes:
                    nodes[seller_node_id] = GraphNode(
                        id=seller_node_id,
                        label=f"Seller: {txn.seller_name}",
                        type="seller",
                        severity="info",
                        properties={"alias": txn.seller_name, "role": "seller"}
                    )
                add_edge(seller_node_id, txn_node_id, "executed_by")

        # 5. Mark Conflicting Edges from Findings
        for finding in conflict_findings:
            if finding.rule_id == "RULE_B_DOUBLE_SELLING" and finding.conflicting_values:
                b1 = finding.conflicting_values.get("buyer_1")
                b2 = finding.conflicting_values.get("buyer_2")
                if b1 and b2:
                    b1_id = f"buyer_{normalize_identifier(b1)}"
                    b2_id = f"buyer_{normalize_identifier(b2)}"
                    if b1_id in nodes and b2_id in nodes:
                        add_edge(b1_id, b2_id, "conflicting_claim", is_conflict=True)

        return NetworkGraphData(
            nodes=list(nodes.values()),
            edges=edges
        )
