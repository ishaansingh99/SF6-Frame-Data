import React from "react";
import "../styles/CharPage.css";

const MoveDetail = ({ move, onClose }) => {
  if (!move) return null;
  return (
    <div className="move-detail-modal">
      <div className="move-detail-content">
        <button className="move-detail-close" onClick={onClose}>
          ×
        </button>
        <h2>{move.name}</h2>
        <ul>
          {Object.entries(move).map(([key, value]) => (
            key !== "name" && (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoveDetail;
