import {
  useEffect,
  useState,
} from "react";

import {
  getLiquidityCoreMetrics,
  type LiquidityCoreMetricsData,
} from "../services/liquidityCoreMetricsApi";

export function useLiquidityCoreMetrics(
  period: 5 | 10 | 20 | 30 = 30
) {
  const [data, setData] =
    useState<LiquidityCoreMetricsData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(false);

        const result =
          await getLiquidityCoreMetrics(
            period
          );

        if (active) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Failed to load Liquidity Core Metrics",
          err
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

    load();

    return () => {
      active = false;
    };
  }, [period]);

  return {
    data,
    loading,
    error,
  };
}