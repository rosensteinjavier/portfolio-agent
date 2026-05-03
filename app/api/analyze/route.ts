import { NextResponse } from "next/server";

const PYTHON_URL = "https://portfolio-python-lt5f.onrender.com/analyze";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const portfolio = body.portfolio || [];

    const portfolioSymbols = portfolio.map((p: any) => p.symbol);

    // 🔗 fetch Python API
    const res = await fetch(PYTHON_URL, { cache: "no-store" });
    const marketData = await res.json();

    const scored: any[] = [];

    // 🔍 analizar TODO el universe
    for (const symbol in marketData) {
      const d = marketData[symbol];
      if (!d || d.error) continue;

      const { rsi, price, ema50, ema200 } = d;

      let score = 0;

      // RSI (más bajo = mejor oportunidad de compra)
      score += (50 - rsi) / 10;

      // tendencia
      if (price > ema50) score += 1;
      if (ema50 > ema200) score += 1;

      if (price < ema50) score -= 1;

      scored.push({
        asset: symbol,
        score,
        rsi,
        inPortfolio: portfolioSymbols.includes(symbol),
      });
    }

    // ordenar por mejor score
    scored.sort((a, b) => b.score - a.score);

    // mejor fuera del portfolio
    const best = scored.find((s) => !s.inPortfolio);

    // 🔻 peor dentro del portfolio
    const worst = [...scored]
      .reverse()
      .find((s) => s.inPortfolio);

    const rotations = [];

    if (best && worst) {
      rotations.push({
        from: worst.asset,
        to: best.asset,
        percent: 10,
        reason: `${best.asset} shows stronger relative momentum than ${worst.asset} (score ${best.score.toFixed(
          2
        )} vs ${worst.score.toFixed(2)})`,
      });
    }

    return NextResponse.json({
      rotations,
      ranked: scored.slice(0, 5), // top 5 para debug/UI
    });

  } catch (err: any) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { error: "Internal error", detail: err.message },
      { status: 500 }
    );
  }
}