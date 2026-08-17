import type { DashboardData } from "../types/dashboard";

import { API_BASE_URL } from "../config/api";

const API = API_BASE_URL;

export async function getDashboard(): Promise<DashboardData> {

  const response = await fetch(`${API}/dashboard`);

  if (!response.ok) {

    throw new Error("Cannot connect to PRISM API");

  }

  return response.json();

}