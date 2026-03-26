function isStrike(roll) {
    return roll === 10;
}

function isSpare(roll1, roll2) {
    return roll1 !== null && roll2 !== null && roll1 + roll2 === 10;
}

// Roll display.
export function getRollDisplay(rollIndex, rollsForCurrentFrame, isTenthFrame) {
    const currentRoll = rollsForCurrentFrame[rollIndex];

    if (currentRoll === null) return "";
    if (isStrike(currentRoll) && rollIndex !== 1) return "X";

    if (rollIndex === 1) {
        const firstRoll = rollsForCurrentFrame[0];
        if (isSpare(firstRoll, currentRoll) && !isStrike(firstRoll)) return "/";
        if (isTenthFrame && isStrike(currentRoll)) return "X";
    }

    return currentRoll;
}

// Display for the score column.
export function getScoreDisplay(frameIndex, rollsForCurrentFrame, calculateScore) {
    const score = calculateScore(frameIndex);

    if (frameIndex < 9 && score === null) {
        const [roll1, roll2] = rollsForCurrentFrame;
        if (isStrike(roll1)) return "X";
        if (isSpare(roll1, roll2)) return "/";
        return "-";
    }

    return score ?? "-";
}

// Input styling based on validation and focus state.
export function getInputClassName(isInvalid, isActive) {
    const baseStyles = "w-10 h-6 p-0 text-xs text-center";
    if (isInvalid) return `${baseStyles} border-2 border-rose-500 bg-rose-50`;
    if (isActive) return `${baseStyles} border-2 border-cyan-500 bg-cyan-50`;
    return `${baseStyles} border-l border-taupe-300 bg-white`;
}

export function shouldShowSecondRoll(isTenthFrame, firstRoll) {
    return isTenthFrame || !isStrike(firstRoll);
}

export function shouldShowThirdRoll(isTenthFrame, firstRoll, secondRoll) {
    if (!isTenthFrame) return false;
    return isStrike(firstRoll) || isSpare(firstRoll, secondRoll);
}
