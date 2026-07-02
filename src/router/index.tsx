import { Navigate, Route, Routes } from "react-router-dom";

import { Dashboard } from "../pages/Dashboard";
import CreditRisk from "../pages/CreditRisk";
import Treasury from "../pages/Treasury";
import MarketRisk from "../pages/MarketRisk";
import StressTesting from "../pages/StressTesting";
import Liquidity from "../pages/Liquidity";

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
        path="/stress-testing"
        element={<StressTesting />}
      />

    </Routes>
  );
}