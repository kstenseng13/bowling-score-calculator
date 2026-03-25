import { useCallback } from "react";

const isTenthFrame = (frameIndex) => frameIndex === 9;

const calculateStrikeScore = (frameIndex, rolls) => {
    const nextFrame = rolls[frameIndex + 1];
    const nextRoll1 = nextFrame[0];

    if (nextRoll1 === null) return null;

    // If the next frame is also a strike, look one frame further
    if (nextRoll1 === 10 && frameIndex + 2 < rolls.length) {
        const frameAfterNext = rolls[frameIndex + 2];
        if (frameAfterNext[0] === null) return null;
        return 10 + nextRoll1 + frameAfterNext[0];
    }

    if (nextFrame[1] === null) return null;
    return 10 + nextRoll1 + nextFrame[1];
};

const calculateSpareScore = (frameIndex, rolls) => {
    const nextFrame = rolls[frameIndex + 1];
    if (nextFrame[0] === null) return null;
    return 10 + nextFrame[0];
};

const calculateRegularFrameScore = (frameIndex, rolls) => {
    const [roll1, roll2] = rolls[frameIndex];

    if (roll1 === null || roll2 === null) return null;
    if (roll1 === 10) return calculateStrikeScore(frameIndex, rolls);
    if (roll1 + roll2 === 10) return calculateSpareScore(frameIndex, rolls);

    return roll1 + roll2;
};

const calculateTenthFrameScore = (rolls) => {
    const [roll1, roll2, roll3] = rolls[9];

    if (roll1 === null || roll2 === null) return null;

    if (roll1 === 10 || roll1 + roll2 === 10) {
        if (roll3 === null) return null;
        return roll1 + roll2 + roll3;
    }

    return roll1 + roll2;
};

const calculateFrameScore = (frameIndex, rolls) => {
    return isTenthFrame(frameIndex)
        ? calculateTenthFrameScore(rolls)
        : calculateRegularFrameScore(frameIndex, rolls);
};

// Custom hook for all scoring logic
export const useScoring = (rolls) => {
    const calculateScore = useCallback((frameIndex) => {
        return calculateFrameScore(frameIndex, rolls);
    }, [rolls]);

    const calculateTotal = useCallback(() => {
        let total = 0;
        let hasAnyScore = false;
        for (let i = 0; i < 10; i++) {
            const score = calculateScore(i);
            if (score !== null) {
                total += score;
                hasAnyScore = true;
            }
        }
        return hasAnyScore ? total : null;
    }, [calculateScore]);

    return { calculateScore, calculateTotal };
};