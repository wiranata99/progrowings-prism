export interface DashboardData {

  enterpriseScore: number;

  status: string;

  kpis: {

    car: number;

    npl: number;

    lcr: number;

    roa: number;

  };

  market: {

    usdidr: number;

    biRate: number;

    srbi12m: number;

    ust10y: number;

  };

  alerts: string[];

}