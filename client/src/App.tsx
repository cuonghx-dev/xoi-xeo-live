import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import Rankings from "@/pages/Rankings";

export default function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pitch text-white pb-[56px] md:pb-0">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
