import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

export type LiquidityExecutiveApiData = {
  reportingDate: string | null;
  riskLevel: "Healthy" | "Watch" | "Warning" | "Critical";
  fundingStatus: "Healthy" | "Watch" | "Warning" | "Critical";
  executiveSummary: string;
  managementAttention: string[];
  recommendedActions: string[];
  assessmentNarrative: string;
  keyMetrics: {
    lcr: { value: number; unit: string; status: string } | null;
    nsfr: { value: number; unit: string; status: string } | null;
    alDpk: { value: number; unit: string; status: string } | null;
    casa: { value: number; unit: string; status: string } | null;
  };
  earlyWarning: {
    activeAlerts: number;
    criticalCount: number;
    warningCount: number;
    watchCount: number;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: LiquidityExecutiveApiData;
};

export function useLiquidityExecutive() {
  const [data, setData] = useState<LiquidityExecutiveApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/intelligence/liquidity/executive`,
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result: ApiResponse = await response.json();
        if (!result.success) {
          throw new Error(
            result.message || "Failed to load liquidity executive intelligence.",
          );
        }
        if (active) setData(result.data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load liquidity executive intelligence.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
