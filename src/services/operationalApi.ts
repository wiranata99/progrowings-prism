import { API_BASE_URL } from "../config/api";
import type { MetricStatus } from "../types/metric";
interface ApiResponse<T>{success:boolean;message:string;data:T}
export interface OperationalMetric{key:string;label:string;value:number;movement:number|null;previousEomValue:number|null;target:number|null;unit:string;status:MetricStatus}
export interface OperationalRisk{id:number;title:string;owner:string;likelihood:number;impact:number;score:number;level:"Low"|"Medium"|"High"|"Extreme";exposure:number}
export interface OperationalControl{name:string;score:number;status:MetricStatus}
export interface OperationalIssue{id:number;risk:string;owner:string;exposure:number;dueDays:number;status:string;priority:string}
export interface OperationalKri{code:string;indicator:string;current:number;threshold:number|null;unit:string;trend:number|null;status:MetricStatus}
export interface OperationalExecutive{reportingDate:string;status:string;summary:string;attention:string[];recommendations:string[];supportingContext:{activeKriBreaches:number;extremeRisks:number;averageControlScore:number;openPriorityIssues:number}}
async function get<T>(path:string):Promise<T>{const response=await fetch(`${API_BASE_URL}/intelligence/operational/${path}`);if(!response.ok)throw new Error(`Failed to fetch Operational ${path}: ${response.status}`);const payload=await response.json() as ApiResponse<T>;if(!payload.success)throw new Error(payload.message||`Failed to fetch Operational ${path}.`);return payload.data;}
export async function getOperationalDashboard(){const [health,lossTrend,heatmap,controls,issues,kri,executive]=await Promise.all([
get<{reportingDate:string;metrics:OperationalMetric[]}>("health-score"),get<{reportingDate:string;points:Array<{reportingDate:string;grossLoss:number;recovery:number;netLoss:number}>}>("loss-trend"),get<{reportingDate:string;risks:OperationalRisk[]}>("risk-heatmap"),get<{reportingDate:string;controls:OperationalControl[]}>("control-effectiveness"),get<{reportingDate:string;issues:OperationalIssue[]}>("top-issues"),get<{reportingDate:string;indicators:OperationalKri[]}>("kri-monitoring"),get<OperationalExecutive>("executive-intelligence")]);return{health,lossTrend,heatmap,controls,issues,kri,executive};}
