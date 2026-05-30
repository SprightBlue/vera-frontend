interface RiskGaugeProps {
    percent: number;
    color: string;
}

// RiskGauge.tsx - más chico en mobile
function RiskGauge({ percent, color }: RiskGaugeProps) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-24 h-24 sm:w-36 sm:h-36">
            <svg className="w-24 h-24 sm:w-36 sm:h-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle
                    cx="60" cy="60" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-bold text-white">{percent}%</span>
            </div>
        </div>
    );
}

export default RiskGauge;