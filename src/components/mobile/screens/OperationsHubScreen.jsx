import React, { useState } from "react";
import { 
  MapPin, 
  Layers, 
  QrCode, 
  BarChart3, 
  Database, 
  PlusCircle, 
  ArrowLeft, 
  ShoppingBag,
  Store,
  ChevronRight,
  Sparkles
} from "lucide-react";

import DailyGoalCard from "../../DailyGoalCard";
import CommercialRouteMap from "../../CommercialRouteMap";
import PlanogramViewer from "../../PlanogramViewer";
import QRBatchGenerator from "../../QRBatchGenerator";
import SupervisorConsole from "../../SupervisorConsole";
import AdminCatalogManager from "../../AdminCatalogManager";
import AppSelect from "../../ui/AppSelect";

export default function OperationsHubScreen({
  seller,
  stores,
  freezers,
  qrBatch,
  selectedFreezerId,
  onSelectFreezerId,
  onOpenScanner,
  onOpenOnboarding,
  onBackToShop,
  onUpdateStorePlanogram,
  onUpdateSellerGoal
}) {
  // Operational sub-tab: 'route' | 'planogram' | 'qr' | 'supervision' | 'admin'
  const [opTab, setOpTab] = useState("route");

  const opTabs = [
    { id: "route", label: "Ruta y Metas", icon: MapPin },
    { id: "planogram", label: "Planogramas", icon: Layers },
    { id: "qr", label: "Stickers QR", icon: QrCode },
    { id: "supervision", label: "Supervisión", icon: BarChart3 },
    { id: "admin", label: "Catálogo", icon: Database }
  ];

  const currentFreezer = freezers.find(f => f.id === selectedFreezerId) || freezers[0];
  const currentStore = stores.find(s => s.id === currentFreezer?.storeId) || stores[0];

  const sellerLocation = seller?.currentLocation || {
    lat: 21.1485,
    lng: -86.8402
  };

  return (
    <div className="pb-28 bg-[#f8fafc] min-h-screen">
      {/* 1. Header with Back to Shop */}
      <div className="bg-white border-b border-[#eeeeee] px-4 pt-3 pb-3 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToShop}
              className="tap-effect w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer"
              title="Volver a Tienda"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider block">
                Panel Vendedor Frimart
              </span>
              <h1 className="font-['Outfit'] font-bold text-base text-[#0f172a] leading-tight">
                Control de Congeladores & Ruta
              </h1>
            </div>
          </div>

          {/* Quick Action: Scan QR */}
          <button
            onClick={onOpenScanner}
            className="tap-effect flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#059669] text-white text-xs font-bold shadow-xs hover:bg-[#047857] transition cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Escanear QR</span>
          </button>
        </div>

        {/* 2. Operational Sub-tabs with Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {opTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = opTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setOpTab(tab.id)}
                className={`tap-effect shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-[#f1f5f9] text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub-tab Content Area */}
      <div className="p-3 sm:p-4 space-y-4">
        {/* TAB 1: RUTA Y METAS */}
        {opTab === "route" && (
          <div className="space-y-4 animate-fade-in">
            <DailyGoalCard 
              seller={seller} 
              onUpdateSales={onUpdateSellerGoal}
            />

            <CommercialRouteMap 
              stores={stores}
              sellerLocation={sellerLocation}
              onSelectStore={() => {}}
              onOpenPlanogram={(freezerId) => {
                onSelectFreezerId(freezerId);
                setOpTab("planogram");
              }}
              onStartOnboardingForStore={() => onOpenOnboarding()}
              onSimulateMove={() => {}}
            />
          </div>
        )}

        {/* TAB 2: PLANOGRAMAS */}
        {opTab === "planogram" && (
          <div className="space-y-3 animate-fade-in">
            {/* Freezer Selector Bar */}
            <div className="bg-white p-3 rounded-2xl border border-[#eeeeee] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold text-slate-800">
                  {currentFreezer?.storeName || "Congelador La Huerta"} ({currentFreezer?.qrCode})
                </span>
              </div>
              <AppSelect
                value={selectedFreezerId}
                onChange={(e) => onSelectFreezerId(e.target.value)}
                className="text-xs bg-[#f8fafc] border border-slate-200 rounded-lg p-1 text-slate-700 outline-none"
              >
                {freezers.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.qrCode} - {f.storeName}
                  </option>
                ))}
              </AppSelect>
            </div>

            <PlanogramViewer 
              freezer={currentFreezer}
              store={currentStore}
              onBackToRoute={() => setOpTab("route")}
              onSaveAudit={onUpdateStorePlanogram}
            />
          </div>
        )}

        {/* TAB 3: LOTES QR */}
        {opTab === "qr" && (
          <div className="bg-white p-3 rounded-2xl border border-[#eeeeee] animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Stickers QR para Congeladores
                </h3>
                <p className="text-xs text-slate-500">
                  Lote de 2,000 etiquetas únicas para alta en punto de venta
                </p>
              </div>
              <button
                onClick={onOpenOnboarding}
                className="tap-effect flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#059669] border border-[#a7f3d0] text-xs font-bold cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Enrolar Nuevo</span>
              </button>
            </div>

            <QRBatchGenerator qrBatch={qrBatch} freezers={freezers} />
          </div>
        )}

        {/* TAB 4: SUPERVISIÓN */}
        {opTab === "supervision" && (
          <div className="space-y-4 animate-fade-in">
            <SupervisorConsole 
              seller={seller}
              stores={stores}
              freezers={freezers}
              onInspectFreezer={(fId) => {
                onSelectFreezerId(fId);
                setOpTab("planogram");
              }}
            />
          </div>
        )}

        {/* TAB 5: CATÁLOGO ADMIN */}
        {opTab === "admin" && (
          <div className="bg-white p-3 rounded-2xl border border-[#eeeeee] animate-fade-in">
            <AdminCatalogManager />
          </div>
        )}
      </div>
    </div>
  );
}
