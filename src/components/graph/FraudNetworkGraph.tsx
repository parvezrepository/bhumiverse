'use client';

import React, { useState } from 'react';
import { NetworkGraphData, GraphNode, GraphEdge } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Network, Filter, ZoomIn, ZoomOut, Info, X } from 'lucide-react';

interface Props {
  graphData: NetworkGraphData;
}

export default function FraudNetworkGraph({ graphData }: Props) {
  const { lang } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filteredNodes = graphData.nodes.filter((n: GraphNode) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getNodeColor = (type: string, severity?: string) => {
    if (severity === 'high') return { fill: '#DC2626', stroke: '#EF4444', text: '#FCA5A5' };
    switch (type) {
      case 'plot':
        return { fill: '#2563EB', stroke: '#3B82F6', text: '#93C5FD' };
      case 'document':
        return { fill: '#7C3AED', stroke: '#8B5CF6', text: '#C4B5FD' };
      case 'buyer':
        return { fill: '#059669', stroke: '#10B981', text: '#6EE7B7' };
      case 'seller':
        return { fill: '#D97706', stroke: '#F59E0B', text: '#FCD34D' };
      default:
        return { fill: '#0B6E4F', stroke: '#34D399', text: '#A7F3D0' };
    }
  };

  // Fixed deterministic circular coordinates
  const width = 800;
  const height = 480;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 170;

  const nodePositions = new Map<string, { x: number; y: number }>();

  // Center node is usually case root
  const rootNode = graphData.nodes.find((n: GraphNode) => n.type === 'case') || graphData.nodes[0];
  if (rootNode) {
    nodePositions.set(rootNode.id, { x: centerX, y: centerY });
  }

  const peripheralNodes = graphData.nodes.filter((n: GraphNode) => n.id !== rootNode?.id);
  peripheralNodes.forEach((node: GraphNode, idx: number) => {
    const angle = (idx / peripheralNodes.length) * 2 * Math.PI - Math.PI / 2;
    // slightly randomize distance for natural organic clusters
    const r = radius + (idx % 2 === 0 ? 25 : -20);
    nodePositions.set(node.id, {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    });
  });

  // Calculate missing positions safely
  graphData.nodes.forEach((n: GraphNode, idx: number) => {
    if (!nodePositions.has(n.id)) {
      const angle = (idx / graphData.nodes.length) * 2 * Math.PI;
      nodePositions.set(n.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="gov-card p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-[#0B6E4F]" />
          <h3 className="text-sm font-bold text-slate-900">
            {lang === 'en' ? 'Fraud Network Graph' : 'ফ্রড নেটওয়ার্ক গ্রাফ'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            ({graphData.nodes.length} {lang === 'en' ? 'Nodes' : 'নোড'}, {graphData.edges.length} {lang === 'en' ? 'Relationships' : 'সম্পর্ক'})
          </span>
        </div>

        {/* Filter Types & Zoom */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-800 outline-none text-xs cursor-pointer font-bold"
            >
              <option value="all">{lang === 'en' ? 'All Entity Types' : 'সকল সত্তা'}</option>
              <option value="plot">{lang === 'en' ? 'Plots Only' : 'শুধুমাত্র দাগ'}</option>
              <option value="document">{lang === 'en' ? 'Documents' : 'দলিল ও খতিয়ান'}</option>
              <option value="buyer">{lang === 'en' ? 'Buyers' : 'ক্রেতা'}</option>
              <option value="seller">{lang === 'en' ? 'Sellers' : 'বিক্রেতা'}</option>
              <option value="transaction">{lang === 'en' ? 'Transactions' : 'লেনদেন'}</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-1 text-slate-600 hover:text-slate-900 font-bold"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] text-slate-700 font-mono font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
              className="p-1 text-slate-600 hover:text-slate-900 font-bold"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Graph Canvas */}
      <div className="gov-card rounded-2xl border border-slate-200 p-4 relative overflow-hidden min-h-[500px] flex items-center justify-center bg-[#0B1528] shadow-md">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[480px] select-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Edge Connection Lines */}
          <g className="edges">
            {graphData.edges.map((edge: GraphEdge, i: number) => {
              const srcPos = nodePositions.get(edge.source);
              const tgtPos = nodePositions.get(edge.target);
              if (!srcPos || !tgtPos) return null;

              const isConflict = edge.is_conflict;

              return (
                <g key={`edge-${i}`}>
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke={isConflict ? '#EF4444' : '#334155'}
                    strokeWidth={isConflict ? 2.5 : 1.5}
                    strokeDasharray={isConflict ? '6,4' : undefined}
                    className={isConflict ? 'animate-pulse' : ''}
                  />
                  {/* Midpoint Label for conflicts */}
                  {isConflict && (
                    <text
                      x={(srcPos.x + tgtPos.x) / 2}
                      y={(srcPos.y + tgtPos.y) / 2 - 6}
                      fill="#F87171"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      CONFLICT CLAIM
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Node Circles */}
          <g className="nodes">
            {filteredNodes.map((node: GraphNode) => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;
              const col = getNodeColor(node.type, node.severity);
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle r="26" fill="none" stroke="#10B981" strokeWidth="2.5" className="animate-pulse" />
                  )}

                  {/* Node Outer Circle */}
                  <circle
                    r="18"
                    fill={col.fill}
                    stroke={col.stroke}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    className="transition-transform group-hover:scale-110 shadow-lg"
                  />

                  {/* Node Icon Initial */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {node.type === 'plot' ? 'PLT' : (node.type === 'buyer' ? 'BYR' : (node.type === 'seller' ? 'SLR' : (node.type === 'document' ? 'DOC' : 'CSE')))}
                  </text>

                  {/* Node Label Below */}
                  <text
                    y="30"
                    textAnchor="middle"
                    fill={col.text}
                    fontSize="9"
                    fontWeight="500"
                    className="pointer-events-none"
                  >
                    {node.label.length > 20 ? `${node.label.slice(0, 18)}...` : node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-[#0F1E36]/90 border border-slate-700/80 p-3 rounded-xl text-[10px] space-y-1 shadow-md text-slate-200">
          <div className="text-slate-400 font-bold uppercase tracking-wider mb-1">
            {lang === 'en' ? 'Entity Legend:' : 'প্রতীক পরিচিতি:'}
          </div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {lang === 'en' ? 'Case Root' : 'মূল কেস'}</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {lang === 'en' ? 'Plot Parcel' : 'জমির দাগ'}</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> {lang === 'en' ? 'Deed / Khatian' : 'দলিল ও খতিয়ান'}</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {lang === 'en' ? 'Buyer / Purchaser' : 'ক্রেতা'}</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> {lang === 'en' ? 'Conflict / Altered Claim' : 'বিরোধপূর্ণ লেনদেন'}</div>
        </div>

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-72 bg-[#0F1E36] border border-slate-600 p-4 rounded-xl shadow-2xl z-20 space-y-3 text-white">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                {selectedNode.type} Entity
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">{selectedNode.label}</h4>
              <p className="text-xs text-slate-400 font-mono">ID: {selectedNode.id}</p>
            </div>

            {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                {Object.entries(selectedNode.properties).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400 font-mono text-[11px]">{k}:</span>
                    <span className="font-semibold text-slate-200">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[11px] text-slate-400 leading-tight">
              Relationships in synthetic records are deterministically derived without probabilistic assumptions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
