"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface FinancialData {
  id: string;
  name: string;
  value: number;
  change: number;
  previousValue: number;
}

interface CurrencyResponse {
  success: boolean;
  result: {
    base: string;
    lastupdate: string;
    data: Array<{
      code: string;
      name: string;
      rate: number;
      calculatedstr: string;
      calculated: number;
    }>;
  };
}

interface BistItem {
  price: number;
  rate: number;
  lastprice: number;
  lastpricestr: string;
  hacim: string;
  hacimstr: string;
  text: string;
  code: string;
}

interface BistResponse {
  success: boolean;
  result: BistItem[];
}

const API_KEY = process.env.NEXT_PUBLIC_COLLECT_API_KEY;

export default function Component() {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const fetchFinancialData = async () => {
    if (!API_KEY) {
      setError("API anahtarı bulunamadı");
      setLoading(false);
      return;
    }

    const maxRetries = 3;
    let retryCount = 0;

    const fetchWithRetry = async (url: string, options?: RequestInit) => {
      while (retryCount < maxRetries) {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            throw error;
          }
          // Exponential backoff: 1s, 2s, 4s
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, retryCount - 1) * 1000)
          );
        }
      }
    };

    try {
      setDebugInfo("Döviz verileri alınıyor...");
      // CollectAPI'den döviz verilerini çekme
      const result = await fetchWithRetry(
        "https://api.collectapi.com/economy/currencyToAll?base=USD",
        {
          headers: {
            "content-type": "application/json",
            authorization: `apikey ${API_KEY}`,
          },
        }
      );

      setDebugInfo(
        (prev) =>
          `${prev}\nDöviz API Yanıtı: ${JSON.stringify(result, null, 2)}`
      );

      // API yanıt yapısını kontrol et
      if (!result || typeof result !== "object") {
        throw new Error("Geçersiz API yanıtı: Yanıt bir obje değil");
      }

      if (!result.success) {
        throw new Error("Döviz API başarısız yanıt döndürdü");
      }

      if (!result.result || typeof result.result !== "object") {
        throw new Error(
          "Geçersiz API yanıtı: result alanı eksik veya geçersiz"
        );
      }

      if (!result.result.data || !Array.isArray(result.result.data)) {
        throw new Error(
          "Geçersiz API yanıtı: data alanı eksik veya bir dizi değil"
        );
      }

      const currentData = [...data];
      const newData: FinancialData[] = [];

      // Döviz verilerini işle
      const currencyData = result.result.data;

      // Dolar (USD/TRY)
      const tryRate = currencyData.find((r: any) => r.code === "TRY")?.rate;
      if (typeof tryRate === "number") {
        newData.push({
          id: "dolar",
          name: "DOLAR",
          value: 1 / tryRate,
          change: calculateChange(currentData, "dolar", 1 / tryRate),
          previousValue:
            currentData.find((item) => item.id === "dolar")?.value ||
            1 / tryRate,
        });
      } else {
        setDebugInfo((prev) => `${prev}\nTRY oranı bulunamadı veya geçersiz`);
      }

      // Euro (EUR/TRY)
      const eurRate = currencyData.find((r: any) => r.code === "EUR")?.rate;
      if (typeof eurRate === "number" && typeof tryRate === "number") {
        newData.push({
          id: "euro",
          name: "EURO",
          value: (1 / eurRate) * tryRate,
          change: calculateChange(currentData, "euro", (1 / eurRate) * tryRate),
          previousValue:
            currentData.find((item) => item.id === "euro")?.value ||
            (1 / eurRate) * tryRate,
        });
      } else {
        setDebugInfo((prev) => `${prev}\nEUR oranı bulunamadı veya geçersiz`);
      }

      // Sterlin (GBP/TRY)
      const gbpRate = currencyData.find((r: any) => r.code === "GBP")?.rate;
      if (typeof gbpRate === "number" && typeof tryRate === "number") {
        newData.push({
          id: "sterlin",
          name: "STERLİN",
          value: (1 / gbpRate) * tryRate,
          change: calculateChange(
            currentData,
            "sterlin",
            (1 / gbpRate) * tryRate
          ),
          previousValue:
            currentData.find((item) => item.id === "sterlin")?.value ||
            (1 / gbpRate) * tryRate,
        });
      } else {
        setDebugInfo((prev) => `${prev}\nGBP oranı bulunamadı veya geçersiz`);
      }

      setDebugInfo((prev) => `${prev}\nBitcoin verileri alınıyor...`);
      // Bitcoin fiyatı için CoinGecko API
      const btcData = await fetchWithRetry(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      setDebugInfo(
        (prev) =>
          `${prev}\nBitcoin API Yanıtı: ${JSON.stringify(btcData, null, 2)}`
      );

      // Bitcoin (BTC/TRY)
      if (btcData.bitcoin?.usd && typeof tryRate === "number") {
        newData.push({
          id: "bitcoin",
          name: "BITCOIN",
          value: btcData.bitcoin.usd * tryRate,
          change: calculateChange(
            currentData,
            "bitcoin",
            btcData.bitcoin.usd * tryRate
          ),
          previousValue:
            currentData.find((item) => item.id === "bitcoin")?.value ||
            btcData.bitcoin.usd * tryRate,
        });
      } else {
        setDebugInfo(
          (prev) => `${prev}\nBitcoin verisi alınamadı veya geçersiz`
        );
      }

      setDebugInfo((prev) => `${prev}\nBIST verileri alınıyor...`);
      // BIST 100 için CollectAPI
      const bistData = await fetchWithRetry(
        "https://api.collectapi.com/economy/hisseSenedi",
        {
          headers: {
            "content-type": "application/json",
            authorization: `apikey ${API_KEY}`,
          },
        }
      );

      setDebugInfo(
        (prev) =>
          `${prev}\nBIST API Yanıtı: ${JSON.stringify(bistData, null, 2)}`
      );

      if (!bistData.success || !Array.isArray(bistData.result)) {
        throw new Error("BIST API geçersiz veri döndürdü");
      }

      // BIST
      const bistItem = bistData.result.find(
        (item: BistItem) => item.code === "XU100"
      );
      if (bistItem?.price) {
        newData.push({
          id: "bist",
          name: "BIST 100",
          value: bistItem.price,
          change: bistItem.rate || 0,
          previousValue:
            currentData.find((item) => item.id === "bist")?.value ||
            bistItem.price,
        });
      } else {
        setDebugInfo((prev) => `${prev}\nBIST verisi bulunamadı veya geçersiz`);
      }

      if (newData.length === 0) {
        throw new Error("Hiçbir veri alınamadı");
      }

      setData(newData);
      setLoading(false);
      setError(null);
      setDebugInfo((prev) => `${prev}\nVeriler başarıyla güncellendi.`);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Veriler yüklenirken bir hata oluştu"
      );
      setLoading(false);
    }
  };

  const calculateChange = (
    currentData: FinancialData[],
    id: string,
    newValue: number
  ): number => {
    const previousValue =
      currentData.find((item) => item.id === id)?.value || newValue;
    if (previousValue === 0) return 0;
    return ((newValue - previousValue) / previousValue) * 100;
  };

  useEffect(() => {
    fetchFinancialData();
    // Her 5 dakikada bir güncelle (günlük 288 istek)
    const interval = setInterval(fetchFinancialData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#1c1c1c] text-white py-2 text-center">
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#1c1c1c] text-white py-2">
        <div className="text-red-500 text-center mb-2">{error}</div>
        {debugInfo && (
          <div className="text-sm text-gray-400 whitespace-pre-wrap p-2">
            {debugInfo}
          </div>
        )}
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            setDebugInfo(null);
            fetchFinancialData();
          }}
          className="block mx-auto px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1c1c1c] text-white overflow-hidden py-2">
      <div className="animate-marquee whitespace-nowrap flex items-center text-sm">
        {data.map((item) => (
          <div key={item.id} className="inline-flex items-center mx-3">
            <span className="font-medium mr-1 text-xs">{item.name}</span>
            <span className="tabular-nums text-xs">
              {item.value.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <div
              className={`ml-1 flex items-center ${
                item.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.change >= 0 ? (
                <ArrowUp className="w-2 h-2" />
              ) : (
                <ArrowDown className="w-2 h-2" />
              )}
              <span className="ml-0.5 text-xs">
                %{Math.abs(item.change).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {data.map((item) => (
          <div
            key={`${item.id}-duplicate`}
            className="inline-flex items-center mx-3"
          >
            <span className="font-medium mr-1 text-xs">{item.name}</span>
            <span className="tabular-nums text-xs">
              {item.value.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <div
              className={`ml-1 flex items-center ${
                item.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.change >= 0 ? (
                <ArrowUp className="w-2 h-2" />
              ) : (
                <ArrowDown className="w-2 h-2" />
              )}
              <span className="ml-0.5 text-xs">
                %{Math.abs(item.change).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
