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

export default function Component() {
  const [data, setData] = useState<FinancialData[]>([
    {
      id: "dolar",
      name: "DOLAR",
      value: 36.4317,
      change: 0.01,
      previousValue: 36.4273,
    },
    {
      id: "euro",
      name: "EURO",
      value: 38.1508,
      change: 0.0,
      previousValue: 38.1508,
    },
    {
      id: "sterlin",
      name: "STERLİN",
      value: 46.0157,
      change: -0.13,
      previousValue: 46.0758,
    },
    {
      id: "bitcoin",
      name: "BITCOIN",
      value: 3434156.3,
      change: 52.4,
      previousValue: 3405308.15,
    },
    {
      id: "bist",
      name: "BIST 100",
      value: 9574.83,
      change: -0.28,
      previousValue: 9602.16,
    },
    {
      id: "gold",
      name: "GRAM ALTIN",
      value: 3458.27,
      change: 0.06,
      previousValue: 3456.2,
    },
    {
      id: "silver",
      name: "GÜMÜŞ",
      value: 37.95,
      change: 0.54,
      previousValue: 37.75,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((currentData) =>
        currentData.map((item) => {
          const changeAmount = (Math.random() - 0.5) * 0.02;
          const newValue = item.value + changeAmount;

          return {
            ...item,
            previousValue: item.value,
            value: newValue,
            change:
              ((newValue - item.previousValue) / item.previousValue) * 100,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#1c1c1c] text-white overflow-hidden py-2">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {data.map((item) => (
          <div key={item.id} className="inline-flex items-center mx-4">
            <span className="font-medium mr-2">{item.name}</span>
            <span className="tabular-nums">
              {item.value.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <div
              className={`ml-2 flex items-center ${
                item.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.change >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span className="ml-1 text-sm">
                %{Math.abs(item.change).toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {data.map((item) => (
          <div
            key={`${item.id}-duplicate`}
            className="inline-flex items-center mx-4"
          >
            <span className="font-medium mr-2">{item.name}</span>
            <span className="tabular-nums">
              {item.value.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <div
              className={`ml-2 flex items-center ${
                item.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.change >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span className="ml-1 text-sm">
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
