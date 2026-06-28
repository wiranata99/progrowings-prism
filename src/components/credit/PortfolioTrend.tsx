export default function PortfolioTrend() {
  const values = [2.91, 2.82, 2.76, 2.63, 2.51, 2.42];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const max = Math.max(...values);
  const min = Math.min(...values);

  const chartWidth = 620;
  const chartHeight = 170;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * chartWidth;
      const y =
        chartHeight -
        ((value - min) / (max - min)) * (chartHeight - 25);

      return `${x},${y}`;
    })
    .join(" ");

  const area = `
0,${chartHeight}
${points}
${chartWidth},${chartHeight}
`;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Gross NPL Trend
          </h2>

          <p className="mt-2 text-slate-400">
            Six-month portfolio quality movement
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current
          </p>

          <h3 className="mt-1 text-4xl font-bold">
            2.42%
          </h3>

          <p className="mt-1 text-sm font-semibold text-emerald-400">
            ▼ Improving
          </p>

        </div>

      </div>

      {/* Chart */}

      <div className="mt-8">

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
          className="w-full"
        >
          <defs>

            <linearGradient
              id="trendFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#22D3EE"
                stopOpacity="0.28"
              />

              <stop
                offset="100%"
                stopColor="#22D3EE"
                stopOpacity="0"
              />

            </linearGradient>

          </defs>

          {/* Horizontal Grid */}

          {[20, 60, 100, 140].map((line) => (
            <line
              key={line}
              x1="0"
              x2={chartWidth}
              y1={line}
              y2={line}
              stroke="#263244"
              strokeDasharray="4 6"
            />
          ))}

          {/* Area */}

          <polygon
            points={area}
            fill="url(#trendFill)"
          />

          {/* Line */}

          <polyline
            points={points}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}

          {values.map((value, index) => {
            const x =
              (index / (values.length - 1)) *
              chartWidth;

            const y =
              chartHeight -
              ((value - min) / (max - min)) *
                (chartHeight - 25);

            return (
              <g key={index}>

                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#22D3EE"
                />

                <circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill="#22D3EE22"
                />

              </g>
            );
          })}

        </svg>

      </div>

      {/* Footer */}

      <div className="mt-5 flex justify-between text-xs uppercase tracking-[0.18em] text-slate-500">

        {months.map((month) => (
          <span key={month}>
            {month}
          </span>
        ))}

      </div>

    </div>
  );
}