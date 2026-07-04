import { sectorExposure } from "../../data/credit";

export default function SectorExposure() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Portfolio Analytics
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Sector Concentration
          </h2>

        </div>

        <div className="text-right">

          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Total Exposure
          </p>

          <p className="mt-1 text-xl font-bold">
            Rp25.8 T
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-6">

        {sectorExposure.map((sector) => (

          <div key={sector.name}>

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  {sector.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Exposure {sector.exposure}
                </p>

              </div>

              <div className="text-right">

                <p className="text-xl font-bold">
                  {sector.npl}
                </p>

                <p className="text-xs text-slate-500">
                  Gross NPL
                </p>

              </div>

            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className={`h-full rounded-full ${
                  sector.status === "Watch"
                    ? "bg-amber-400"
                    : "bg-cyan-400"
                }`}
                style={{
                  width: `${sector.percentage}%`,
                }}
              />

            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">

              <span>
                Portfolio Share
              </span>

              <span>
                {sector.percentage}%
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}