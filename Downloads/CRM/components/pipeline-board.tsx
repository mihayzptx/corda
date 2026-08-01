'use client';

import React, { useState, useEffect } from 'react';

interface Deal {
  id: string;
  name: string;
  value?: string;
  stageId: string;
}

interface Stage {
  id: string;
  name: string;
}

interface Column {
  id: string;
  name: string;
  deals: Deal[];
}

interface PipelineBoardProps {
  initialStages: Stage[];
  initialDeals: Deal[];
  onDealMove?: (dealId: string, toStageId: string) => void;
}

export function PipelineBoard({ initialStages, initialDeals, onDealMove }: PipelineBoardProps) {
  const [stages] = useState<Stage[]>(initialStages);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [addingStageId, setAddingStageId] = useState<string | null>(null);
  const [newDealName, setNewDealName] = useState('');
  const [newDealValue, setNewDealValue] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const columns: Column[] = stages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    deals: deals.filter((d) => d.stageId === stage.id),
  }));

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (!draggedDeal) return;
    const deal = deals.find((d) => d.id === draggedDeal);
    if (!deal || deal.stageId === stageId) {
      setDraggedDeal(null);
      return;
    }
    const newDeals = deals.map((d) =>
      d.id === draggedDeal ? { ...d, stageId } : d
    );
    setDeals(newDeals);
    onDealMove?.(draggedDeal, stageId);
    setToast(`Deal moved to ${stages.find((s) => s.id === stageId)?.name}`);
    setDraggedDeal(null);
  };

  const addDeal = (stageId: string) => {
    if (!newDealName.trim()) return;
    const newDeal: Deal = {
      id: `deal-${Math.random().toString(36).slice(2, 9)}`,
      name: newDealName,
      value: newDealValue || undefined,
      stageId,
    };
    setDeals([...deals, newDeal]);
    setNewDealName('');
    setNewDealValue('');
    setAddingStageId(null);
    setToast(`${newDealName} added`);
  };

  return (
    <div className="w-full">
      {deals.length === 0 && !addingStageId && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 mb-4">
          <p className="text-sm text-gray-600 mb-3">Add your first deal to see your workflow and dashboards in action.</p>
          <button
            onClick={() => setAddingStageId(stages[0].id)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium"
          >
            + Add deal
          </button>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex-shrink-0 w-64 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-sm">{col.name}</h3>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                {col.deals.length}
              </span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className="flex-1 flex flex-col gap-2 min-h-60 rounded-lg bg-gray-50 p-2"
            >
              {col.deals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => handleDragStart(deal.id)}
                  className="rounded-lg border border-gray-300 bg-white p-3 cursor-grab hover:shadow-sm"
                >
                  <div className="font-semibold text-sm">{deal.name}</div>
                  {deal.value && (
                    <div className="mt-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block">
                      ${deal.value}
                    </div>
                  )}
                </div>
              ))}

              {addingStageId === col.id ? (
                <div className="rounded-lg border border-gray-300 bg-white p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Deal name"
                    value={newDealName}
                    onChange={(e) => setNewDealName(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={newDealValue}
                    onChange={(e) => setNewDealValue(e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setAddingStageId(null)}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addDeal(col.id)}
                      disabled={!newDealName.trim()}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingStageId(col.id)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium py-2"
                >
                  + Add deal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed top-4 right-4 rounded-lg bg-white border border-gray-300 px-4 py-3 shadow-lg flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}
