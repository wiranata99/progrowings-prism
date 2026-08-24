import type{DashboardData}from"../types/dashboard";import{API_BASE_URL}from"../config/api";
interface ApiResponse<T>{success:boolean;message:string;data:T}
export async function getDashboard():Promise<DashboardData>{const response=await fetch(`${API_BASE_URL}/dashboard`);if(!response.ok)throw new Error(`Cannot connect to PRISM Dashboard API: ${response.status}`);const payload=await response.json() as ApiResponse<DashboardData>;if(!payload.success)throw new Error(payload.message||"Dashboard unavailable");return payload.data}
