import Panel from "../ui/Panel";
import { portfolioComposition } from "../../data/treasury";

export default function PortfolioComposition() {

  const averageYield = 6.84;
  const modifiedDuration = 3.48;
  const averageRating = "AAA";
  const liquidityScore = "High";

  return (

    <Panel>

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
        Portfolio Analytics
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Investment Composition
      </h2>

      <p className="mt-3 leading-7 text-slate-400">
        Current Treasury investment allocation by instrument
        category together with key portfolio characteristics.
      </p>

      {/* KPI */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-8 py-6">

        <div className="flex items-center justify-between">

          <div className="flex-1">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Average Yield
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-400">
              {averageYield.toFixed(2)}%
            </p>

          </div>

          <div className="flex-1 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Modified Duration
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {modifiedDuration.toFixed(2)}
            </p>

          </div>

          <div className="flex-1 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Average Rating
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {averageRating}
            </p>

          </div>

          <div className="flex-1 text-right">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Liquidity Score
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-400">
              {liquidityScore}
            </p>

          </div>

        </div>

      </div>

      {/* Allocation */}

      <div className="mt-10 space-y-7">

        {portfolioComposition.map((item) => (

          <div
            key={item.name}
            className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5"
          >

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-white">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Strategic Allocation
                </p>

              </div>

              <div className="text-right">

                <p className="text-2xl font-bold text-cyan-400">
                  {item.value.toFixed(2)}%
                </p>

              </div>

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-800">

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

      {/* Executive Insight */}

      <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-cyan-400">
          PRISM Executive Insight
        </p>

        <p className="mt-4 leading-8 text-slate-300">

          Treasury investments remain highly concentrated in
          Government Securities, including SUN, SRBI and SBSN,
          representing approximately
          <span className="font-semibold text-cyan-400">
            {" "}92.00%
          </span>
          of the total portfolio.
          This conservative allocation provides
          strong liquidity,
          minimal credit risk,
          and stable recurring income while maintaining
          full compliance with the Bank's investment strategy.

        </p>

      </div>

    </Panel>

  );

}