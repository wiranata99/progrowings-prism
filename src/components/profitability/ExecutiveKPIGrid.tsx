import MetricCard from "../cards/MetricCard";
import { profitabilitySummary } from "../../data/profitability";

export default function ProfitabilitySummary() {
  return (
    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">
          Profitability Health Score
        </h2>

        <p className="mt-2 text-slate-400">
          Ringkasan indikator utama profitabilitas Bank.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {profitabilitySummary.map((item) => (

        <MetricCard
        key={item.title}
        title={item.title}
        value={item.value}
        trend={item.trend}
        target={item.target}
        status={item.status}
        />

  ))}

</div>

    </div>
  );
}