import { NextResponse } from "next/server";

const PYTHON_URL = "https://portfolio-python-lt5f.onrender.com/analyze";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const portfolio = body.portfolio || [];

    // símbolos actuales del usuario
    const portfolioSymbols = portfolio.map((p: any) => p.symbol);

     // obtener universo de activos desde Python API
    const res = await fetch(PYTHON_URL, { cache: "no-store" });
    const marketData = await res.json();

    const scored: any[] = [];

    // analizar TODO el universe
    for (const symbol in marketData) {
      const d = marketData[symbol];
      if (!d || d.error) continue;

      const { rsi, price, ema50, ema200 } = d;

      let score = 0;

      // RSI
      // menor RSI = más potencial de rebote
      score += (50 - rsi) / 10;

      // tendencia
      if (price > ema50) score += 1;
      if (ema50 > ema200) score += 1;

      // debilidad
      if (price < ema50) score -= 1;

      // score extra por momentum saludable
      if (rsi > 45 && rsi < 65) score += 0.5;

      scored.push({
        asset: symbol,
        score: Number(score.toFixed(2)),
        rsi,
        price,
        ema50,
        ema200,
        inPortfolio: portfolioSymbols.includes(symbol),
      });
    }

//     // ordenar por mejor score
//     scored.sort((a, b) => b.score - a.score);
//
//     // mejor fuera del portfolio
//     const best = scored.find((s) => !s.inPortfolio);
//
//     // 🔻 peor dentro del portfolio
//     const worst = [...scored]
//       .reverse()
//       .find((s) => s.inPortfolio);
//
//     const rotations = [];
//
//     if (best && worst) {
//       rotations.push({
//         from: worst.asset,
//         to: best.asset,
//         percent: 10,
//         reason: `${best.asset} shows stronger relative momentum than ${worst.asset} (score ${best.score.toFixed(
//           2
//         )} vs ${worst.score.toFixed(2)})`,
//       });
//     }

    // ranking global
    scored.sort((a, b) => b.score - a.score);

    // assets actuales del portfolio
    const currentAssets = scored
      .filter((s) => s.inPortfolio)
      .sort((a, b) => a.score - b.score); // peores primero

    // oportunidades externas
    const opportunities = scored
      .filter((s) => !s.inPortfolio)
      .sort((a, b) => b.score - a.score); // mejores primero

    const rotations = [];

    // generar múltiples rotaciones
    // cantidad máxima de sugerencias
    const maxRotations = Math.min(
      currentAssets.length,
      opportunities.length,
      5 // límite para UI limpia
    );

//     for (let i = 0; i < maxRotations; i++) {
//       const from = currentAssets[i];
//       const to = opportunities[i];
//
//       // sólo recomendar si realmente mejora
//       if (to.score > from.score) {
//         rotations.push({
//           from: from.asset,
//           to: to.asset,
//           percent: 10,
//           improvement: Number((to.score - from.score).toFixed(2)),
//           reason: `${to.asset} has stronger momentum and trend alignment than ${from.asset}`,
//         });
//
//       }
//     }


for (let i = 0; i < maxRotations; i++) {
      const from = currentAssets[i];
      const to = opportunities[i];
      // sólo recomendar si mejora realmente
      if (to.score > from.score) {
        // diferencia relativa
        const improvement = Number(
          (to.score - from.score).toFixed(2)
        );
        // % dinámico
        const percent = Math.min(
          25,
          Math.max(5, Math.round(improvement * 5))
        );
        // clasificación de estrategia
        let strategy = "rebalance";
        if (
          from.asset.includes("BTC") ||
          from.asset.includes("ETH")
        ) {
          strategy = "reduce-crypto-exposure";
        }
        if (to.score >= 3) {
          strategy = "high-momentum";
        }
        rotations.push({
          from: from.asset,
          to: to.asset,
          percent,
          improvement,
          strategy,
          reason: `${to.asset} shows stronger momentum and trend alignment than ${from.asset}. Relative score improvement: ${improvement}.`,
          fromMetrics: {
            rsi: Number(from.rsi.toFixed(2)),
            score: from.score,
          },
          toMetrics: {
            rsi: Number(to.rsi.toFixed(2)),
            score: to.score,
          },
        });
      }
    }

    return NextResponse.json({
      rotations,
      summary: {
        portfolioAssets: currentAssets.length,
        externalOpportunities: opportunities.length,
        analyzedAssets: scored.length,
      },
      topOpportunities: opportunities.slice(0, 5),
      weakestPortfolioAssets: currentAssets.slice(0, 5),
      ranked: scored,
    });
  } catch (err: any) {
    console.error("ANALYZE ERROR:", err);
    return NextResponse.json(
      {
        error: "Internal analyze error",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}