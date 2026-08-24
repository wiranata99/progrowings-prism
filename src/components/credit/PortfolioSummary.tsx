import { useEffect, useMemo, useState } from "react";

import MetricCard from "../cards/MetricCard";
import {
  getCreditSummary,
  type CreditSummaryItem,
} from "../../services/creditSummaryApi";
import type {
  MetricData,
  MetricStatus,
} from "../../types/metric";

const displayOrder = [
  "CREDIT.GROSS_NPL",
  "CREDIT.NET_NPL",
  "CREDIT.COL2",
  "CREDIT.CKPN_COVERAGE",
  "CREDIT.PORTFOLIO",
];

function toStatus(value?: string): MetricStatus {
  switch (value?.toUpperCase()) {
    case "HEALTHY":
      return "Healthy";
    case "WARNING":
      return "Warning";
    case "CRITICAL":
      return "Critical";
    default:
      return "Watch";
  }
}

function signed(value?: string): string {
  if (value === undefined || value.trim() === "") return "-";

  const number = Number(value);
  if (!Number.isFinite(number)) return value;

  return (number > 0 ? "+" : "") + number;
}

function mapItem(item: CreditSummaryItem): MetricData {
  const isPortfolio = item.businessKey === "CREDIT.PORTFOLIO";
  const isCoverage = item.businessKey === "CREDIT.CKPN_COVERAGE";

  return {
    title: item.title,
    value: isPortfolio
      ? "Rp" + item.value.toLocaleString("en-US") + " T"
      : item.value.toLocaleString("en-US") + "%",
    trend: isPortfolio
      ? signed(item.trend) + "% YoY"
      : signed(item.trend) + "%",
    target: item.target
      ? (isCoverage ? "> " : "< ") +
        Number(item.target).toFixed(2) +
        "%"
      : isPortfolio
        ? "Business Plan"
        : "-",
    status: isPortfolio ? "Healthy" : toStatus(item.status),
  };
}

export default function PortfolioSummary() {
  const [items, setItems] = useState<CreditSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getCreditSummary(controller.signal)
      .then((data) => {
        setItems(data);
        setHasError(false);
      })
      .catch((error: unknown) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setHasError(true);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  const creditSummary = useMemo(
    () =>
      [...items]
        .sort(
          (a, b) =>
            displayOrder.indexOf(a.businessKey) -
            displayOrder.indexOf(b.businessKey),
        )
        .map(mapItem),
    [items],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Portfolio Overview
        </h2>

        <p className="mt-2 text-slate-400">
          Executive summary of enterprise credit portfolio.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {isLoading &&
          displayOrder.map((key) => (
            <div
              key={key}
              className="h-80 animate-pulse rounded-3xl border border-slate-800 bg-slate-900"
            />
          ))}

        {!isLoading && hasError && (
          <div className="col-span-full rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-200">
            Credit portfolio data is temporarily unavailable. Please verify the production API connection.
          </div>
        )}

        {!isLoading && !hasError && creditSummary.length === 0 && (
          <div className="col-span-full rounded-3xl border border-slate-700 bg-slate-900 p-6 text-sm text-slate-300">
            No Credit portfolio data is available for the current reporting period.
          </div>
        )}

        {!isLoading &&
          !hasError &&
          creditSummary.map((item) => (
            <MetricCard
              key={item.title}
              title={item.title}
              value={item.value}
              trend={item.trend}
              target={item.target}
              previousEom={item.previousEom}
              status={item.status}
            />
          ))}
      </div>
    </div>
  );
}
