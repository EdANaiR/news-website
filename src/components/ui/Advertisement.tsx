"use client";
import { useEffect } from "react";

// TypeScript'e adsbygoogle'ın var olduğunu bildiriyoruz
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function Advertisement() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-7153216355008341" // kendi AdSense yayıncı kimliğin
      data-ad-slot="1234567890" // AdSense panelinden aldığın reklam birimi
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
