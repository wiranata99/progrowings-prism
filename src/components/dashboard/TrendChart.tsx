export default function TrendChart() {
  const data = [1.9, 2.1, 2.0, 2.2, 2.4, 2.3, 2.42];

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 560;
      const y = 140 - ((value - min) / (max - min)) * 110;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl bg-slate-900 p-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-cyan-400">
            Gross NPL Trend
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            2.42%
          </h2>

        </div>

        <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
          Stable
        </span>

      </div>

      <svg
        viewBox="0 0 560 160"
        className="mt-8 w-full"
      >

        <polyline
          fill="none"
          stroke="#22D3EE"
          strokeWidth="4"
          points={points}
        />

      </svg>

      <div className="mt-6 flex justify-between text-xs text-slate-500">

        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>

      </div>

    </div>
  );
}