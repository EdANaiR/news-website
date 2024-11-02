"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, LayoutDashboard, Users, Image, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Newspaper, label: "Haberler", href: "/admin/news" },
  { icon: Users, label: "Kullanıcılar", href: "/admin/users" },
  { icon: Image, label: "Medya", href: "/admin/media" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <Menu />
          </Button>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex items-center px-4 py-2 text-sm ${
                  pathname === item.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between px-4 bg-gray-900 text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu />
          </Button>
          <div className="ml-auto">
            {/* Add user profile or logout button here */}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
