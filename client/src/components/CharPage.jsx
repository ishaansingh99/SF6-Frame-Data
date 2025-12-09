import "../styles/Home.css";
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import axios from "axios";

const placeholderThumb = (name) => `../public/images/${name}.png`;

axios.defaults.baseURL = "http://localhost:3001";

const CharPage = ({ activeTab }) => {
  const { charName: paramChar } = useParams();
  const location = useLocation();
  const [selected, setSelected] = useState(paramChar || null);
  const [movesData, setMovesData] = useState([]);
  const [statsData, setStatsData] = useState(null);

  // Fetch moves for selected character
  useEffect(() => {
    const fetchMoves = async (name) => {
      if (!name) return setMovesData([]);
      try {
        const response = await axios.get(`/${name}/moves`);
        // response.data is expected to be an object of categories -> moves
        console.log("moves response data: ", response.data);
        const moves = response.data || {};
        const flat = [];
          // moves is an object mapping moveName -> moveDetails
          Object.entries(moves).forEach(([moveKey, move]) => {
            flat.push({
              key: moveKey,
              name: move.moveName || moveKey,
              cmd: move.plnCmd || move.numCmd || "",
              startup: move.startup ?? "",
              active: move.active ?? "",
              recovery: move.recovery ?? move.total ?? "",
              onHit: move.onHit ?? move.onPC ?? "",
              onBlock: move.onBlock ?? "",
              dmg: move.dmg ?? "",
              extraInfo: Array.isArray(move.extraInfo) ? move.extraInfo.join(' | ') : move.extraInfo || "",
            });
          });

        setMovesData(flat);
      } catch (err) {
        console.error("Error fetching moves for", name, err);
        setMovesData([]);
      }
    };

    console.log("selected char: ", selected);
    console.log("paramChar: ", paramChar);
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

    // console.log("selected char: ", selected);
    // console.log("paramChar: ", paramChar);
    const name = paramChar;
    if (name) {
      setSelected(name);
      fetchStats(name);
    }
  }, [selected, paramChar]);

  // columns for react-table
  const columns = useMemo(() => [
    {
      header: "Command",
      accessorKey: "cmd",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Startup",
      accessorKey: "startup",
    },
    {
      header: "Active",
      accessorKey: "active",
    },
    {
      header: "Recovery",
      accessorKey: "recovery",
    },
    {
      header: "On Hit",
      accessorKey: "onHit",
    },
    {
      header: "On Block",
      accessorKey: "onBlock",
    },
    {
      header: "Damage",
      accessorKey: "dmg",
    },
  ], []);

  const table = useReactTable({
    data: movesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="app">
      <h1>{`${selected || paramChar || ""} ${activeTab === "moves" ? "Moves" : "Stats"}`}</h1>

      {activeTab === "moves" ? (
        <div className="table-wrapper">
          <table className="moves-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : header.column.columnDef.header}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{String(cell.getValue() ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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