import { useEffect, useState } from "react";
import Panel from "../ui/Panel";

import {
  getTreasuryComposition,
  type TreasuryComposition,
  type TreasuryCompositionMetric,
} from "../../services/treasuryCompositionApi";

type CurrencyColumn = "IDR" | "USD" | "TOTAL";

const columns: {
  key: CurrencyColumn;
  label: string;
}[] = [
  { key: "IDR", label: "IDR" },
  { key: "USD", label: "USD" },
  { key: "TOTAL", label: "Grand Total" },
];

function formatAmount(value: number) {
  if (value === 0) {
    return "—";
  }

  if (value >= 1_000_000_000_000) {
    return `Rp${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(2)}M`;
  }

  return `Rp${value.toLocaleString("en-US")}`;
}

function MetricRows({
  data,
}: {
  data: Record<
    CurrencyColumn,
    TreasuryCompositionMetric
  >;
}) {
  return (
    <>
      <tr className="border-t border-slate-800/70">
        <td className="py-2.5 pl-4 pr-3 text-xs text-slate-500">
          Amount
        </td>

        {columns.map(({ key }) => (
          <td
            key={key}
            className="px-3 py-2.5 text-right text-sm font-semibold text-slate-200"
          >
            {formatAmount(data[key].amount)}
          </td>
        ))}
      </tr>

      <tr>
        <td className="py-2.5 pl-4 pr-3 text-xs text-slate-500">
          Contractual Expense
        </td>

        {columns.map(({ key }) => (
          <td
            key={key}
            className="px-3 py-2.5 text-right text-sm text-slate-300"
          >
            {data[key].amount === 0
              ? "—"
              : `${data[key].rate.toFixed(2)}%`}
          </td>
        ))}
      </tr>

      <tr>
        <td className="pb-3 pt-2.5 pl-4 pr-3 text-xs text-slate-500">
          Aggregate Tenor
          <span className="ml-1 text-[10px] text-slate-600">
            (months)
          </span>
        </td>

        {columns.map(({ key }) => (
          <td
            key={key}
            className="px-3 pb-3 pt-2.5 text-right text-sm text-slate-300"
          >
            {data[key].amount === 0
              ? "—"
              : data[key].tenor.toFixed(2)}
          </td>
        ))}
      </tr>
    </>
  );
}

export default function TreasuryFundingComposition() {
  const [composition, setComposition] =
    useState<TreasuryComposition | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const data =
          await getTreasuryComposition();

        if (active) {
          setComposition(data);
        }
      } catch (error) {
        console.error(
          "Failed to load Treasury Funding Composition",
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

  const funding =
    composition?.funding;

  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Treasury Funding
          </p>

          <h2 className="mt-2 text-xl font-bold text-white">
            Funding Composition
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Funding structure by rate type and
            underlying currency.
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
          {loading ? "Loading..." : "Live"}
        </div>
      </div>

      {!funding ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center text-sm text-slate-500">
          Treasury funding data is not available.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/30">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Rate Type
                  </th>

                  {columns.map(
                    ({ key, label }) => (
                      <th
                        key={key}
                        className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                <tr className="bg-cyan-500/[0.04]">
                  <td
                    colSpan={4}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400"
                  >
                    Fixed
                  </td>
                </tr>

                <MetricRows
                  data={funding.fixed}
                />

                <tr className="border-t border-slate-800 bg-cyan-500/[0.04]">
                  <td
                    colSpan={4}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400"
                  >
                    Floating
                  </td>
                </tr>

                <MetricRows
                  data={funding.floating}
                />

                <tr className="border-t border-cyan-500/20 bg-cyan-500/[0.07]">
                  <td
                    colSpan={4}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white"
                  >
                    Total
                  </td>
                </tr>

                <MetricRows
                  data={funding.total}
                />
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Panel>
  );
}