import type { DashboardData } from "../types/dashboard";

const API = import.meta.env.VITE_API_URL;

export async function getDashboard(): Promise<DashboardData> {

  const response = await fetch(`${API}/dashboard`);

  if (!response.ok) {

    throw new Error("Cannot connect to PRISM API");

  }

  return response.json();

}