interface ExecutiveScoreProps {
  score: number;
  status: string;
}

export default function ExecutiveScore({
  score,
  status,
}: ExecutiveScoreProps) {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#101827] p-10 shadow-2xl">

      <p className="text-cyan-400 text-sm uppercase tracking-[0.2em]">
        Enterprise Risk Score
      </p>

      <div className="mt-6 flex items-end gap-4">

        <h1 className="text-7xl font-bold">
          {score}
        </h1>

        <span className="mb-4 rounded-full bg-green-500/20 px-4 py-2 text-green-400">
          {status}
        </span>

      </div>

      <div className="mt-8 h-3 rounded-full bg-slate-700">

        <div
          className="h-full rounded-full bg-cyan-400"
          style={{ width: `${score}%` }}
        />

      </div>

      <div className="mt-6 flex justify-between text-sm text-slate-400">

        <span>Risk Appetite</span>

        <span>{score}%</span>

      </div>

    </div>
  );
}