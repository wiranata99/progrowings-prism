import Panel from "../ui/Panel";
import { liquidityGap } from "../../data/liquidity";
import { getStatusBadge } from "../../utils/statusColor";


export default function LiquidityGap() {
  return (
    <Panel title="Liquidity Gap">

      <div className="space-y-5">

        {liquidityGap.map((item) => (

          <div
            key={item.bucket}
            className="rounded-2xl border border-slate-800 p-5 transition hover:border-cyan-500/30"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm uppercase tracking-wider text-slate-500">
                  {item.bucket}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {item.gap}
                </h3>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadge(item.status)}`}
              >
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          AI Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">

          Liquidity gap pada bucket
          <span className="font-semibold text-amber-400">
            {" "}8–30 hari
          </span>
          menunjukkan tekanan akibat konsentrasi jatuh tempo deposito.
          Kondisi ini masih dapat ditutup oleh secondary reserve sehingga
          belum memerlukan tindakan manajemen yang bersifat extraordinary.

        </p>

      </div>

    </Panel>
  );
}