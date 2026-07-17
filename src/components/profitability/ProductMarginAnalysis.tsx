import Panel from "../ui/Panel";
import { productMarginAnalysis } from "../../data/profitability";



export default function ProductMarginAnalysis() {
  return (
    <Panel title="Product Margin Analysis">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="pb-4">Product</th>
              <th className="pb-4">Yield</th>
              <th className="pb-4">Cost of Fund</th>
              <th className="pb-4">Margin</th>
              <th className="pb-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {productMarginAnalysis.map((item) => (

              <tr
                key={item.product}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="py-5 font-medium">

                  {item.product}

                </td>

                <td className="text-cyan-400 font-semibold">

                  {item.yield}

                </td>

                <td>

                  {item.cof}

                </td>

                <td className="font-bold">

                  {item.margin}

                </td>

                <td>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Healthy"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Executive Insight
        </p>

        <p className="mt-4 leading-7 text-slate-300">
  Consumer Lending continues to generate the strongest portfolio margin,
  remaining the primary contributor to the Bank's interest income.
  Mortgage products deliver comparatively lower spreads, suggesting potential
  opportunities for pricing optimization and funding cost improvements to
  enhance overall portfolio profitability.
</p>

      </div>

    </Panel>
  );
}