import { useEffect, useState } from "react";

import ExecutivePanel from "../common/ExecutivePanel";

import {
  getTreasuryExecutiveIntelligence,
  type TreasuryExecutiveIntelligenceData,
} from "../../services/treasuryExecutiveIntelligenceApi";

export default function TreasuryExecutivePanel() {
  const [data, setData] =
    useState<TreasuryExecutiveIntelligenceData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(false);

        const result =
          await getTreasuryExecutiveIntelligence();

        if (active) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Failed to load Treasury Executive Intelligence",
          err,
        );

        if (active) {
          setData(null);
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <ExecutivePanel
        
        title="Treasury Portfolio Brief"
        generatedAt="Loading..."
        summary="Generating Treasury executive intelligence..."
        attention={[]}
        recommendations={[]}
        assessment="Treasury portfolio assessment is being generated."
        confidence="Loading"
        status="Loading Treasury Intelligence"
      />
    );
  }

  if (error || !data) {
    return (
      <ExecutivePanel
        
        title="Treasury Portfolio Brief"
        generatedAt="Data unavailable"
        summary="Treasury Executive Intelligence is currently unavailable."
        attention={[
          "Unable to retrieve the latest Treasury intelligence data.",
        ]}
        recommendations={[
          "Verify Treasury data availability and backend connectivity.",
        ]}
        assessment="Executive assessment cannot currently be generated."
        confidence="Unavailable"
        status="Treasury Intelligence Unavailable"
      />
    );
  }

  return (
    <ExecutivePanel
      title="Treasury Portfolio Brief"

      generatedAt={data.generatedAt}

      summary={data.summary}

      attention={data.attention}

      recommendations={data.recommendations}

      assessment={data.assessment}

      confidence={data.confidence}

      status={data.status}
    />
  );
}