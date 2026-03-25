import { useScoringContext } from "../hooks/useScoringContext";
import { getRollDisplay, getInputClassName, shouldShowSecondRoll, shouldShowThirdRoll } from "../_utils/displayUtils";
import { createCellKey } from "../lib/constants";

function RollInputElement({ frameIndex, rollIndex, isTenthFrame }) {
    const { rolls, activeCell, onRollChange, onRollClick, isRollInvalid } = useScoringContext();
    const rollsForCurrentFrame = rolls[frameIndex];
    const displayValue = getRollDisplay(rollIndex, rollsForCurrentFrame, isTenthFrame);
    const isActive = activeCell === createCellKey(frameIndex, rollIndex);
    const isInvalid = isRollInvalid?.(frameIndex, rollIndex);

    const handleInput = (e) => {
        const input = e.target.value.toUpperCase();
        // Only allow digits, X, or /
        if (input === "" || /^[0-9X/]$/.test(input)) {
            onRollChange(frameIndex, rollIndex, input);
        }
    };

    return (
        <input type="text" maxLength="1"
            value={displayValue ?? ""} className={getInputClassName(isInvalid, isActive)}
            onChange={handleInput} onFocus={() => onRollClick(frameIndex, rollIndex)} onBlur={() => onRollClick(null)}/>
    );
}

export default function InputColumn({ frameIndex }) {
    const rollsForCurrentFrame = useScoringContext().rolls[frameIndex];
    const isTenthFrame = frameIndex === 9;

    return (
        <td className="border border-black px-0.5 py-0.5 text-center text-xs">
            <div className="flex flex-row gap-0.5 justify-center">
                <RollInputElement frameIndex={frameIndex} rollIndex={0} isTenthFrame={isTenthFrame} />

                {shouldShowSecondRoll(isTenthFrame, rollsForCurrentFrame[0]) && (
                    <RollInputElement frameIndex={frameIndex} rollIndex={1} isTenthFrame={isTenthFrame} />
                )}

                {shouldShowThirdRoll(isTenthFrame, rollsForCurrentFrame[0], rollsForCurrentFrame[1]) && (
                    <RollInputElement frameIndex={frameIndex} rollIndex={2} isTenthFrame={isTenthFrame} />
                )}
            </div>
        </td>
    );
}
