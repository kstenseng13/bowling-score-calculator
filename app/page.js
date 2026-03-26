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

      <div className="text-center mt-4 space-y-4">
        <div className="inline-flex items-center gap-4 text-sm text-taupe-700">
          <span className="font-mono bg-taupe-100 px-2 py-0.5 rounded">0-9</span> Pins
          <span className="font-mono bg-taupe-100 px-2 py-0.5 rounded">X</span> Strike
          <span className="font-mono bg-taupe-100 px-2 py-0.5 rounded">/</span> Spare
        </div>

        <details className="max-w-md mx-auto text-left text-sm text-taupe-700">
          <summary className="cursor-pointer font-semibold text-center hover:text-cyan-700 transition-colors">
            How Bowling Scoring Works
          </summary>
          <ul className="mt-2 space-y-1.5 list-disc list-inside bg-white/80 rounded-lg p-4">
            <li>A game has <strong>10 frames</strong>. Each frame gets up to 2 rolls to knock down 10 pins.</li>
            <li><strong>Strike (X):</strong> All 10 pins on the first roll. Score = 10 + the next 2 rolls.</li>
            <li><strong>Spare (/):</strong> All remaining pins on the second roll. Score = 10 + the next 1 roll.</li>
            <li><strong>Open frame:</strong> Score = total pins knocked down in that frame.</li>
            <li><strong>10th frame:</strong> Bonus rolls are awarded for strikes and spares — up to 3 rolls total.</li>
            <li><strong>Perfect game:</strong> 12 strikes in a row = 300 points.</li>
          </ul>
        </details>

        <div>
          <button onClick={handleReset} className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
