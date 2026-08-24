import { useEffect, useState } from "react";

import {
  getCreditWatchlist,
  type CreditWatchlistItem,
} from "../../services/creditMomentumApi";

const priorityStyle: Record<string, string> = {
  High: "bg-red-500/20 text-red-300 border border-red-500/40",
  Medium: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
  Low: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
};

const colStyle: Record<string, string> = {
  "COL 2": "bg-emerald-500/20 text-emerald-300",
  "COL 3": "bg-yellow-500/20 text-yellow-300",
  "COL 4": "bg-orange-500/20 text-orange-300",
  "COL 5": "bg-red-500/20 text-red-300",
};

export default function WatchlistTable() {
  const [watchlist, setWatchlist] = useState<CreditWatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getCreditWatchlist(controller.signal)
      .then((data) => {
        setWatchlist(data);
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

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Priority Watchlist
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Accounts Requiring Attention
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Active Cases
          </p>
          <p className="mt-1 text-4xl font-bold text-white">
            {isLoading ? "—" : watchlist.length}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-800" />
      )}

      {!isLoading && isUnavailable && (
        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-8 text-center text-slate-400">
          Priority watchlist data is currently unavailable.
        </div>
      )}

      {!isLoading && !isUnavailable && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full">
            <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 text-left">Debtor</th>
                <th className="px-4 py-4 text-center">Exposure</th>
                <th className="px-4 py-4 text-center">DPD</th>
                <th className="px-4 py-4 text-center">COL</th>
                <th className="px-4 py-4 text-center">Priority</th>
                <th className="px-4 py-4 text-center">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr
                  key={item.debtor}
                  className="border-t border-slate-800 transition-all duration-200 hover:bg-slate-800/40"
                >
                  <td className="px-6 py-5 font-medium text-white">
                    {item.debtor}
                  </td>
                  <td className="px-4 py-5 text-center text-slate-300">
                    Rp{item.exposure.toLocaleString("en-US")} B
                  </td>
                  <td className="px-4 py-5 text-center font-semibold text-white">
                    {item.dpd}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold " +
                        (colStyle[item.coll] ??
                          "bg-slate-700 text-slate-300")
                      }
                    >
                      {item.coll}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold " +
                        (priorityStyle[item.priority] ??
                          "bg-slate-700 text-slate-300")
                      }
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
