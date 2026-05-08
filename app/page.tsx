"use client";
import { useState, useRef, useEffect  } from "react";
import AIInsight from './AIInsight';

export default function Home() {
  const [aiExplanation, setAiExplanation] = useState("");
  const [portfolio, setPortfolio] = useState<Asset[]>([
    { symbol: "BTC-USD", amount: 0.5 },
    { symbol: "AAPL", amount: 20 },
    { symbol: "GOOGL", amount: 10 },
    { symbol: "TSLA", amount: 15 },
    { symbol: "MSFT", amount: 5 },
    { symbol: "AMZN", amount: 30 },
    { symbol: "MELI", amount: 10 },
    { symbol: "META", amount: 10 },
  ]);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

// Add this ref
  const portfolioContainerRef = useRef<HTMLDivElement>(null);

    type Asset = {
      symbol: string;
      amount: number;
    };

  // Add this effect to scroll to bottom when portfolio changes
  useEffect(() => {
    if (portfolioContainerRef.current) {
      portfolioContainerRef.current.scrollTop = portfolioContainerRef.current.scrollHeight;
    }
  }, [portfolio]); // This triggers whenever portfolio changes

  const addRow = () => {
    setPortfolio([...portfolio, { symbol: "", amount: 0 }]);
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
    //setAiExplanation(agentData.explanation);

    setAiExplanation(
        agentData.explanation || "No AI explanation available - API Error or OutOfGas :-("
    );
    setLoading(false);
  };

  const totalAssets = portfolio.length;

  return (
    <div style={{ padding: 30, background: "#0b0b0b", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>

<h3>Real-time Portfolio Rotation Analysis</h3>
<p style={{ fontSize: 14, lineHeight: 1.5, color: "#aaa", marginBottom: 8 }}>
  Compares your holdings vs. top market assets to find the best rotation opportunities.
</p>
<p style={{ fontSize: 14, lineHeight: 1.6, color: "#ccc", marginBottom: 10 }}>
  <strong>Note:</strong> The analysis is powered by a Python API hosted on Render.com's free tier.
  If the first analysis takes a few seconds longer than expected, please be patient —
  the service is "waking up" from inactivity.
</p>
<p>________</p>

{/* PORTFOLIO - COMPACT VERSION */}
<div style={{ marginBottom: 30 }}>
  <h2>Portfolio</h2>

  {/* Header row */}
  <div style={{
    display: "flex",
    gap: 10,
    marginBottom: 10,
    fontSize: 12,
    color: "#888",
    paddingLeft: 8
  }}>
    <div style={{ width: "150px" }}>Symbol</div>
    <div style={{ width: "120px" }}>Amount (shares)</div>
    <div style={{ width: "50px" }}></div>
  </div>

  {/* Portfolio rows - more compact */}
  <div
          ref={portfolioContainerRef}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            scrollBehavior: "smooth" // Adds smooth scrolling
          }}
        >
        {portfolio.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 8,
                alignItems: "center"
              }}
            >
        <input
          value={p.symbol}
          placeholder="Ticker"
          onChange={(e) => updateItem(i, "symbol", e.target.value)}
          style={{
            padding: "6px 8px",
            width: "150px",
            fontSize: "14px"
          }}
        />
        <input
          type="number"
          value={p.amount}
          onChange={(e) => updateItem(i, "amount", e.target.value)}
          style={{
            padding: "6px 8px",
            width: "120px",
            fontSize: "14px"
          }}
        />
        <button
          onClick={() => removeRow(i)}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            background: "#333",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            color: "#fff"
          }}
        >
          ✖
        </button>
      </div>
    ))}
  </div>

  <button
    onClick={addRow}
    style={{
      marginTop: 12,
      padding: "6px 12px",
      fontSize: "14px",
      background: "#333",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      color: "#fff"
    }}
  >
    + Add Asset
  </button>
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
        {loading ? "Analyzing...please wait!" : "Analyze Portfolio"}
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

      {/* AI INSIGHT - FIXED HERE */}
      {aiExplanation && (
        <div style={{ marginTop: 20 }}>
          <h2>🧠 AI Insight</h2>
          <AIInsight explanation={aiExplanation} loading={loading} />
        </div>
      )}
    </div>
  );
}