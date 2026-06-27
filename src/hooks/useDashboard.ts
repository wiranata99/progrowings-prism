import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard.service";
import type { DashboardData } from "../types/dashboard";

export function useDashboard() {

  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    getDashboard()

      .then(setData)

      .finally(() => setLoading(false));

  }, []);

  return {

    data,

    loading,

  };

}