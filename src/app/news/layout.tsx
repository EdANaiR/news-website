"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MainContent } from "@/components/site/MainContent";
import HomePage from "@/components/site/GetMarket";
import Link from "next/link";

import { useEffect, useState } from "react";

const NewsLayout = () => {
  return (
    <html lang="en">
      <head>
        <title>My News Site</title>
      </head>
      <body>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <HomePage />
          <MainContent />
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default NewsLayout;
