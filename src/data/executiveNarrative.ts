export interface ExecutiveNarrativeData {
  title: string;
  summary: string;
  actions: string[];
}

export const executiveNarrative: ExecutiveNarrativeData = {
  title: "Today's Executive Brief",

  summary:
    "Overall credit quality remains healthy and continues to operate within the Board-approved Risk Appetite. Gross NPL improved from 2.51% to 2.42%, supported by stronger collection performance and adequate loan loss coverage. However, early signs of deterioration are emerging in the Construction portfolio due to increasing Stage 2 migration. No immediate management action is required, although enhanced monitoring is recommended for the Construction sector and Top 20 obligors.",

  actions: [
    "Continue current credit strategy.",
    "Enhance monitoring of the Construction portfolio.",
    "Review the Top 20 obligors during the next Credit Committee meeting.",
  ],
};