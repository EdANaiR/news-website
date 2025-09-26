"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface FinancialData {
  id: string;
  name: string;
  value: number;
  change: number;
}

const API_KEY = process.env.NEXT_PUBLIC_COLLECT_API_KEY;

export default function Component() {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousDataRef = useRef<Map<string, number>>(new Map());

  // Demo veriler için initial yüzde değerleri
  const getRandomChange = () => (Math.random() - 0.5) * 3; // -1.5 ile +1.5 arası

  const fetchFinancialData = async () => {
    if (!API_KEY) {
      setError("API anahtarı bulunamadı");
      setLoading(false);
      return;
    }

    try {
      const newData: FinancialData[] = [];
      const isFirstLoad = previousDataRef.current.size === 0;

      // Döviz verilerini çek
      try {
        const response = await fetch(
          "https://api.collectapi.com/economy/allCurrency",
          {
            headers: {
              "content-type": "application/json",
              authorization: `apikey ${API_KEY}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();

          if (result?.success && result?.result) {
            // USD/TRY
            const usd = result.result.find((item: any) => item.code === "USD");
            if (usd?.selling) {
              const value =
                typeof usd.selling === "string"
                  ? parseFloat(usd.selling.replace(",", "."))
                  : parseFloat(usd.selling);
              const prevValue = previousDataRef.current.get("usd");
              let change = isFirstLoad
                ? getRandomChange()
                : prevValue
                ? ((value - prevValue) / prevValue) * 100
                : 0;

              newData.push({
                id: "usd",
                name: "DOLAR",
                value,
                change,
              });
              previousDataRef.current.set("usd", value);
            }

            // EUR/TRY
            const eur = result.result.find((item: any) => item.code === "EUR");
            if (eur?.selling) {
              const value =
                typeof eur.selling === "string"
                  ? parseFloat(eur.selling.replace(",", "."))
                  : parseFloat(eur.selling);
              const prevValue = previousDataRef.current.get("eur");
              let change = isFirstLoad
                ? getRandomChange()
                : prevValue
                ? ((value - prevValue) / prevValue) * 100
                : 0;

              newData.push({
                id: "eur",
                name: "EURO",
                value,
                change,
              });
              previousDataRef.current.set("eur", value);
            }

            // GBP/TRY
            const gbp = result.result.find((item: any) => item.code === "GBP");
            if (gbp?.selling) {
              const value =
                typeof gbp.selling === "string"
                  ? parseFloat(gbp.selling.replace(",", "."))
                  : parseFloat(gbp.selling);
              const prevValue = previousDataRef.current.get("gbp");
              let change = isFirstLoad
                ? getRandomChange()
                : prevValue
                ? ((value - prevValue) / prevValue) * 100
                : 0;

              newData.push({
                id: "gbp",
                name: "STERLİN",
                value,
                change,
              });
              previousDataRef.current.set("gbp", value);
            }
          }
        }
      } catch (e) {
        console.error("Döviz verisi alınamadı:", e);
      }

      // Altın verilerini çek
      try {
        const response = await fetch(
          "https://api.collectapi.com/economy/goldPrice",
          {
            headers: {
              "content-type": "application/json",
              authorization: `apikey ${API_KEY}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result?.success && result?.result) {
            const gold = result.result.find(
              (item: any) => item.name && item.name.includes("Gram")
            );
            if (gold?.selling) {
              const value =
                typeof gold.selling === "string"
                  ? parseFloat(gold.selling.replace(",", "."))
                  : parseFloat(gold.selling);
              const prevValue = previousDataRef.current.get("gold");
              let change = isFirstLoad
                ? getRandomChange()
                : prevValue
                ? ((value - prevValue) / prevValue) * 100
                : 0;

              newData.push({
                id: "gold",
                name: "ALTIN",
                value,
                change,
              });
              previousDataRef.current.set("gold", value);
            }
          }
        }
      } catch (e) {
        console.error("Altın verisi alınamadı:", e);
      }

      // Bitcoin verilerini çek
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=try"
        );

        if (response.ok) {
          const result = await response.json();
          if (result?.bitcoin?.try) {
            const value = result.bitcoin.try;
            const prevValue = previousDataRef.current.get("btc");
            let change = isFirstLoad
              ? getRandomChange() * 2 // Bitcoin daha volatil
              : prevValue
              ? ((value - prevValue) / prevValue) * 100
              : 0;

            newData.push({
              id: "btc",
              name: "BITCOIN",
              value,
              change,
            });
            previousDataRef.current.set("btc", value);
          }
        }
      } catch (e) {
        console.error("Bitcoin verisi alınamadı:", e);
      }

      // BIST 100 verilerini çek
      try {
        const response = await fetch(
          "https://api.collectapi.com/economy/hisseSenedi",
          {
            headers: {
              "content-type": "application/json",
              authorization: `apikey ${API_KEY}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result?.success && result?.result) {
            const bist = result.result.find(
              (item: any) => item.code === "XU100"
            );
            if (bist?.price) {
              const value = parseFloat(bist.price);
              const prevValue = previousDataRef.current.get("bist");
              let change = isFirstLoad
                ? getRandomChange()
                : bist.rate
                ? parseFloat(bist.rate)
                : prevValue
                ? ((value - prevValue) / prevValue) * 100
                : 0;

              newData.push({
                id: "bist",
                name: "BIST 100",
                value,
                change,
              });
              previousDataRef.current.set("bist", value);
            }
          }
        }
      } catch (e) {
        console.error("BIST verisi alınamadı:", e);
      }

      // En az bir veri varsa başarılı
      if (newData.length > 0) {
        setData(newData);
        setError(null);
      } else {
        setError("Veri alınamadı");
      }

      setLoading(false);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setError("Veriler yüklenirken hata oluştu");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
    const interval = setInterval(fetchFinancialData, 3 * 60 * 1000); // 3 dakika
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#1a1a1a] text-white py-2 text-center">
        <div className="text-sm animate-pulse">
          Finansal veriler yükleniyor...
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="w-full bg-[#1a1a1a] text-white py-2 text-center">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-[#1a1a1a] text-white py-2 text-center">
        <div className="text-sm">Veri bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1a1a1a] text-white overflow-hidden">
      <div className="py-2">
        <div className="ticker-container">
          <div className="ticker-content">
            {/* İlk set - her varlık bir kez */}
            {data.map((item, index) => (
              <span key={item.id} className="inline-flex items-center">
                <span className="font-bold text-yellow-400 text-xs mr-1">
                  {item.name}
                </span>
                <span className="text-white font-semibold text-xs mr-1">
                  {item.id === "btc"
                    ? `₺${item.value.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })}`
                    : item.id === "bist"
                    ? item.value.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })
                    : item.id === "gold"
                    ? `₺${item.value.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : `₺${item.value.toLocaleString("tr-TR", {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                      })}`}
                </span>
                <span
                  className={`text-xs font-semibold inline-flex items-center ${
                    item.change > 0
                      ? "text-green-400"
                      : item.change < 0
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {item.change !== 0 &&
                    (item.change > 0 ? (
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                    ))}
                  {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
                <span className="text-gray-500 mx-3">•</span>
              </span>
            ))}

            {/* Duplicate set - seamless loop için */}
            {data.map((item, index) => (
              <span key={`${item.id}-dup`} className="inline-flex items-center">
                <span className="font-bold text-yellow-400 text-xs mr-1">
                  {item.name}
                </span>
                <span className="text-white font-semibold text-xs mr-1">
                  {item.id === "btc"
                    ? `₺${item.value.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })}`
                    : item.id === "bist"
                    ? item.value.toLocaleString("tr-TR", {
                        maximumFractionDigits: 0,
                      })
                    : item.id === "gold"
                    ? `₺${item.value.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : `₺${item.value.toLocaleString("tr-TR", {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                      })}`}
                </span>
                <span
                  className={`text-xs font-semibold inline-flex items-center ${
                    item.change > 0
                      ? "text-green-400"
                      : item.change < 0
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {item.change !== 0 &&
                    (item.change > 0 ? (
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                    ))}
                  {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
                <span className="text-gray-500 mx-3">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticker-container {
          overflow: hidden;
          white-space: nowrap;
        }

        .ticker-content {
          display: inline-block;
          animation: scroll-left 45s linear infinite;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
