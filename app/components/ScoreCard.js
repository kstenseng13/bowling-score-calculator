import InputColumn from "./InputColumn";
import ScoreColumn from "./ScoreColumn";
import { useScoringContext } from "../hooks/useScoringContext";

export default function ScoreCard() {
    const { total } = useScoringContext();
    return (
        <div className="overflow-x-auto py-5 flex justify-center">
            <table className="border-collapse border-2 inline-block" aria-label="Bowling Scorecard">
                <thead>
                    <tr>
                        {Array.from({ length: 10 }, (_, i) => i).map((frameIndex) => (
                            <th key={`header-${frameIndex + 1}`} scope="col" className="border px-0.5 py-0.5 text-center font-bold text-xs w-10">
                                {frameIndex + 1}
                            </th>
                        ))}
                        <th scope="col" className="border px-1 py-0.5 text-center font-bold text-sm w-12">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Inputs */}
                    <tr>
                        {Array.from({ length: 10 }, (_, i) => i).map((frameIndex) => (
                            <InputColumn key={`input-${frameIndex + 1}`} frameIndex={frameIndex} />
                        ))}
                        <td className="border px-1 py-0.5 text-center" aria-label="Total input placeholder" />
                    </tr>

                    {/* Scores */}
                    <tr>
                        {Array.from({ length: 10 }, (_, i) => i).map((frameIndex) => (
                            <ScoreColumn key={`score-${frameIndex + 1}`} frameIndex={frameIndex} />
                        ))}
                        <td className="border px-1 py-0.5 text-center font-bold text-sm" aria-label="Total score">{total ?? "-"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
