import { useEffect, useState } from "react";
import Panel from "../ui/Panel";

import {
  getTreasuryPortfolioRisk,
  type TreasuryPortfolioRisk,
} from "../../services/treasuryRiskApi";

function formatAmount(value: number) {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000_000_000) {
    return `Rp${(absoluteValue / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (absoluteValue >= 1_000_000_000) {
    return `Rp${(absoluteValue / 1_000_000_000).toFixed(2)}B`;
  }

  if (absoluteValue >= 1_000_000) {
    return `Rp${(absoluteValue / 1_000_000).toFixed(2)}M`;
  }

  return `Rp${absoluteValue.toLocaleString("en-US")}`;
}

function formatImpact(value: number) {
  if (value === 0) {
    return "—";
  }

  return `(${formatAmount(value)})`;
}

export default function DurationAnalysis() {
  const [risk, setRisk] =
    useState<TreasuryPortfolioRisk | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const data =
          await getTreasuryPortfolioRisk();

        if (active) {
          setRisk(data);
        }
      } catch (error) {
        console.error(
          "Failed to load Interest Rate Sensitivity",
          error,
        );
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

  const sensitivity =
    risk?.interestRateSensitivity;

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Interest Rate Risk
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Interest Rate Sensitivity
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Portfolio sensitivity by remaining tenor,
            measured through DV01 and a parallel
            +100 bps yield shock.
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
          {loading ? "Loading..." : "Live"}
        </div>
      </div>

      {!sensitivity ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center text-sm text-slate-500">
          Interest rate sensitivity data is not available.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-slate-800/80">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-white">
                    Tenor Bucket
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    Outstanding
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    DV01
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    % DV01
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold text-white">
                    +100 bps Impact
                  </th>
                </tr>
              </thead>

              <tbody>
                {sensitivity.buckets.map(
                  (item) => (
                    <tr
                      key={item.bucket}
                      className="border-t border-slate-800 transition hover:bg-slate-800/30"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-slate-200">
                        {item.bucket}
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-slate-300">
                        {formatAmount(
                          item.outstanding,
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-cyan-400">
                        {formatAmount(item.dv01)}
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-slate-300">
                        {item.dv01Contribution.toFixed(
                          2,
                        )}
                        %
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-semibold text-rose-400">
                        {formatImpact(
                          item.shock100bpsImpact,
                        )}
                      </td>
                    </tr>
                  ),
                )}

                <tr className="border-t border-cyan-500/30 bg-cyan-500/[0.06]">
                  <td className="px-5 py-4 text-sm font-bold text-white">
                    Grand Total
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-white">
                    {formatAmount(
                      sensitivity.total
                        .outstanding,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-cyan-400">
                    {formatAmount(
                      sensitivity.total.dv01,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-white">
                    {sensitivity.total.dv01Contribution.toFixed(
                      2,
                    )}
                    %
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-bold text-rose-400">
                    {formatImpact(
                      sensitivity.total
                        .shock100bpsImpact,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        +100 bps impact represents the estimated
        first-order market value impact of a parallel
        upward shift in the yield curve.
      </p>
    </Panel>
  );
}