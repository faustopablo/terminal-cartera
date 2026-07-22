import { NextRequest, NextResponse } from "next/server";

type Quote = { price: number; previousClose: number; name?: string; error?: boolean };

export async function GET(request: NextRequest) {
  const symbols = (request.nextUrl.searchParams.get("symbols") || "")
    .split(",").map((symbol) => symbol.trim().toUpperCase()).filter(Boolean).slice(0, 40);

  const entries = await Promise.all(symbols.map(async (symbol): Promise<[string, Quote]> => {
    try {
      const endpoint = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
      const response = await fetch(endpoint, { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 300 } });
      if (!response.ok) throw new Error("Quote unavailable");
      const payload = await response.json();
      const result = payload?.chart?.result?.[0];
      const meta = result?.meta;
      const closes = (result?.indicators?.quote?.[0]?.close || []).filter((value: unknown) => typeof value === "number");
      const price = Number(meta?.regularMarketPrice ?? closes.at(-1));
      const previousClose = Number(meta?.chartPreviousClose ?? meta?.previousClose ?? closes.at(-2) ?? price);
      if (!Number.isFinite(price)) throw new Error("Invalid quote");
      return [symbol, { price, previousClose, name: meta?.longName ?? meta?.shortName ?? symbol }];
    } catch {
      return [symbol, { price: 0, previousClose: 0, error: true }];
    }
  }));

  return NextResponse.json({ quotes: Object.fromEntries(entries), delayed: true, updatedAt: new Date().toISOString() });
}
