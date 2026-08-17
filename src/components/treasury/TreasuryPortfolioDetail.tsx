import { useEffect, useMemo, useState } from "react";
import Panel from "../ui/Panel";

import {
  getTreasuryPortfolioRisk,
  type TreasuryPortfolioRisk,
} from "../../services/treasuryRiskApi";

function formatRupiah(value: number) {
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

  return `Rp${absoluteValue.toLocaleString("id-ID")}`;
}

function formatSignedRupiah(value: number) {
  if (value === 0) {
    return "—";
  }

  const formatted = formatRupiah(value);

  return value < 0
    ? `(${formatted})`
    : `+${formatted}`;
}

function formatInstrumentType(value: string) {
  const normalized = value.toUpperCase();

  if (normalized === "SRBI") {
    return "SRBI";
  }

  if (normalized === "SBSN") {
    return "SBSN";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAccountingClass(value: string | null) {
  if (!value) {
    return "—";
  }

  const normalized = value
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");

  if (
    normalized === "AMORTIZED_COST" ||
    normalized === "AMORTISED_COST"
  ) {
    return "AC";
  }

  return value.toUpperCase();
}

function formatTenor(years: number) {
  return (years * 12).toFixed(2);
}

function pnlColor(value: number) {
  if (value > 0) {
    return "text-emerald-400";
  }

  if (value < 0) {
    return "text-rose-400";
  }

  return "text-slate-400";
}

export default function TreasuryPortfolioDetail() {
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
          "Failed to load Treasury Portfolio Detail",
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

  const instruments = useMemo(
    () => risk?.instruments ?? [],
    [risk],
  );

  const totals = useMemo(() => {
    const bookValue = instruments.reduce(
      (sum, item) => sum + item.bookValue,
      0,
    );

    const marketValue = instruments.reduce(
      (sum, item) => sum + item.marketValue,
      0,
    );

    const mtmPnl =
      marketValue - bookValue;

    const pnlPct =
      bookValue > 0
        ? (mtmPnl / bookValue) * 100
        : 0;

    const weightedYield =
      marketValue > 0
        ? instruments.reduce(
            (sum, item) =>
              sum +
              item.currentYield *
                item.marketValue,
            0,
          ) / marketValue
        : 0;

    const weightedTenor =
      marketValue > 0
        ? instruments.reduce(
            (sum, item) =>
              sum +
              item.remainingTenorYears *
                item.marketValue,
            0,
          ) / marketValue
        : 0;

    const weightedDuration =
      marketValue > 0
        ? instruments.reduce(
            (sum, item) =>
              sum +
              item.modifiedDuration *
                item.marketValue,
            0,
          ) / marketValue
        : 0;

    const dv01 = instruments.reduce(
      (sum, item) => sum + item.dv01,
      0,
    );

    return {
      bookValue,
      marketValue,
      mtmPnl,
      pnlPct,
      weightedYield,
      weightedTenor,
      weightedDuration,
      dv01,
    };
  }, [instruments]);

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Treasury Portfolio
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Portfolio Detail
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Instrument-level valuation, market exposure,
            and interest-rate risk profile.
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
          {loading ? "Loading..." : "Live"}
        </div>
      </div>

      {instruments.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center text-sm text-slate-500">
          Treasury portfolio detail is not available.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1350px] border-collapse">
              <thead>
                <tr className="bg-slate-800/80">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white">
                    Instrument
                  </th>

                  <th className="px-4 py-4 text-center text-xs font-semibold text-white">
                    CCY
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    Book Value
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    Market Value
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    MTM Gain/(Loss)
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    P/L %
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    Yield
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    Tenor (in Months)
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    Mod. Duration
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold text-white">
                    DV01
                  </th>
                </tr>
              </thead>

              <tbody>
                {instruments.map((item) => {
                  const mtmPnl =
                    item.marketValue -
                    item.bookValue;

                  const pnlPct =
                    item.bookValue > 0
                      ? (mtmPnl /
                          item.bookValue) *
                        100
                      : 0;

                  return (
                    <tr
                      key={item.instrumentId}
                      className="border-t border-slate-800 transition hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-slate-200">
                          {item.instrumentName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatInstrumentType(
                            item.instrumentType,
                          )}
                          {" | "}
                          {formatAccountingClass(
                            item.accountingClass,
                          )}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-300">
                          {item.currency}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-slate-300">
                        {formatRupiah(
                          item.bookValue,
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-slate-200">
                        {formatRupiah(
                          item.marketValue,
                        )}
                      </td>

                      <td
                        className={`px-4 py-4 text-right text-sm font-semibold ${pnlColor(
                          mtmPnl,
                        )}`}
                      >
                        {formatSignedRupiah(
                          mtmPnl,
                        )}
                      </td>

                      <td
                        className={`px-4 py-4 text-right text-sm font-semibold ${pnlColor(
                          pnlPct,
                        )}`}
                      >
                        {pnlPct > 0
                          ? "+"
                          : ""}
                        {pnlPct.toFixed(2)}%
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-slate-300">
                        {item.currentYield.toFixed(
                          2,
                        )}
                        %
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-slate-300">
                        {formatTenor(
                          item.remainingTenorYears,
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm text-cyan-400">
                        {item.modifiedDuration.toFixed(
                          2,
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-cyan-400">
                        {formatRupiah(
                          item.dv01,
                        )}
                      </td>
                    </tr>
                  );
                })}

                <tr className="border-t border-cyan-500/30 bg-cyan-500/[0.06]">
                  <td
                    colSpan={2}
                    className="px-4 py-4 text-sm font-bold text-white"
                  >
                    Grand Total
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-white">
                    {formatRupiah(
                      totals.bookValue,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-white">
                    {formatRupiah(
                      totals.marketValue,
                    )}
                  </td>

                  <td
                    className={`px-4 py-4 text-right text-sm font-bold ${pnlColor(
                      totals.mtmPnl,
                    )}`}
                  >
                    {formatSignedRupiah(
                      totals.mtmPnl,
                    )}
                  </td>

                  <td
                    className={`px-4 py-4 text-right text-sm font-bold ${pnlColor(
                      totals.pnlPct,
                    )}`}
                  >
                    {totals.pnlPct > 0
                      ? "+"
                      : ""}
                    {totals.pnlPct.toFixed(2)}%
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-white">
                    {totals.weightedYield.toFixed(
                      2,
                    )}
                    %
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-white">
                    {formatTenor(
                      totals.weightedTenor,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-cyan-400">
                    {totals.weightedDuration.toFixed(
                      2,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-bold text-cyan-400">
                    {formatRupiah(
                      totals.dv01,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        MTM Gain/(Loss) represents the difference
        between Market Value and Book Value. Portfolio
        Yield, Tenor, and Modified Duration are
        market-value-weighted averages, while DV01 is
        aggregated across instruments.
      </p>
    </Panel>
  );
}