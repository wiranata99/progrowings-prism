import { useEffect, useState } from "react";

import Panel from "../ui/Panel";

import {
  getTreasuryStrategicIntelligence,
  type StrategicAssessment,
  type StrategicMarketIndicator,
  type TreasuryStrategicIntelligenceData,
} from "../../services/treasuryStrategicIntelligenceApi";

export default function StrategicIntelligence() {
  const [data, setData] =
    useState<TreasuryStrategicIntelligenceData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(false);

        const result =
          await getTreasuryStrategicIntelligence();

        if (active) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Failed to load Treasury Strategic Intelligence",
          err,
        );

        if (active) {
          setData(null);
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Panel>

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Strategic Intelligence
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            External Drivers & Portfolio Impact
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Connecting external market developments with the Bank's
            Treasury portfolio exposure and strategic implications.
          </p>

        </div>

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          {loading ? "Loading..." : "Live Assessment"}
        </div>

      </div>

      {/* Market Data */}

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[145px] animate-pulse rounded-2xl border border-slate-800 bg-slate-950"
            />
          ))}

        {!loading &&
          data?.marketData.map((item) => (
            <MarketCard
              key={item.code}
              item={item}
            />
          ))}

      </div>

      {/* Strategic Drivers */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900/70">

            <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">

              <th className="px-5 py-4">
                External Driver
              </th>

              <th className="px-5 py-4">
                Portfolio Impact
              </th>

              <th className="px-5 py-4">
                Assessment
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (
              <tr className="border-t border-slate-800">
                <td
                  colSpan={3}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  Loading strategic assessment...
                </td>
              </tr>
            )}

            {!loading &&
              data?.drivers.map((item) => (

                <tr
                  key={item.indicatorCode}
                  className="border-t border-slate-800 transition hover:bg-slate-800/40"
                >

                  <td className="px-5 py-5 font-medium text-white">
                    {item.event}
                  </td>

                  <td className="px-5 py-5 leading-7 text-slate-300">
                    {item.impact}
                  </td>

                  <td className="px-5 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${assessmentBadge(
                        item.outlook,
                      )}`}
                    >
                      {item.outlook}
                    </span>

                  </td>

                </tr>

              ))}

            {!loading &&
              !error &&
              data?.drivers.length === 0 && (

                <tr className="border-t border-slate-800">
                  <td
                    colSpan={3}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No material external Treasury drivers identified.
                  </td>
                </tr>

              )}

            {!loading && error && (

              <tr className="border-t border-slate-800">
                <td
                  colSpan={3}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  Strategic Intelligence data is currently unavailable.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* PRISM Strategic Conclusion */}

      <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.20em] text-violet-300">
          PRISM Strategic Conclusion
        </p>

        <p className="mt-4 leading-8 text-slate-300">

          {loading
            ? "Generating strategic assessment..."
            : error
              ? "Strategic assessment is currently unavailable."
              : data?.strategicConclusion}

        </p>

      </div>

    </Panel>
  );
}

function MarketCard({
  item,
}: {
  item: StrategicMarketIndicator;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-500/40">

      <p className="text-sm text-slate-500">
        {item.title}
      </p>

      <h3
        className={`mt-3 text-3xl font-bold ${marketValueColor(
          item.code,
          item.direction,
        )}`}
      >
        {item.formattedValue}
      </h3>

      <div className="mt-4">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${marketChangeBadge(
            item.code,
            item.direction,
          )}`}
        >
          {item.change}
        </span>

      </div>

    </div>
  );
}

function assessmentBadge(
  status: StrategicAssessment,
) {
  if (status === "Positive") {
    return "bg-emerald-500/15 text-emerald-300";
  }

  if (status === "Watch") {
    return "bg-amber-500/15 text-amber-300";
  }

  return "bg-cyan-500/15 text-cyan-300";
}

function marketValueColor(
  code: string,
  direction: "UP" | "DOWN" | "HOLD",
) {
  if (code === "USD_IDR") {
    return "text-amber-400";
  }

  if (code === "GOLD") {
    return "text-yellow-300";
  }

  if (code === "BRENT_OIL") {
    return "text-sky-400";
  }

  if (code === "IHSG") {
    return "text-emerald-400";
  }

  if (direction === "HOLD") {
    return "text-white";
  }

  return "text-cyan-400";
}

function marketChangeBadge(
  code: string,
  direction: "UP" | "DOWN" | "HOLD",
) {
  if (direction === "HOLD") {
    return "bg-slate-700/40 text-slate-300";
  }

  /*
   * Market meaning is instrument-specific:
   * - Higher USD/IDR = IDR depreciation → adverse/watch.
   * - Higher bond yields = valuation pressure → watch.
   * - Higher IHSG = supportive.
   * - Higher Gold = shown as market movement, not Treasury risk status.
   */

  if (code === "USD_IDR") {
    return direction === "UP"
      ? "bg-rose-500/15 text-rose-300"
      : "bg-emerald-500/15 text-emerald-300";
  }

  if (
    code === "INDO_GOVT_10Y" ||
    code === "UST_10Y"
  ) {
    return direction === "UP"
      ? "bg-amber-500/15 text-amber-300"
      : "bg-emerald-500/15 text-emerald-300";
  }

  if (code === "IHSG") {
    return direction === "UP"
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-rose-500/15 text-rose-300";
  }

  if (code === "FED_FUNDS") {
    return direction === "DOWN"
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-amber-500/15 text-amber-300";
  }

  if (code === "GOLD") {
    return "bg-yellow-500/15 text-yellow-300";
  }

  if (code === "BRENT_OIL") {
    return "bg-cyan-500/15 text-cyan-300";
  }

  return "bg-cyan-500/15 text-cyan-300";
}