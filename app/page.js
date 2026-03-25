"use client";

import { useState, useMemo, useCallback } from "react";
import { useScoring } from "./hooks/useScoring";
import ScoreCard from "./components/ScoreCard";
import { createCellKey } from "./lib/constants";
import { ScoringContext } from "./context/ScoringContext";

export default function Home() {
  // Initialize empty rolls array, active cell, and scoring logic.
  const initialRolls = Array.from({ length: 10 }, (_, i) => i === 9 ? [null, null, null] : [null, null]);
  const [rolls, setRolls] = useState(initialRolls);
  const [activeCell, setActiveCell] = useState(null); // Null means no cell is active.
  const { calculateScore, calculateTotal } = useScoring(rolls);

  const isRollInvalid = useCallback((frameIndex, rollIndex) => {
    const rollsForCurrentFrame = rolls[frameIndex];
    const isTenthFrame = frameIndex === 9;
    const firstRoll = rollsForCurrentFrame[0];
    const secondRoll = rollsForCurrentFrame[1];

    if (!isTenthFrame && rollIndex === 1) {
      if (firstRoll !== 0 && secondRoll === 10) {
        return true;
      }
      if (firstRoll !== null && secondRoll !== null && firstRoll + secondRoll > 10) {
        return true;
      }
      return false;
    }

    if (isTenthFrame && rollIndex === 1) {
      return (firstRoll !== 10 && firstRoll !== null && secondRoll !== null && firstRoll + secondRoll > 10);
    }

    return false;
  }, [rolls]);

  const handleRollClick = useCallback((frameIndex, rollIndex) => {
    if (frameIndex === null) {
      setActiveCell(null);
      return;
    }
    setActiveCell(createCellKey(frameIndex, rollIndex));
  }, []);

  // Function for handling input changes. It will convert user input (X, /, or 0-9) into numeric values.
  // Just because I'm extra and I want this to look like a bowling alley program to some extent :)
  const handleRollChange = useCallback((frameIndex, rollIndex, value) => {
    let numValue = null;

    if (value !== "") {
      // Display X for strikes
      if (value.toUpperCase() === "X") {
        numValue = 10;
      }
      // Display / for spares
      else if (value === "/") {
        const firstRoll = rolls[frameIndex][0];
        if (firstRoll !== null) {
          numValue = 10 - firstRoll;
        }
      }
      // Regular number input (0-9)
      else {
        numValue = Math.min(10, Math.max(0, Number.parseInt(value) || 0));
      }
    }

    // Create a copy of rolls and update the specific roll value.
    // This is done immutably to ensure React state updates correctly.
    const newRolls = rolls.map((r, i) => i === frameIndex ? [...r] : r);
    newRolls[frameIndex][rollIndex] = numValue;

    // Automatically set the second roll to 0 if the first roll is a strike and it is not the 10th frame.
    if (frameIndex < 9 && rollIndex === 0 && numValue === 10) {
      newRolls[frameIndex][1] = 0;
    }

    setRolls(newRolls);
  }, [rolls]);

  const total = calculateTotal();

  const handleReset = () => {
    setRolls(initialRolls);
    setActiveCell(null);
  };

  const contextValue = useMemo(() => ({
    rolls,
    activeCell,
    onRollChange: handleRollChange,
    onRollClick: handleRollClick,
    isRollInvalid,
    calculateScore,
    total,
  }), [rolls, activeCell, handleRollChange, handleRollClick, isRollInvalid, calculateScore, total]);

  return (
    <main className="p-5 font-sans">
      <h1 className="text-center text-3xl font-bold mb-5">Bowling Score Calculator</h1>
      <ScoringContext.Provider value={contextValue}>
        <ScoreCard />
      </ScoringContext.Provider>
      <div className="text-center mt-6">
        <button onClick={handleReset} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
          Reset
        </button>
      </div>
    </main>
  );
}
