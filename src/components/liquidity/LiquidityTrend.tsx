import Panel from "../ui/Panel";
import { liquidityTrend } from "../../data/liquidity";


export default function LiquidityTrend() {

  const max = Math.max(...liquidityTrend.map((d) => d.value)) + 10;

  return (

    <Panel title="30 Days Liquidity Trend">

      <div className="flex h-80 items-end gap-5">

        {liquidityTrend.map((item) => (

          <div
            key={item.day}
            className="flex flex-1 flex-col items-center"
          >

            <div className="mb-3 text-sm font-semibold text-cyan-400">

              {item.value}%

            </div>

            <div className="relative flex w-full items-end">

              <div
                className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-500 hover:brightness-110"
                style={{
                  height: `${(item.value / max) * 220}px`,
                }}
              />

            </div>

            <div className="mt-4 text-xs uppercase tracking-wider text-slate-500">

              {item.day}

            </div>

          </div>

        ))}

      </div>

    </Panel>

  );

}