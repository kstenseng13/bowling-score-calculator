import { useScoringContext } from "../hooks/useScoringContext";
import { getScoreDisplay } from "../_utils/displayUtils";

export default function ScoreColumn({ frameIndex }) {
    const { rolls, calculateScore } = useScoringContext();
    const rollsForCurrentFrame = rolls[frameIndex];
    const scoreDisplay = getScoreDisplay(frameIndex, rollsForCurrentFrame, calculateScore);

    return (
        <td className="border border-black px-0.5 py-0.5 text-center font-bold text-xs">
            {scoreDisplay}
        </td>
    );
}
