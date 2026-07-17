import Panel from "../ui/Panel";
import { assetYieldAnalysis } from "../../data/profitability";



export default function AssetYieldAnalysis() {
  return (
    <Panel title="Asset Yield Analysis">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="pb-4">Product</th>
              <th className="pb-4">Outstanding</th>
              <th className="pb-4">Yield</th>
              <th className="pb-4">Contribution</th>

            </tr>

          </thead>

          <tbody>

            {assetYieldAnalysis.map((item) => (

              <tr
                key={item.product}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="py-5 font-medium">
                  {item.product}
                </td>

                <td>
                  {item.outstanding}
                </td>

                <td className="font-semibold text-cyan-400">
                  {item.yield}
                </td>

                <td>
                  {item.contribution}
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
  Consumer Lending remains the Bank's largest contributor to interest income,
  supported by the highest asset yield of
  <span className="font-semibold text-white"> 11.76%</span>.
  Meanwhile, Corporate Lending margins continue to experience moderate pressure,
  indicating opportunities for portfolio optimization and selective repricing
  to strengthen overall earnings quality.
</p>

      </div>

    </Panel>
  );
}