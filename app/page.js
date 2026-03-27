"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { areas } from "../lib/areas";
import Sidebar from "../components/Sidebar";

const MapComponent = dynamic(
  () => import("../components/MapComponent"),
  { ssr: false }
);

function getRiskDetails(level) {
  if (level === "HIGH") {
    return {
      color: "red",
      action: "Deploy 3 pumps, 2 emergency teams",
    };
  }
  if (level === "MEDIUM") {
    return {
      color: "orange",
      action: "Deploy 1 pump, standby team",
    };
  }
  return {
    color: "green",
    action: "No action needed",
  };
}

export default function Home() {
  const [rainfall, setRainfall] = useState(8);
  const [areasData, setAreasData] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Ghaziabad&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
      } catch (err) {
        console.log("Weather API skipped for demo or errored");
      }
    }
    fetchWeather();
  }, []);

  // Time-Based Escalation (Demo Mode)
  useEffect(() => {
    const interval = setInterval(() => {
      setRainfall(prev => {
        if (prev >= 25) return 25; // Cap at 25mm to avoid off-charts UI
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchRisks = async () => {
    const results = await Promise.all(
      areas.map(async (area) => {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rainfall,
            elevation: area.elevation,
            drainage: area.drainage,
            waterlogging: area.waterlogging
          }),
        });

        const data = await res.json();
        const details = getRiskDetails(data.risk);

        return {
          ...area,
          risk: {
            level: data.risk,
            color: details.color,
            action: details.action,
          },
        };
      })
    );

    const riskWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };

    results.sort(
      (a, b) => riskWeights[b.risk.level] - riskWeights[a.risk.level]
    );

    setAreasData(results);
  };

  useEffect(() => {
    fetchRisks();
  }, [rainfall]);

  const high = areasData.filter(a => a.risk.level === "HIGH").length;
  const medium = areasData.filter(a => a.risk.level === "MEDIUM").length;
  const low = areasData.filter(a => a.risk.level === "LOW").length;

  const isCritical = high > 0;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      
      {/* ALERT BAR */}
      {isCritical && (
        <div className="bg-red-600 text-white p-3 text-center font-extrabold tracking-widest text-lg animate-pulse z-50 shadow-md">
          ⚠️ HIGH FLOOD RISK DETECTED — IMMEDIATE ACTION REQUIRED
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-[280px] flex-shrink-0 h-full overflow-y-auto border-r bg-white z-20">
          <Sidebar areasData={areasData} onSelect={setSelectedArea} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col h-full relative">
          
          {/* HEADER */}
          <div className="bg-white shadow-sm z-10 border-b border-gray-200 p-5 pb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                <span className="text-4xl drop-shadow-sm">🌊</span> 
                FloodGuard AI Dashboard
              </h1>
              
              <div className="flex gap-4 opacity-95 items-center">
                {isCritical ? (
                  <div className="hidden lg:flex flex-col bg-gray-900 border border-red-800 rounded-lg p-2 px-4 shadow-lg mr-2">
                    <p className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1"><span className="animate-pulse">🚨</span> PRIORITY ZONES</p>
                    <div className="flex gap-4 text-xs text-gray-300">
                      {areasData.filter(a => a.risk.level === "HIGH").slice(0, 3).map((area, i) => (
                        <span key={i} className="font-bold border-l-2 border-red-500 pl-2 cursor-pointer hover:text-white" onClick={() => setSelectedArea(area)}>{i + 1}. {area.name}</span>
                      ))}
                    </div>
                  </div>
                ) : medium > 0 ? (
                  <div className="hidden lg:flex items-center bg-amber-500/10 border border-amber-500/50 text-amber-600 px-4 py-2 rounded-lg shadow-sm mr-2 text-xs font-bold tracking-wider uppercase">
                    ⚠️ Moderate risk — monitoring recommended
                  </div>
                ) : null}

                <div className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                  <span className="text-xl">🚨</span> High: {high}
                </div>
                <div className="bg-amber-500 text-white font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Medium: {medium}
                </div>
                <div className="bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                  <span className="text-xl">✅</span> Low: {low}
                </div>
              </div>
            </div>

            <div className="mt-3 bg-slate-50 p-2 px-4 rounded-lg border border-gray-200 shadow-inner flex items-center gap-4 max-h-[60px]">
              <label className="whitespace-nowrap font-bold text-gray-700 font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                LIVE SIMULATION ENGINE
              </label>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer accent-indigo-600 shadow-sm"
              />
              <div className="whitespace-nowrap font-bold text-indigo-700 text-sm">
                {rainfall} mm
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="flex-1 relative z-0">
            <MapComponent areasData={areasData} onSelect={setSelectedArea} />
          
          {selectedArea && (
            <div className="absolute bottom-0 left-0 w-full bg-gray-900 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] text-white p-7 z-[1000] border-t-4 border-indigo-500 rounded-tr-2xl rounded-tl-2xl backdrop-blur-lg bg-opacity-95 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
                    {selectedArea.name}
                    {selectedArea.risk.level === 'HIGH' && <span className="animate-pulse text-2xl">⚠️</span>}
                  </h2>
                  <p className="text-xl text-gray-300">
                    Risk Level: <span className={`font-black uppercase tracking-widest ${selectedArea.risk.color === 'red' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : selectedArea.risk.color === 'orange' ? 'text-amber-400' : 'text-emerald-400'}`}>{selectedArea.risk.level}</span>
                  </p>
                  <p className="text-lg text-gray-400 mt-2">Predicted Rainfall: <span className="text-white font-bold bg-white/10 px-2 py-1 rounded-md">{rainfall} mm</span></p>
                </div>
                
                <div className="bg-[#2a1f1a] p-4 py-5 rounded-xl border border-yellow-500 shadow-lg min-w-[280px]">
                  {selectedArea.risk.level === "HIGH" && (
                    <div className="text-left space-y-1">
                      <p className="text-red-400 font-extrabold text-lg tracking-wide drop-shadow-md">⚠️ Critical window: &lt; 2 hours</p>
                      <p className="text-red-300 font-medium">🚨 Likely outcome: Severe flooding expected</p>
                    </div>
                  )}
                  {selectedArea.risk.level === "MEDIUM" && (
                    <div className="text-left space-y-1">
                      <p className="text-yellow-400 font-extrabold text-lg tracking-wide drop-shadow-md">⏱️ Action window: 3–5 hours</p>
                      <p className="text-yellow-300 font-medium">⚠️ Likely outcome: Moderate waterlogging expected</p>
                    </div>
                  )}
                  {selectedArea.risk.level === "LOW" && (
                    <div className="text-left space-y-1">
                      <p className="text-green-400 font-extrabold text-lg tracking-wide drop-shadow-md">✅ No immediate threat</p>
                      <p className="text-green-300 font-medium">🌿 Likely outcome: Normal conditions</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-gray-700/80 bg-gray-900/50 -mx-7 -mb-7 p-7 rounded-b-2xl">
                <p className="font-bold text-lg text-indigo-400 tracking-widest uppercase flex items-center gap-3">
                  {selectedArea.risk.level === 'HIGH' && <span className="animate-ping text-red-500 text-sm">🔴</span>}
                  Resource Allocation Orders
                </p>
                <p className="text-xl mt-3 font-medium text-gray-100 leading-relaxed border-l-4 border-indigo-500 pl-4">{selectedArea.risk.action}</p>
              </div>
              
              <button 
                onClick={() => setSelectedArea(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:rotate-90"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
