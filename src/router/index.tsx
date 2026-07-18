import { Navigate, Route, Routes } from "react-router-dom";

import { Dashboard } from "../pages/Dashboard";
import CreditRisk from "../pages/CreditRisk";
import Liquidity from "../pages/Liquidity";
import MarketRisk from "../pages/MarketRisk";
import Operational from "../pages/Operational";
import Profitability from "../pages/Profitability";
import Treasury from "../pages/Treasury";
import UploadData from "../pages/UploadData";

// import StressTesting from "../pages/StressTesting";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/credit"
        element={<CreditRisk />}
      />

      <Route
        path="/liquidity"
        element={<Liquidity />}
      />

      <Route
        path="/treasury"
        element={<Treasury />}
      />

      <Route
        path="/market-risk"
        element={<MarketRisk />}
      />

      <Route
        path="/profitability"
        element={<Profitability />}
      />

      <Route
        path="/operational"
        element={<Operational />}
      />

      <Route
        path="/upload-data"
        element={<UploadData />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}