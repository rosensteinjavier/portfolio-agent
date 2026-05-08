'use client';

import { useState } from 'react';

export default function HowItWorks() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid #333" }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "left",
          padding: "10px 0",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>🔍 How the Analysis Works
        <span style={{ fontSize: 8 }}>   (Click to expand/contract)        </span>
        </span>
        <span style={{ fontSize: 20 }}>{isExpanded ? "▲" : "▼"}</span>
      </button>

      {isExpanded && (
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "#aaa" }}>


<div style={{
  marginTop: 40,
  paddingTop: 30,
  borderTop: "1px solid #333",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#aaa"
}}>
  {/*<h2 style={{ fontSize: 20, marginBottom: 20, color: "#fff" }}>🔍 How the Analysis Works</h2>*/}

  {/* Methodology Section */}
  <div style={{ marginBottom: 25 }}>
    <h3 style={{ fontSize: 16, marginBottom: 12, color: "#22c55e" }}>📊 Technical Analysis Methodology</h3>

    <p style={{ marginBottom: 10 }}>
      The agent evaluates each asset using multiple technical indicators to identify rotation opportunities:
    </p>

    <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
      <li style={{ marginBottom: 8 }}>
        <strong>RSI (Relative Strength Index):</strong> Measures momentum on a scale of 0-100.
        Values above 70 suggest overbought conditions (potential sell), while below 30 suggests
        oversold conditions (potential buy).
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>EMA (Exponential Moving Average):</strong> Tracks trend direction. Assets trading
        above their 20-day EMA indicate bullish momentum, while below suggests bearish pressure.
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>Composite Score:</strong> A weighted combination of RSI, EMA crossovers, volume trends,
        and relative strength vs. benchmark, normalized to a -3 to +3 scale.
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>Pair Comparison:</strong> Each potential rotation (sell X → buy Y) calculates the
        score difference, expected improvement, and risk-adjusted return.
      </li>
    </ul>
  </div>

  {/* Asset Comparison Process */}
  <div style={{ marginBottom: 25 }}>
    <h3 style={{ fontSize: 16, marginBottom: 12, color: "#22c55e" }}>🔄 Asset Pair Comparison Process</h3>

    <p style={{ marginBottom: 10 }}>
      The agent systematically compares your portfolio assets against a broader universe of ~50 liquid assets:
    </p>

    <ol style={{ paddingLeft: 20, marginBottom: 10 }}>
      <li style={{ marginBottom: 6 }}>
        <strong>Scan:</strong> Fetches real-time price data, volume, and technical indicators for all assets.
      </li>
      <li style={{ marginBottom: 6 }}>
        <strong>Score:</strong> Each asset receives a composite technical score (-3 to +3).
      </li>
      <li style={{ marginBottom: 6 }}>
        <strong>Compare:</strong> Your holdings (with lower scores) are matched against better-scoring assets.
      </li>
      <li style={{ marginBottom: 6 }}>
        <strong>Filter:</strong> Eliminates low-confidence rotations (score improvement &lt; 0.5).
      </li>
      <li style={{ marginBottom: 6 }}>
        <strong>Rank:</strong> Orders opportunities by expected improvement percentage.
      </li>
    </ol>

    <p style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>
      * The "Expected Improvement" represents the potential percentage gain from reallocating based on
      historical correlation between score differences and forward returns.
    </p>
  </div>

{/* API Information */}
<div style={{ marginBottom: 25 }}>
  <h3 style={{ fontSize: 16, marginBottom: 12, color: "#22c55e" }}>⚙️ Analysis Engine API</h3>

  <p style={{ marginBottom: 8 }}>
    The technical analysis is powered by a Python backend hosted on Render.com:
  </p>

  <div style={{
    background: "#0a0a0a",
    padding: "10px 15px",
    borderRadius: 6,
    marginBottom: 12,
    fontFamily: "monospace",
    fontSize: 13
  }}>
    <span style={{ color: "#888" }}>API Endpoint results:</span>{" "}
    <a
      href="https://portfolio-python-lt5f.onrender.com/analyze"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#22c55e", textDecoration: "none" }}
    >
      https://portfolio-python-lt5f.onrender.com
    </a>
    <span style={{ color: "#888" }}> → [...] </span>
    {/* <a
      href="https://portfolio-python-lt5f.onrender.com/health"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: "#1a1a1a",
        padding: "2px 6px",
        borderRadius: 4,
        color: "#22c55e",
        textDecoration: "none"
      }}
    >
      /health
    </a> */}
  </div>

  <p style={{ fontSize: 13, color: "#888", marginBottom: 5 }}>
    <strong>📦 Free Tier Notice:</strong> The API runs on Render.com's free hosting plan.
    After 15 minutes of inactivity, the service "sleeps" to conserve resources.
  </p>

  <p style={{ fontSize: 13, color: "#888", marginBottom: 5 }}>
    <strong>⏱️ Cold Start Delay:</strong> The first analysis after inactivity takes 10-15 seconds
    to "wake up" the backend. Subsequent analyses are faster (2-4 seconds).
  </p>

  <p style={{ fontSize: 13, color: "#888" }}>
    <strong>🔄 Keep-alive strategy:</strong> We use{" "}
    <a
      href="https://uptimerobot.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#22c55e", textDecoration: "none" }}
    >
      UptimeRobot
    </a>'s free monitoring service to ping our{" "}
    {/* <a
      href="https://portfolio-python-lt5f.onrender.com/health"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: "#222",
        padding: "2px 6px",
        borderRadius: 4,
        color: "#22c55e",
        textDecoration: "none",
        fontFamily: "monospace",
        fontWeight: "bold"
      }}
    >
      /health
    </a>{" "} */}
    endpoint every 5 minutes.
    <a
      href="https://portfolio-python-lt5f.onrender.com/health"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        marginLeft: 6,
        fontSize: 11,
        color: "#22c55e",
        textDecoration: "none",
        opacity: 0.7
      }}
    >
      [check live status ↗]
    </a>
    <br />
    <span style={{ fontSize: 12, color: "#666", display: "block", marginTop: 4 }}>
      This minimizes cold starts and keeps response times low during active usage hours.
    </span>
  </p>
</div>







  {/* Performance Disclaimer */}
  <div style={{
    background: "#0a0a0a",
    padding: 15,
    borderRadius: 8,
    borderLeft: "3px solid #ff9800",
    fontSize: 12,
    color: "#777"
  }}>
    <strong>⚠️ Disclaimer:</strong> This tool provides technical analysis for informational purposes only.
    Past performance and technical indicators do not guarantee future results. Always conduct your own
    research before making investment decisions.
  </div>
</div>





        </div>
      )}
    </div>
  );
}