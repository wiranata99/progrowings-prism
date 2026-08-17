import { useEffect, useMemo, useState } from "react";
import Panel from "../ui/Panel";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  getTreasuryMomentum,
  treasuryMomentumBenchmarks,
  type TreasuryMomentumBenchmark,
  type TreasuryMomentumCurrency,
  type TreasuryMomentumData,
  type TreasuryMomentumPeriod,
} from "../../services/treasuryMomentumApi";

// =========================================================
// CONSTANTS
// =========================================================

const periods: {
  label: string;
  value: TreasuryMomentumPeriod;
}[] = [
  { label: "5D", value: 5 },
  { label: "10D", value: 10 },
  { label: "20D", value: 20 },
  { label: "30D", value: 30 },
];

const currencies: TreasuryMomentumCurrency[] = [
  "ALL",
  "IDR",
  "USD",
];

// =========================================================
// COMPONENT
// =========================================================

export default function TreasuryPerformanceTrend() {
  const [currency, setCurrency] =
    useState<TreasuryMomentumCurrency>("ALL");

  const [benchmark, setBenchmark] =
    useState<TreasuryMomentumBenchmark>("INDONIA");

  const [period, setPeriod] =
    useState<TreasuryMomentumPeriod>(30);

  const [data, setData] =
    useState<TreasuryMomentumData | null>(null);

  const [loading, setLoading] =
    useState(true);

  // =======================================================
  // BENCHMARK OPTIONS
  // =======================================================

  const benchmarkOptions =
    treasuryMomentumBenchmarks[currency];

  // =======================================================
  // LOAD BACKEND DATA
  // =======================================================

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);

        const result =
          await getTreasuryMomentum(
            currency,
            benchmark,
            period,
          );

        if (active) {
          setData(result);
        }
      } catch (error) {
        console.error(
          "Failed to load Treasury Momentum",
          error,
        );

        if (active) {
          setData(null);
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
  }, [currency, benchmark, period]);

  // =======================================================
  // CURRENCY CHANGE
  // Automatically reset benchmark to valid benchmark
  // for selected currency.
  // =======================================================

  function handleCurrencyChange(
    nextCurrency: TreasuryMomentumCurrency,
  ) {
    const nextBenchmarks =
      treasuryMomentumBenchmarks[nextCurrency];

    setCurrency(nextCurrency);

    setBenchmark(
      nextBenchmarks[0].value,
    );
  }

  // =======================================================
  // LATEST SNAPSHOT
  // =======================================================

  const latest = data?.latest;

  const assetYield =
    latest?.assetYield ?? 0;

  const liabilityExpense =
    latest?.liabilityExpense ?? 0;

  const selectedBenchmark =
    latest?.benchmark ?? 0;

  const treasurySpread =
    latest?.treasurySpreadBps ?? 0;

  const assetToBenchmark =
    latest?.assetToBenchmarkBps ?? 0;

  // =======================================================
  // DYNAMIC Y AXIS
  // =======================================================

  const yDomain = useMemo(() => {
    if (!data?.trend.length) {
      return [0, 10];
    }

    const values = data.trend.flatMap(
      (item) => [
        item.assetYield,
        item.liabilityExpense,
        ...(item.benchmark !== null
          ? [item.benchmark]
          : []),
      ],
    );

    const min =
      Math.min(...values);

    const max =
      Math.max(...values);

    const padding =
      Math.max(
        (max - min) * 0.18,
        0.15,
      );

    return [
      Number(
        (min - padding).toFixed(2),
      ),
      Number(
        (max + padding).toFixed(2),
      ),
    ];
  }, [data]);

  // =======================================================
  // EXECUTIVE INSIGHT
  // =======================================================

  const executiveInsight = useMemo(() => {
    if (!latest || !data) {
      return "Treasury momentum data is currently unavailable.";
    }

    const spreadDirection =
      treasurySpread >= 0
        ? "positive"
        : "negative";

    const benchmarkPosition =
      assetToBenchmark >= 0
        ? "above"
        : "below";

    return (
      <>
        Interest-bearing assets currently generate a yield of{" "}
        <span className="font-semibold text-cyan-400">
          {assetYield.toFixed(2)}%
        </span>
        , against interest-bearing liability expense of{" "}
        <span className="font-semibold text-amber-400">
          {liabilityExpense.toFixed(2)}%
        </span>
        , producing a{" "}
        <span
          className={
            treasurySpread >= 0
              ? "font-semibold text-emerald-400"
              : "font-semibold text-rose-400"
          }
        >
          {spreadDirection} spread of{" "}
          {treasurySpread >= 0 ? "+" : ""}
          {treasurySpread.toFixed(0)} bps
        </span>
        . Asset yield remains{" "}
        {benchmarkPosition} the selected{" "}
        <span className="font-semibold text-white">
          {data.benchmarkLabel}
        </span>{" "}
        benchmark by{" "}
        <span
          className={
            assetToBenchmark >= 0
              ? "font-semibold text-emerald-400"
              : "font-semibold text-rose-400"
          }
        >
          {assetToBenchmark >= 0 ? "+" : ""}
          {assetToBenchmark.toFixed(0)} bps
        </span>
        .
      </>
    );
  }, [
    latest,
    data,
    assetYield,
    liabilityExpense,
    treasurySpread,
    assetToBenchmark,
  ]);

  return (
    <Panel>
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Treasury Momentum
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Asset Yield vs Funding Expense
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Monitoring interest-bearing asset yield,
            interest-bearing liability expense, and
            selected market benchmark across currency
            portfolios.
          </p>
        </div>

        {/* PERIOD */}

        <div className="flex flex-wrap gap-2">
          {periods.map((item) => (
            <button
              key={item.value}
              onClick={() =>
                setPeriod(item.value)
              }
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                period === item.value
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                  : "border border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================
          SELECTORS
      =================================================== */}

      <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/30 p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* CURRENCY */}

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Currency
          </span>

          <div className="flex gap-2">
            {currencies.map((item) => (
              <button
                key={item}
                onClick={() =>
                  handleCurrencyChange(item)
                }
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  currency === item
                    ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* BENCHMARK */}

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Benchmark
          </span>

          <div className="flex flex-wrap gap-2">
            {benchmarkOptions.map(
              (item) => (
                <button
                  key={item.value}
                  onClick={() =>
                    setBenchmark(
                      item.value,
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    benchmark ===
                    item.value
                      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          KPI CARDS
      =================================================== */}

      <div className="mt-7 grid gap-4 lg:grid-cols-4">
        <MetricCard
          title="Interest-Bearing Asset Yield"
          value={
            loading
              ? "—"
              : `${assetYield.toFixed(2)}%`
          }
          color="text-cyan-400"
        />

        <MetricCard
          title="Interest-Bearing Liability Expense"
          value={
            loading
              ? "—"
              : `${liabilityExpense.toFixed(2)}%`
          }
          color="text-amber-400"
        />

        <MetricCard
          title="Net Interest Spread"
          value={
            loading
              ? "—"
              : `${
                  treasurySpread >= 0
                    ? "+"
                    : ""
                }${treasurySpread.toFixed(
                  0,
                )} bps`
          }
          color={
            treasurySpread >= 0
              ? "text-emerald-400"
              : "text-rose-400"
          }
        />

        <MetricCard
          title={
            data?.benchmarkLabel ??
            "Selected Benchmark"
          }
          value={
            loading
              ? "—"
              : `${selectedBenchmark.toFixed(
                  2,
                )}%`
          }
          color="text-white"
        />
      </div>

      {/* ===================================================
          CHART LEGEND
      =================================================== */}

      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-7">
          <LegendItem
            color="bg-cyan-400"
            label="Asset Yield"
          />

          <LegendItem
            color="bg-amber-400"
            label="Liability Expense"
          />

          <div className="flex items-center gap-2">
            <span className="h-0.5 w-8 border-t-2 border-dashed border-emerald-400" />

            <span className="text-sm text-slate-300">
              {data?.benchmarkLabel ??
                "Benchmark"}
            </span>
          </div>
        </div>

        <span className="text-sm text-slate-500">
          {currency} · Last {period} Trading Days
        </span>
      </div>

      {/* ===================================================
          CHART
      =================================================== */}

      <div className="mt-7 h-[440px]">
        {loading ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/20 text-sm text-slate-500">
            Loading Treasury Momentum...
          </div>
        ) : data?.trend.length ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data.trend}>
              <CartesianGrid
                stroke="#243244"
                strokeDasharray="4 6"
              />

              <XAxis
                dataKey="day"
                tick={{
                  fill: "#94A3B8",
                  fontSize: 13,
                }}
                tickLine={false}
                axisLine={false}
                minTickGap={25}
              />

              <YAxis
                domain={yDomain}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 13,
                }}
                tickFormatter={(value) =>
                  `${Number(
                    value,
                  ).toFixed(2)}%`
                }
                tickLine={false}
                axisLine={false}
                width={65}
              />

              <Tooltip
                content={
                  <MomentumTooltip />
                }
                cursor={{
                  stroke: "#22D3EE",
                  strokeWidth: 1,
                  strokeDasharray:
                    "5 5",
                }}
              />

              <Line
                type="monotone"
                dataKey="assetYield"
                stroke="#22D3EE"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 7,
                  fill: "#22D3EE",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                name="Asset Yield"
              />

              <Line
                type="monotone"
                dataKey="liabilityExpense"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 7,
                }}
                name="Liability Expense"
              />

              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#10B981"
                strokeWidth={2.5}
                strokeDasharray="8 6"
                dot={false}
                connectNulls
                activeDot={{
                  r: 6,
                }}
                name={
                  data.benchmarkLabel
                }
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/20 text-sm text-slate-500">
            Treasury momentum data is not available.
          </div>
        )}
      </div>

      {/* ===================================================
          EXECUTIVE INSIGHT
      =================================================== */}

      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.20em] text-emerald-400">
              Executive Insight
            </p>

            <p className="mt-4 max-w-5xl leading-8 text-slate-300">
              {loading
                ? "Loading Treasury Momentum assessment..."
                : executiveInsight}
            </p>
          </div>

          <div className="shrink-0 lg:ml-10 lg:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Analysis
            </p>

            <p className="mt-2 text-lg font-bold text-cyan-400">
              {currency} ·{" "}
              {data?.benchmarkLabel ??
                "Benchmark"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Last {period} Trading Days
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// =========================================================
// METRIC CARD
// =========================================================

interface MetricCardProps {
  title: string;
  value: string;
  color: string;
}

function MetricCard({
  title,
  value,
  color,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <p className="min-h-[32px] text-xs uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${color}`}
      >
        {value}
      </p>
    </div>
  );
}

// =========================================================
// LEGEND
// =========================================================

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${color}`}
      />

      <span className="text-sm text-slate-300">
        {label}
      </span>
    </div>
  );
}

// =========================================================
// TOOLTIP
// =========================================================

function MomentumTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | null;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
}) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  return (
    <div className="min-w-[230px] rounded-xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl">
      <p className="mb-3 text-sm font-semibold text-white">
        {label}
      </p>

      <div className="space-y-2">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    item.color,
                }}
              />

              <span className="text-xs text-slate-400">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-semibold text-white">
              {item.value !== null &&
              item.value !== undefined
                ? `${Number(
                    item.value,
                  ).toFixed(2)}%`
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}