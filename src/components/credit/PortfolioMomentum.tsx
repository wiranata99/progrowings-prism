import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PortfolioSegmentCard from "./PortfolioSegmentCard";
import PortfolioMomentumHeader from "./PortfolioMomentumHeader";
import PortfolioMomentumChart from "./PortfolioMomentumChart";

import { getCreditMomentum } from "../../services/creditMomentumApi";
import type { DatabaseRow } from "../../data/database/DatabaseReader";

import {
  mapCreditMomentum,
  type CreditMomentumPoint,
} from "../../presentation/mappers/creditMomentumMapper";

type Period = 1 | 3 | 6 | 12;

function formatAmount(value: number): string {
  return `Rp ${value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 0,
    }
  )} Bio`;
}

function formatRatio(value: number): string {
  return `${value.toFixed(2)}%`;
}

function filterByPeriod(
  rows: CreditMomentumPoint[],
  period: Period
): CreditMomentumPoint[] {
  if (rows.length === 0) {
    return [];
  }

  const latestRow = rows.at(-1);

  if (!latestRow) {
    return [];
  }

  const endDate = new Date(
    latestRow.timestamp
  );

  const startDate = new Date(endDate);

  startDate.setMonth(
    startDate.getMonth() - period
  );

  return rows.filter((row) => {
    return (
      row.timestamp >=
        startDate.getTime() &&
      row.timestamp <= endDate.getTime()
    );
  });
}

export default function PortfolioMomentum() {
  const [period, setPeriod] =
    useState<Period>(12);
  const [history, setHistory] =
    useState<DatabaseRow[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [hasError, setHasError] =
    useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getCreditMomentum(controller.signal)
      .then((data) => {
        setHistory(data);
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

  const momentumData = useMemo(
    () => mapCreditMomentum(history),
    [history]
  );

  const chartData = useMemo(
    () =>
      filterByPeriod(
        momentumData.history,
        period
      ),
    [momentumData.history, period]
  );

  const ratios = chartData
    .map((row) => row.totalRatio)
    .filter((value) =>
      Number.isFinite(value)
    );

  const latest =
    ratios.at(-1) ?? 0;

  const peak =
    ratios.length > 0
      ? Math.max(...ratios)
      : 0;

  const lowest =
    ratios.length > 0
      ? Math.min(...ratios)
      : 0;

  if (isLoading) {
    return (
      <section className="h-[620px] animate-pulse rounded-3xl border border-slate-800 bg-slate-900" />
    );
  }

  if (hasError || momentumData.history.length === 0) {
    return (
      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-200">
        Credit portfolio momentum is temporarily unavailable. Please verify the production API connection and reporting history.
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <PortfolioSegmentCard
          title="Consumer Loan"
          outstanding={formatAmount(
            momentumData.consumer
              .outstanding
          )}
          nplAmount={formatAmount(
            momentumData.consumer
              .nplAmount
          )}
          ratio={formatRatio(
            momentumData.consumer.ratio
          )}
          outstandingDelta={
            momentumData.consumer
              .outstandingDelta
          }
          nplDelta={
            momentumData.consumer
              .nplDelta
          }
          ratioDelta={
            momentumData.consumer
              .ratioDelta
          }
        />

        <PortfolioSegmentCard
          title="Corporate Loan"
          outstanding={formatAmount(
            momentumData.corporate
              .outstanding
          )}
          nplAmount={formatAmount(
            momentumData.corporate
              .nplAmmount
          )}
          ratio={formatRatio(
            momentumData.corporate.ratio
          )}
          outstandingDelta={
            momentumData.corporate
              .outstandingDelta
          }
          nplDelta={
            momentumData.corporate
              .nplDelta
          }
          ratioDelta={
            momentumData.corporate
              .ratioDelta
          }
        />
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <PortfolioMomentumHeader
          latest={latest}
          peak={peak}
          lowest={lowest}
          selectedPeriod={period}
          onPeriodChange={setPeriod}
        />

        <PortfolioMomentumChart
          data={chartData}
          period={period}
        />
      </div>
    </section>
  );
}
