import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import Rankings from "@/pages/Rankings";
import type { Page } from "@/types";

export default function App() {
  const [page, setPage] = useState<Page>("Live");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pitch text-white pb-[56px] md:pb-0">
      <Navbar page={page} onNavigate={setPage} />
      {page === "Live" && <Home />}
      {page === "Matches" && <Matches />}
      {page === "Rankings" && <Rankings />}
    </div>
  );
}
