import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import type { Page } from "@/types";

export default function App() {
  const [page, setPage] = useState<Page>("Live");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pitch text-white">
      <Navbar page={page} onNavigate={setPage} />
      {page === "Live" && <Home />}
      {page === "Matches" && <Matches />}
      {page === "Rankings" && (
        <div className="flex-1 flex items-center justify-center text-[#555] text-[13px]">
          Rankings coming soon
        </div>
      )}
    </div>
  );
}
