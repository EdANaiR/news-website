"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowDown, ArrowUp, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type TickerData = {
  s: string;
  p: number;
  t: number;
  c: number[];
};

export default function GetMarket() {
  const [tickers, setTickers] = useState<{ [key: string]: TickerData }>({});
  const [status, setStatus] = useState<"connecting" | "connected" | "error">(
    "connecting"
  );
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const subscribeToSymbols = useCallback((socket: WebSocket) => {
    const symbols = [
      "BINANCE:BTCUSDT",
      "BINANCE:ETHUSDT",
      "OANDA:EUR_USD",
      "OANDA:GBP_USD",
      "OANDA:USD_TRY",
    ];
    symbols.forEach((symbol) => {
      socket.send(JSON.stringify({ type: "subscribe", symbol }));
      console.log(`Subscribed to ${symbol}`);
    });
  }, []);

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(
      `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    socketRef.current = socket;

    socket.addEventListener("open", function (event) {
      console.log("WebSocket Connected");
      setStatus("connected");
      subscribeToSymbols(socket);
    });

    socket.addEventListener("message", function (event) {
      const data = JSON.parse(event.data);
      console.log("Received data:", JSON.stringify(data, null, 2));

      if (data.type === "trade" && Array.isArray(data.data)) {
        const latestData: { [key: string]: TickerData } = {};
        data.data.forEach((tick: TickerData) => {
          if (tick && tick.s && tick.p !== undefined) {
            latestData[tick.s] = tick;
          }
        });

        setTickers((prev) => {
          const updatedTickers = { ...prev, ...latestData };
          console.log(
            "Updated tickers:",
            JSON.stringify(updatedTickers, null, 2)
          );
          return updatedTickers;
        });
      }
    });

    socket.addEventListener("error", function (event) {
      console.error("WebSocket error:", event);
      setStatus("error");
      setError("Piyasa verilerine bağlanırken hata oluştu");
    });

    socket.addEventListener("close", function (event) {
      console.log("WebSocket closed:", event);
      setStatus("error");
      setError("Bağlantı kapandı. Yeniden bağlanmaya çalışılıyor...");
      setTimeout(connectWebSocket, 5000);
    });
  }, [subscribeToSymbols]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const symbolNames: { [key: string]: string } = {
    "BINANCE:BTCUSDT": "Bitcoin",
    "BINANCE:ETHUSDT": "Ethereum",
    "OANDA:EUR_USD": "Euro",
    "OANDA:GBP_USD": "Sterlin",
    "OANDA:USD_TRY": "Dolar/TL",
  };

  const handleReconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setStatus("connecting");
    connectWebSocket();
  };

  if (status === "connecting") {
    return (
      <div
        className="w-full bg-gray-900 text-white p-4 flex items-center justify-center"
        role="status"
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
        <span>Piyasa verilerine bağlanılıyor...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="w-full bg-gray-900 p-4 text-red-400 flex flex-col items-center"
        role="alert"
      >
        <p className="mb-4">Hata: {error}</p>
        <Button onClick={handleReconnect} variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Yeniden Bağlan
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 text-white overflow-hidden p-4">
      <div className="flex flex-wrap items-center gap-4">
        {Object.entries(tickers).length === 0 ? (
          <div>Veri bekleniyor...</div>
        ) : (
          Object.entries(tickers).map(([symbol, data]) => (
            <div
              key={symbol}
              className="flex items-center gap-2 bg-gray-800 p-2 rounded-md"
            >
              <span className="font-medium">
                {symbolNames[symbol] || symbol}
              </span>
              <span className="tabular-nums">{data.p.toFixed(2)}</span>
              <span
                className={`flex items-center gap-1 text-sm ${
                  data.c && data.c[0] >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {data.c && data.c[0] >= 0 ? (
                  <ArrowUp className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <ArrowDown className="w-3 h-3" aria-hidden="true" />
                )}
                <span
                  aria-label={`Değişim: ${
                    data.c && Math.abs(data.c[0]).toFixed(2)
                  }%`}
                >
                  %{data.c && Math.abs(data.c[0]).toFixed(2)}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
