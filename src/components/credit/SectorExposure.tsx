import { sectorExposure } from "../../data/credit";

export default function SectorExposure() {
  const totalExposure = sectorExposure.reduce((sum, item) => {
    const value = Number(item.exposure.replace(/[^\d.]/g, ""));
    return sum + value;
  }, 0);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Portfolio Analytics
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Sector Concentration
          </h2>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Total Exposure
          </p>

          <p className="mt-1 text-4xl font-bold text-white">
            Rp{totalExposure.toFixed(1)} T
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {sectorExposure.map((item, index) => {
          const barColor =
            index === 0 ? "bg-amber-400" : "bg-cyan-400";

          return (
            <div key={item.name}>
              <div className="flex items-start justify-between">

                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-slate-400">
                    Exposure {item.exposure}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {item.npl}
                  </p>

                  <p className="text-sm text-slate-500">
                    Gross NPL
                  </p>
                </div>

              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={`${barColor} h-full rounded-full transition-all duration-700`}
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">
                  Portfolio Share
                </span>

                <span className="text-slate-400">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}