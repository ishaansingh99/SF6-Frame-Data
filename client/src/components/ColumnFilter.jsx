import React from "react";

const COLUMN_LABELS = {
  cmd: "Command",
  name: "Name",
  startup: "Startup",
  active: "Active",
  recovery: "Recovery",
  total: "Total",
  onHit: "On Hit",
  onBlock: "On Block",
  dmg: "Damage",
  xx: "XX (Cancels)",
  atkLevel: "Attack Level",
};

function ColumnFilter({ columnVisibility, setColumnVisibility, open, onClose }) {
  const toggleColumn = (key) => {
    if (key === "cmd") return; // Command column is always visible
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!open) return null;

  return (
    <div className="filter-menu" style={{ minWidth: 180, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 12, position: 'absolute', right: 0, zIndex: 100 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Show Columns</div>
      {Object.keys(columnVisibility).map((key) => (
        <label key={key} className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 15 }}>
          <input
            type="checkbox"
            checked={columnVisibility[key]}
            onChange={() => toggleColumn(key)}
            disabled={key === "cmd"}
            style={{ accentColor: '#4f46e5' }}
          />
          <span>{COLUMN_LABELS[key]}</span>
        </label>
      ))}
      <button onClick={onClose} style={{ marginTop: 10, padding: '6px 14px', borderRadius: 6, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Close</button>
    </div>
  );
}

export default ColumnFilter;