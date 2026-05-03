"use client";
import { useState } from "react";

export default function Home() {
  const [aiExplanation, setAiExplanation] = useState("");
  const [portfolio, setPortfolio] = useState<Asset[]>([
    { symbol: "BTC-USD", amount: 0.5 },
    { symbol: "AAPL", amount: 10 },
  ]);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);


    type Asset = {
      symbol: string;
      amount: number;
    };

    const updateItem = (
      i: number,
      field: "symbol" | "amount",
      value: string | number
    ) => {
      const copy = [...portfolio];

      if (field === "amount") {
        copy[i].amount = Number(value);
      } else {
        copy[i].symbol = String(value);
      }

      setPortfolio(copy);
    };

  const addRow = () => {
    setPortfolio([...portfolio, { symbol: "", amount: 0 }]);
  };

  const removeRow = (i: number) => {
    setPortfolio(portfolio.filter((_, idx) => idx !== i));
  };

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ portfolio }),
    });

    const data = await res.json();
    setResult(data);

    //llamar al agente (explicación)
    const agentRes = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rotations: data.rotations,
        portfolio,
      }),
    });
    const agentData = await agentRes.json();
    setAiExplanation(agentData.explanation);

    setLoading(false);
  };

  const totalAssets = portfolio.length;

  return (
    <div
      style={{
        padding: 30,
        background: "#0b0b0b",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        Portfolio Rotation Agent
      </h1>
      <h3>This agent scans the market and identifies the best capital rotation opportunities in real time.</h3>
      <h3>...The analysis take count of the actual portfolio vs a bigger list of important actives so can suggest sells & buys.</h3>
      <h4>...this portfolio list contrast agains an Python API hosted online in render, so if the Analysis take time to resolve is because the render is waking up!, be pacience please...</h4>
      <p>________</p>
      {/* PORTFOLIO */}
      <div style={{ marginBottom: 30 }}>
        <h2>Portfolio</h2>

        {portfolio.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input
              value={p.symbol}
              placeholder="Ticker"
              onChange={(e) => updateItem(i, "symbol", e.target.value)}
              style={{ padding: 8 }}
            />
            <input
              type="number"
              value={p.amount}
              onChange={(e) => updateItem(i, "amount", e.target.value)}
              style={{ padding: 8 }}
            />
            <button onClick={() => removeRow(i)}>✖</button>
          </div>
        ))}

        <button onClick={addRow}>+ Add Asset</button>
      </div>

<p>{totalAssets} assets tracked</p>


      {/* ANALYZE */}
      <button
        onClick={analyze}
        style={{
          padding: "12px 20px",
          background: "#22c55e",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 30,
        }}
      >
        {loading ? "Analyzing..." : "Analyze Portfolio"}
      </button>

      {/* TOP RECOMMENDATION */}
      {result?.rotations?.[0] && (
        <div
          style={{
            background: "#111",
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
            border: "1px solid #333",
          }}
        >
          <h2> Top Opportunity</h2>

          <h3>
            Sell {result.rotations[0].from} → Buy {result.rotations[0].to}
          </h3>

          <p>{result.rotations[0].reason}</p>
        </div>
      )}

      {/* ALL ROTATIONS */}
      <div>
        <h2>Recommendations</h2>

        {result?.rotations?.map((r: any, i: number) => (
          <div
            key={i}
            style={{
              background: "#111",
              padding: 15,
              marginBottom: 10,
              borderRadius: 8,
              border: "1px solid #333",
            }}
          >
            <strong>
               {r.from} → {r.to} ({r.percent}%)
            </strong>
            <p>{r.reason}</p>
          </div>
        ))}
      </div>



      {aiExplanation && (
      <div style={{ marginTop: 20 }}>
        <h2>🧠 AI Insight</h2>
        <p>{aiExplanation}</p>
      </div>
    )}



    </div>
  );
}