import MoveDetail from "./MoveDetail";
import "../styles/Home.css";
import "../styles/CharPage.css";
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import axios from "axios";
import ColumnFilter from "./ColumnFilter";

const placeholderThumb = (name) => `../public/images/${name}.png`;

axios.defaults.baseURL = "http://localhost:3001";

const CharPage = ({ activeTab }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const { charName: paramChar } = useParams();
  const location = useLocation();
  const [selected, setSelected] = useState(paramChar || null);
  const [movesData, setMovesData] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [commandMode, setCommandMode] = useState("plain"); // 'plain', 'numpad', or 'ez'
  const [filterOpen, setFilterOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    cmd: true,
    name: true,
    startup: true,
    active: true,
    recovery: true,
    onHit: true,
    onBlock: true,
    dmg: true,
    total: false,
    xx: false,
    atkLevel: false,
  });

  // Fetch moves for selected character
  useEffect(() => {
    const fetchMoves = async (name) => {
      if (!name) return setMovesData([]);
      try {
        const response = await axios.get(`/${name}/moves`);
        // response.data is expected to be an object of categories -> moves
        const moves = response.data || {};
        const flat = [];
          // moves is an object mapping moveName -> moveDetails
          Object.entries(moves).forEach(([moveKey, move]) => {
            flat.push({
              key: moveKey,
              name: move.moveName || moveKey,
              plnCmd: move.plnCmd || "",
              numCmd: move.numCmd || "",
              ezCmd: move.ezCmd || "N/A",
              startup: move.startup ?? "",
              active: move.active ?? "",
              recovery: move.recovery ?? move.total ?? "",
              onHit: move.onHit ?? move.onPC ?? "",
              onBlock: move.onBlock ?? "",
              dmg: move.dmg ?? "",
              total: move.total ?? "",
              xx: move.xx ? move.xx.join(", ") : "",
              atkLevel: move.atkLvl ?? "",
            });
          });

        setMovesData(flat);
      } catch (err) {
        console.error("Error fetching moves for", name, err);
        setMovesData([]);
      }
    };

    const name = paramChar;
    if (name) {
      setSelected(name);
      fetchMoves(name);
    }
  }, [selected, paramChar]);

  // Fetch stats for selected character
  useEffect(() => {
    const fetchStats = async (name) => {
      if (!name) return setStatsData(null);
      try {
        const response = await axios.get(`/${name}/stats`);
        // response.data is expected to be a single stats object
        const stats = response.data || {};
        setStatsData(stats);
      } catch (err) {
        console.error("Error fetching stats for", name, err);
        setStatsData(null);
      }
    };

    const name = paramChar;
    if (name) {
      setSelected(name);
      fetchStats(name);
    }
  }, [selected, paramChar]);

  // Column width definitions (in px, adjust as needed)
  const columnWidths = {
    cmd: 90,
    name: 300,
    startup: 80,
    active: 70,
    recovery: 80,
    onHit: 70,
    onBlock: 80,
    dmg: 80,
  };

  // columns for react-table
  const columns = useMemo(() => [
    {
      header: "Command",
      accessorKey: commandMode === "plain" ? "plnCmd" : (commandMode === "numpad" ? "numCmd" : "ezCmd"),
      size: columnWidths.cmd,
    },
    {
      header: "Name",
      accessorKey: "name",
      size: columnWidths.name,
    },
    {
      header: "Startup",
      accessorKey: "startup",
      size: columnWidths.startup,
    },
    {
      header: "Active",
      accessorKey: "active",
      size: columnWidths.active,
    },
    {
      header: "Recovery",
      accessorKey: "recovery",
      size: columnWidths.recovery,
    },
    {
      header: "Total",
      accessorKey: "total",
      size: 80,
    },
    {
      header: "On Hit",
      accessorKey: "onHit",
      size: columnWidths.onHit,
    },
    {
      header: "On Block",
      accessorKey: "onBlock",
      size: columnWidths.onBlock,
    },
    {
      header: "Damage",
      accessorKey: "dmg",
      size: columnWidths.dmg,
    },
    {
      header: "XX (Cancels)",
      accessorKey: "xx",
      size: 100,
    },
    {
      header: "Attack Level",
      accessorKey: "atkLevel",
      size: 100,
    },
  ], [commandMode, columnWidths]);

  const table = useReactTable({
    data: movesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="app">
      <h1 className="charpage-title">{`${selected || paramChar || ""} ${activeTab === "moves" ? "Moves" : "Stats"}`}</h1>

      {activeTab === "moves" ? (
        <>
          <div className="table-controls">
            <div className="command-toggle">
              <button
                className={`toggle-btn-classic ${commandMode === "plain" ? "active" : ""}`}
                onClick={() => setCommandMode("plain")}
              >
                Plain
              </button>
              <button
                className={`toggle-btn-classic ${commandMode === "numpad" ? "active" : ""}`}
                onClick={() => setCommandMode("numpad")}
              >
                Numpad
              </button>
              <button
                className={`toggle-btn-modern ${commandMode === "ez" ? "active" : ""}`}
                onClick={() => setCommandMode("ez")}
              >
                Modern
              </button>
            </div>
            <div className="filter-btn-wrapper">
              <button className="filter-btn" onClick={() => setFilterOpen((v) => !v)}>
                ⚙️ Filter Columns
              </button>
              <ColumnFilter
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
              />
            </div>
          </div>
          <div className="table-wrapper">
            <table className="moves-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const key = header.column.columnDef.accessorKey;
                    // Always show command column
                    if (key === 'plnCmd' || key === 'numCmd' || key === 'ezCmd') {
                      return (
                        <th key={header.id} style={{ width: `${header.getSize()}px`, minWidth: `${header.getSize()}px` }}>
                          {header.isPlaceholder ? null : header.column.columnDef.header}
                        </th>
                      );
                    }
                    if (!columnVisibility[key]) return null;
                    return (
                      <th key={header.id} style={{ width: `${header.getSize()}px`, minWidth: `${header.getSize()}px` }}>
                        {header.isPlaceholder ? null : header.column.columnDef.header}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="clickable-row"
                  onClick={() => setSelectedRow(row.original)}
                  style={{ cursor: 'pointer' }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const key = cell.column.columnDef.accessorKey;
                    // Always show command column
                    if (key === 'plnCmd' || key === 'numCmd' || key === 'ezCmd') {
                      return (
                        <td key={cell.id} style={{ width: `${cell.column.getSize()}px`, minWidth: `${cell.column.getSize()}px` }}>{String(cell.getValue() ?? "")}</td>
                      );
                    }
                    if (!columnVisibility[key]) return null;
                    return (
                      <td key={cell.id} style={{ width: `${cell.column.getSize()}px`, minWidth: `${cell.column.getSize()}px` }}>{String(cell.getValue() ?? "")}</td>
                    );
                  })}
                </tr>
              ))}
                  {/* Move Detail Modal/Panel */}
                  {selectedRow && (
                    <MoveDetail move={selectedRow} onClose={() => setSelectedRow(null)} />
                  )}
            </tbody>
          </table>
          </div>
        </>
      ) : (
        <div className="table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th>All Info</th>
              </tr>
            </thead>
            <tbody>
              {statsData ? (
                <tr>
                  <td style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85em' }}>
                    {JSON.stringify(statsData, null, 2)}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td>No stats available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CharPage;