import type { DailyProgressPoint } from "../api/training-api";

interface Props {
    data: DailyProgressPoint[];
}

const W = 560;
const H = 160;
const PAD = { top: 16, right: 16, bottom: 30, left: 36 };

export function ProgressChart({ data }: Props) {
    if (data.length === 0) {
        return (<div className="flex items-center justify-center h-40 text-slate-500 text-sm">Sin datos aún</div>);
    }

    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;

    const toX = (i: number) => PAD.left + (data.length > 1 ? i * xStep : innerW / 2);
    const toY = (v: number) => PAD.top + innerH - (v / 100) * innerH;

    const polyline = data.map((d, i) => `${toX(i)},${toY(d.correctRate)}`).join(" ");

    const areaPath =
        `M ${toX(0)},${toY(data[0].correctRate)} ` +
        data.slice(1).map((d, i) => `L ${toX(i + 1)},${toY(d.correctRate)}`).join(" ") +
        ` L ${toX(data.length - 1)},${PAD.top + innerH} L ${toX(0)},${PAD.top + innerH} Z`;

    const yTicks = [0, 25, 50, 75, 100];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
            </defs>

            {yTicks.map((t) => (
                <g key={t}>
                    <line
                        x1={PAD.left}
                        x2={W - PAD.right}
                        y1={toY(t)}
                        y2={toY(t)}
                        stroke="#1e293b"
                        strokeWidth={1}
                    />
                    <text
                        x={PAD.left - 6}
                        y={toY(t) + 4}
                        fontSize={9}
                        fill="#475569"
                        textAnchor="end"
                    >
                        {t}%
                    </text>
                </g>
            ))}

            {data.map((d, i) => (
                <text
                    key={i}
                    x={toX(i)}
                    y={H - 4}
                    fontSize={9}
                    fill="#475569"
                    textAnchor="middle"
                >
                    {d.date}
                </text>
            ))}

            <path d={areaPath} fill="url(#chartGrad)" />

            <polyline
                points={polyline}
                fill="none"
                stroke="#2563eb"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {data.map((d, i) => (
                <circle
                    key={i}
                    cx={toX(i)}
                    cy={toY(d.correctRate)}
                    r={3.5}
                    fill="#2563eb"
                    stroke="#050816"
                    strokeWidth={2}
                />
            ))}
        </svg>
    );
}