import { useEffect, useState } from "react";

import {
  getCreditSectors,
  type CreditSector,
} from "../../services/creditMomentumApi";

export default function SectorExposure() {
  const [sectors, setSectors] = useState<CreditSector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getCreditSectors(controller.signal)
      .then((data) => {
        setSectors(data);
        setIsUnavailable(data.length === 0);
      })
      .catch((error: unknown) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
        setIsUnavailable(true);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  const totalExposure = sectors.reduce(
    (sum, item) => sum + item.exposure,
    0,
  );

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
            {isLoading ? "—" : "Rp" + totalExposure.toFixed(1) + " T"}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-10 space-y-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-slate-800"
            />
          ))}
        </div>
      )}

      {!isLoading && isUnavailable && (
        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-950/60 p-8 text-center text-slate-400">
          Sector concentration data is currently unavailable.
        </div>
      )}

      {!isLoading && !isUnavailable && (
        <div className="mt-10 space-y-8">
          {sectors.map((item, index) => {
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
                      Exposure Rp{item.exposure.toFixed(1)} T
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">
                      {item.npl.toFixed(2)}%
                    </p>
                    <p className="text-sm text-slate-500">
                      Gross NPL
                    </p>
                  </div>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className={barColor + " h-full rounded-full transition-all duration-700"}
                    style={{ width: item.percentage + "%" }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-500">
                    Portfolio Share
                  </span>
                  <span className="text-slate-400">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
