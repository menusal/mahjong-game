import React from "react";
import { SUIT_COLORS } from "../constants/uiConstants.js";
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  TILE_OFFSET_X,
  TILE_OFFSET_Y,
} from "../constants/gameConstants.js";

const Tile = React.memo(
  ({ boardTile, onClick, isSelected, isHint, boardWidth, boardHeight }) => {
    const { tile, x, y, z, isMatched, isSelectable } = boardTile;

    const getBoxShadow = () => {
      if (isSelected) {
        return `4px 4px 12px rgba(0,0,0,0.7), 0px 0px 8px rgba(59, 130, 246, 0.5)`;
      }
      if (isHint) {
        return `4px 4px 12px rgba(0,0,0,0.7), 0px 0px 8px rgba(34, 197, 94, 0.5)`;
      }
      if (isSelectable) {
        return `4px 4px 10px rgba(0,0,0,0.6), 2px 2px 6px rgba(0,0,0,0.4)`;
      }
      return `3px 3px 8px rgba(0,0,0,0.5), 1px 1px 4px rgba(0,0,0,0.3)`;
    };

    const style = {
      left: `${((x * TILE_OFFSET_X) / boardWidth) * 100}%`,
      top: `${((y * TILE_OFFSET_Y) / boardHeight) * 100}%`,
      width: `${(TILE_WIDTH / boardWidth) * 100}%`,
      height: `${(TILE_HEIGHT / boardHeight) * 100}%`,
      zIndex: z * 10 + y,
      boxShadow: getBoxShadow(),
      transition:
        "opacity 0.5s ease, transform 0.3s ease, box-shadow 0.2s ease",
      opacity: isMatched ? 0 : 1,
      transform: isSelected ? "scale(1.05)" : "scale(1)",
      borderRadius: "8px",
    };

    let classes = `
    absolute flex items-center justify-center
    bg-gray-100 border border-gray-400 rounded
    font-medium text-gray-800 border-6
    select-none
  `;

    if (isMatched) {
      classes += " pointer-events-none";
    }

    if (isSelectable) {
      classes += " cursor-pointer hover:bg-yellow-50";
    } else {
      classes += " bg-gray-300 text-gray-500 border-gray-500 opacity-80";
    }

    if (isSelected) {
      classes += " !bg-blue-200 border-blue-500 border-6 ring-2 ring-blue-500";
    }

    if (isHint) {
      classes +=
        " !bg-green-200 border-green-500 border-6 ring-2 ring-green-500 animate-pulse";
    }

    const faceColor = SUIT_COLORS[tile.suit] || "text-gray-900";
    const faceContent =
      tile.key === "dragon-0" ? (
        <span className="text-red-600 font-bold">{tile.face}</span>
      ) : (
        tile.face
      );

    const handleClick = () => {
      if (isSelectable && !isMatched) {
        onClick(boardTile.id);
      }
    };

    return (
      <div style={style} className={classes} onClick={handleClick}>
        <span
          className={`flex items-center justify-center h-full w-full ${faceColor}`}
          style={{ fontSize: "10vh", paddingBottom: "2.5vh" }}
        >
          {faceContent}
        </span>
      </div>
    );
  }
);

Tile.displayName = "Tile";

export default Tile;
