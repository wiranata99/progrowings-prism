import Panel from "../ui/Panel";

import { portfolioComposition } from "../../data/treasury";

export default function PortfolioComposition() {
  return (
    <Panel>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
        Portfolio Allocation
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Investment Composition
      </h2>

      <p className="mt-3 text-slate-400 leading-7">
        Current investment allocation by instrument category.
      </p>

      <div className="mt-10 space-y-7">

        {portfolioComposition.map((item) => (

          <div key={item.name}>

            <div className="mb-2 flex items-center justify-between">

              <span className="font-medium text-white">
                {item.name}
              </span>

              <span className="font-bold text-cyan-400">
                {item.value}%
              </span>

            </div>

            <div className="h-4 rounded-full bg-slate-800 overflow-hidden">

              <div
                className={`${item.color} h-full rounded-full transition-all duration-700`}
                style={{
                  width: `${item.value}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

      <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Executive Insight
        </p>

        <p className="mt-4 leading-8 text-slate-300">
          The investment portfolio remains highly concentrated in
          Government Securities (SUN, SRBI and SBSN),
          representing
          <span className="font-semibold text-cyan-400"> 92% </span>
          of total investments.
          This allocation provides high liquidity,
          low credit risk,
          and strong compliance with the Bank's
          conservative investment strategy.
        </p>

      </div>

    </Panel>
  );
}