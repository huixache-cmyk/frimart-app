import React, { useState, useEffect, useMemo } from "react";
import MobileDeviceFrame from "./components/mobile/MobileDeviceFrame";
import SellerMobileHeader from "./components/mobile/seller/SellerMobileHeader";
import SellerBottomNavigation from "./components/mobile/seller/SellerBottomNavigation";

// Authentication & Roles
import AuthLockScreen from "./components/auth/AuthLockScreen";
import SellerPendingSalesScreen from "./components/roles/SellerPendingSalesScreen";
import SupervisorHubScreen from "./components/roles/SupervisorHubScreen";
import CedisManagerScreen from "./components/roles/CedisManagerScreen";
import CommercialDirectorScreen from "./components/roles/CommercialDirectorScreen";
import OwnerMasterHubScreen from "./components/roles/OwnerMasterHubScreen";
import OwnerAccessAdminModal from "./components/roles/OwnerAccessAdminModal";
import OwnerOtaUpdateModal from "./components/roles/OwnerOtaUpdateModal";
import OtaDeviceUpdateBanner from "./components/roles/OtaDeviceUpdateBanner";

// Seller Screens
import SellerRouteScreen from "./components/mobile/seller/SellerRouteScreen";
import SellerFreezersScreen from "./components/mobile/seller/SellerFreezersScreen";
import SellerScannerScreen from "./components/mobile/seller/SellerScannerScreen";
import SellerCatalogScreen from "./components/mobile/seller/SellerCatalogScreen";
import SellerProfileScreen from "./components/mobile/seller/SellerProfileScreen";

// Seller Sheets & Modals
import SellerStoreDetailSheet from "./components/mobile/seller/SellerStoreDetailSheet";
import SellerRouteMapModal from "./components/mobile/seller/SellerRouteMapModal";
import QuickSaleSheet from "./components/mobile/seller/QuickSaleSheet";
import QRScannerModal from "./components/QRScannerModal";
import FreezerOnboardingModal from "./components/FreezerOnboardingModal";
import ProductDetailModal from "./components/mobile/ProductDetailModal";
import QRBatchGenerator from "./components/QRBatchGenerator";
import SupervisorConsole from "./components/SupervisorConsole";
import AdminCatalogManager from "./components/AdminCatalogManager";
import PwaInstallBanner from "./components/mobile/PwaInstallBanner";
import NewStoreOnboardingModal from "./components/supervisor/NewStoreOnboardingModal";

// Data & Governance
import { 
  ROLES,
  MASTER_CEDIS,
  INITIAL_USERS,
  getStoredUsers,
  saveStoredUsers,
  getStoredActiveUser,
  saveStoredActiveUser,
  getStoredOTAConfig,
  saveStoredOTAConfig,
  getStoredPendientes,
  saveStoredPendientes,
  INITIAL_SELLER_SALES_LOG
} from "./data/authRolesData";

import { 
  INITIAL_SELLER, 
  INITIAL_STORES, 
  INITIAL_FREEZERS, 
  generateQRBatch 
} from "./data/mockData";

import { 
  INITIAL_PRODUCTS, 
  CATEGORIES 
} from "./data/mobileFrimartData";

import { 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Snowflake, 
  QrCode, 
  Bell, 
  X,
  Layers,
  BarChart3,
  Database,
  ShieldCheck,
  Compass,
  Store
} from "lucide-react";

export default function App() {
  // Session & Authentication State
  const [users, setUsers] = useState(() => getStoredUsers());
  const [currentUser, setCurrentUser] = useState(() => getStoredActiveUser());
  const [isLocked, setIsLocked] = useState(() => !getStoredActiveUser());

  // Tab Navigation
  const [activeTab, setActiveTab] = useState(() => {
    const role = getStoredActiveUser()?.role || "vendedor";
    if (role === "supervisor") return "supervision";
    if (role === "gerente_cedis") return "cedis";
    if (role === "director_comercial") return "direccion";
    if (role === "propietario") return "propietario_hub";
    return "ruta";
  });

  // OTA Updates & Governance
  const [otaConfig, setOtaConfig] = useState(() => getStoredOTAConfig());
  const [pendientes, setPendientes] = useState(() => getStoredPendientes());
  const [salesLog, setSalesLog] = useState(INITIAL_SELLER_SALES_LOG);

  // Propietario Exclusive Modals
  const [isOwnerAdminOpen, setIsOwnerAdminOpen] = useState(false);
  const [isOwnerOtaOpen, setIsOwnerOtaOpen] = useState(false);

  // Vendedor State (Persisted in LocalStorage with Aguascalientes DB auto-migration)
  const [seller, setSeller] = useState(() => {
    const saved = localStorage.getItem("frimart_seller");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.cedis?.includes("Cancún")) {
          localStorage.setItem("frimart_seller", JSON.stringify(INITIAL_SELLER));
          return INITIAL_SELLER;
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_SELLER;
  });

  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem("frimart_stores");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some(s => s.address?.includes("Cancún") || s.name?.includes("Nichupté") || !s.routeId)) {
          localStorage.setItem("frimart_stores", JSON.stringify(INITIAL_STORES));
          return INITIAL_STORES;
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_STORES;
  });

  const [freezers, setFreezers] = useState(() => {
    const saved = localStorage.getItem("frimart_freezers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some(f => f.storeName?.includes("Nichupté"))) {
          localStorage.setItem("frimart_freezers", JSON.stringify(INITIAL_FREEZERS));
          return INITIAL_FREEZERS;
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_FREEZERS;
  });

  const [qrBatch] = useState(() => generateQRBatch(2000));
  const [selectedFreezerId, setSelectedFreezerId] = useState("FRM-0089");

  // Active Store for Detail Sheet
  const [selectedStore, setSelectedStore] = useState(null);
  const [isStoreDetailOpen, setIsStoreDetailOpen] = useState(false);

  // Quick Sale Sheet
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [quickSaleStore, setQuickSaleStore] = useState(null);

  // Supervisor & Route Filters
  const [selectedRouteFilter, setSelectedRouteFilter] = useState("all");
  const [isNewStoreModalOpen, setIsNewStoreModalOpen] = useState(false);

  // Dynamic list of assigned vendors for the active user & CEDIS
  const assignedVendors = useMemo(() => {
    const allVendors = users.filter((u) => u.role === "vendedor");
    if (!currentUser) return allVendors;
    if (currentUser.role === "vendedor") {
      // In route and map monitoring, include all assigned fleet vendors of the CEDIS
      const sameCedis = allVendors.filter((u) => u.cedisId === currentUser.cedisId);
      return sameCedis.length > 0 ? sameCedis : allVendors;
    }
    if (currentUser.assignedVendors && Array.isArray(currentUser.assignedVendors) && currentUser.assignedVendors.length > 0) {
      const filtered = allVendors.filter((u) => currentUser.assignedVendors.includes(u.id));
      if (filtered.length > 0) return filtered;
    }
    if (currentUser.cedisId) {
      const cedisVendors = allVendors.filter((u) => u.cedisId === currentUser.cedisId);
      if (cedisVendors.length > 0) return cedisVendors;
    }
    return allVendors;
  }, [users, currentUser]);

  const handleAddNewStore = (newStoreData, newFreezerData) => {
    if (newStoreData) {
      setStores((prev) => {
        const updated = [newStoreData, ...prev];
        try {
          localStorage.setItem("frimart_stores", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    if (newFreezerData) {
      setFreezers((prev) => {
        const updated = [newFreezerData, ...prev];
        try {
          localStorage.setItem("frimart_freezers", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    showToast(`¡Punto de Venta "${newStoreData?.name}" registrado con éxito!`, "success", Store);
  };

  // Route Map Interactive In-App Modal & Persistent Target Store
  const [activeTargetStoreId, setActiveTargetStoreId] = useState(() => {
    return localStorage.getItem("frimart_active_target_store_id") || "STORE-01";
  });
  const [isRouteMapOpen, setIsRouteMapOpen] = useState(false);
  const [routeMapTargetStoreId, setRouteMapTargetStoreId] = useState(null);

  const handleSetActiveTargetStore = (storeId, shouldNotify = true) => {
    if (!storeId) return;
    setActiveTargetStoreId(storeId);
    setRouteMapTargetStoreId(storeId);
    try {
      localStorage.setItem("frimart_active_target_store_id", storeId);
    } catch {}

    if (shouldNotify) {
      const storeObj = stores.find((s) => s.id === storeId);
      if (storeObj) {
        showToast(`Siguiente parada: ${storeObj.name.split("-")[0]?.trim()}`, "success", Compass);
      }
    }
  };

  const handleOpenRouteMap = (storeId = null) => {
    const targetId = storeId || activeTargetStoreId;
    if (storeId) {
      handleSetActiveTargetStore(storeId, false);
    }
    setRouteMapTargetStoreId(targetId);
    setIsRouteMapOpen(true);
  };

  // Full Screen Operational Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [pendingScannedCode, setPendingScannedCode] = useState("FRM-0520");
  const [activeOperationalModal, setActiveOperationalModal] = useState(null); // 'batch' | 'supervision' | 'admin' | 'notifications'

  // Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Native Floating Toast Notification
  const [toast, setToast] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  useEffect(() => {
    saveStoredActiveUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredOTAConfig(otaConfig);
  }, [otaConfig]);

  useEffect(() => {
    saveStoredPendientes(pendientes);
  }, [pendientes]);

  useEffect(() => {
    localStorage.setItem("frimart_seller", JSON.stringify(seller));
  }, [seller]);

  useEffect(() => {
    localStorage.setItem("frimart_stores", JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem("frimart_freezers", JSON.stringify(freezers));
  }, [freezers]);

  // Helper to trigger mobile haptic toast
  const showToast = (message, type = "success", icon = null) => {
    setToast({ message, type, icon });
    if (window.navigator?.vibrate) {
      try {
        window.navigator.vibrate(40);
      } catch {}
    }
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Authentication Handlers
  const handleLoginSuccess = (authenticatedUser) => {
    setCurrentUser(authenticatedUser);
    saveStoredActiveUser(authenticatedUser);
    setIsLocked(false);
    
    // Auto switch to home tab for that role
    if (authenticatedUser.role === "vendedor") setActiveTab("ruta");
    else if (authenticatedUser.role === "supervisor") setActiveTab("supervision");
    else if (authenticatedUser.role === "gerente_cedis") setActiveTab("cedis");
    else if (authenticatedUser.role === "director_comercial") setActiveTab("direccion");
    else if (authenticatedUser.role === "propietario") setActiveTab("propietario_hub");

    showToast(`Bienvenido ${authenticatedUser.name} (${ROLES[authenticatedUser.role]?.shortName})`, "success");
  };

  const handleLockSession = () => {
    setIsLocked(true);
    setCurrentUser(null);
    localStorage.removeItem("frimart_active_session");
    showToast("Sesión cerrada. Ingrese su clave PIN.", "info");
  };

  const handleSwitchSimulatedRole = (targetRoleKey) => {
    const targetUser = users.find((u) => u.role === targetRoleKey);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (targetRoleKey === "vendedor") setActiveTab("ruta");
      else if (targetRoleKey === "supervisor") setActiveTab("supervision");
      else if (targetRoleKey === "gerente_cedis") setActiveTab("cedis");
      else if (targetRoleKey === "director_comercial") setActiveTab("direccion");
      else if (targetRoleKey === "propietario") setActiveTab("propietario_hub");

      showToast(`Vista cambiada a: ${ROLES[targetRoleKey]?.shortName}`, "info");
    }
  };

  // Pendientes Handlers
  const handleTogglePendiente = (pendienteId) => {
    setPendientes((prev) =>
      prev.map((p) => (p.id === pendienteId ? { ...p, completed: !p.completed } : p))
    );
    showToast("Pendiente actualizado", "success");
  };

  // QR Detection Handler
  const handleCodeDetected = (code) => {
    setIsScannerOpen(false);
    const existingFreezer = freezers.find((f) => f.qrCode === code);

    if (existingFreezer) {
      setSelectedFreezerId(existingFreezer.id);
      setActiveTab("congeladores");
      showToast(`Congelador ${code} identificado en ${existingFreezer.storeName}`, "success", Snowflake);
    } else {
      setPendingScannedCode(code);
      setIsOnboardingOpen(true);
      showToast(`Sticker nuevo ${code} detectado. Iniciando alta GPS...`, "info", QrCode);
    }
  };

  // Freezer Onboarding Handler
  const handleSaveNewFreezer = (newFreezer) => {
    setFreezers((prev) => [newFreezer, ...prev]);

    setStores((prev) =>
      prev.map((s) => {
        if (s.id === newFreezer.storeId) {
          return {
            ...s,
            freezerCount: (s.freezerCount || 0) + 1,
            freezerQrCodes: [...(s.freezerQrCodes || []), newFreezer.qrCode]
          };
        }
        return s;
      })
    );

    setIsOnboardingOpen(false);
    setSelectedFreezerId(newFreezer.id);
    setActiveTab("congeladores");
    showToast(`¡Congelador ${newFreezer.qrCode} enrolado con éxito!`, "success", CheckCircle2);
  };

  // Update Planogram Slot
  const handleUpdateStorePlanogram = (slotIndex, updatedData) => {
    setFreezers((prev) =>
      prev.map((f) => {
        if (f.id === selectedFreezerId) {
          const newSlots = [...f.slots];
          newSlots[slotIndex] = { ...newSlots[slotIndex], ...updatedData };
          return {
            ...f,
            slots: newSlots,
            lastAudit: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return f;
      })
    );
    showToast("Planograma actualizado en tiempo real", "success");
  };

  // Save Planogram Audit
  const handleSavePlanogramAudit = (freezerId, auditData) => {
    setFreezers((prev) =>
      prev.map((f) => {
        if (f.id === (freezerId || selectedFreezerId)) {
          return {
            ...f,
            model: auditData?.modelName || f.model,
            compliancePercent: auditData?.complianceScore ?? f.compliancePercent,
            lastAuditedAt: auditData?.lastAuditDate || new Date().toISOString(),
            metalPlanogram: auditData?.metalPlanogram || f.metalPlanogram,
            imberaPlanogram: auditData?.imberaPlanogram || f.imberaPlanogram,
            photoUrl: auditData?.photoEvidence || f.photoUrl
          };
        }
        return f;
      })
    );

    if (auditData?.restockedBoxes) {
      setSeller((prev) => ({
        ...prev,
        dailyGoal: {
          ...prev.dailyGoal,
          currentBoxes: prev.dailyGoal.currentBoxes + Number(auditData.restockedBoxes)
        }
      }));
    }

    showToast(`Planograma auditado (${auditData?.complianceScore || 100}% cumplimiento)`, "success", ShieldCheck);
  };

  // Save Quick Sale
  const handleSaveQuickSale = (saleData) => {
    setSeller((prev) => ({
      ...prev,
      dailyGoal: {
        ...prev.dailyGoal,
        currentAmount: prev.dailyGoal.currentAmount + saleData.amount,
        currentBoxes: prev.dailyGoal.currentBoxes + saleData.boxes
      }
    }));

    setStores((prev) =>
      prev.map((s) =>
        s.id === saleData.storeId
          ? { ...s, status: "completed", lastVisit: "Hoy, " + saleData.date }
          : s
      )
    );

    const newSaleItem = {
      id: `SALE-${Date.now()}`,
      vendorId: currentUser?.id || "USR-VEND-104",
      storeName: saleData.storeName,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      amount: saleData.amount,
      boxes: saleData.boxes,
      ticketNumber: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentType: "Contado / Transferencia",
      itemsSummary: `${saleData.boxes} cajas La Huerta & Frimart`,
      commission: Math.round(saleData.amount * 0.04)
    };

    setSalesLog((prev) => [newSaleItem, ...prev]);
    showToast(`+$${saleData.amount.toLocaleString()} MXN registrados en ${saleData.storeName}`, "success");
  };

  // Pending stores count for badge
  const pendingStoresCount = stores.filter((s) => s.status === "pending").length;

  // If session is locked or user not logged in, display the PIN Auth screen
  if (isLocked || !currentUser) {
    return (
      <MobileDeviceFrame>
        <AuthLockScreen
          users={users}
          currentSessionUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
        />
      </MobileDeviceFrame>
    );
  }

  return (
    <MobileDeviceFrame>
      <div className="flex flex-col min-h-full bg-white relative">
        {/* Real-time OTA Broadcast Banner for Devices */}
        <OtaDeviceUpdateBanner />

        {/* Adaptive Native Mobile Header */}
        <SellerMobileHeader
          currentUser={currentUser}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenNotifications={() => setActiveOperationalModal("notifications")}
          onOpenAdminKeys={() => setIsOwnerAdminOpen(true)}
          onOpenOtaUpdates={() => setIsOwnerOtaOpen(true)}
          onLockSession={handleLockSession}
          unreadAlertsCount={1}
        />

        {/* Dynamic Screens Based on Active Tab and Role */}
        <main className="flex-1">
          {/* 1. MODO PROPIETARIO HUB */}
          {activeTab === "propietario_hub" && (
            <OwnerMasterHubScreen
              ownerUser={currentUser}
              users={users}
              otaConfig={otaConfig}
              onOpenAdminKeys={() => setIsOwnerAdminOpen(true)}
              onOpenOtaUpdates={() => setIsOwnerOtaOpen(true)}
              onSwitchSimulatedRole={handleSwitchSimulatedRole}
            />
          )}

          {/* 2. SUPERVISOR HUB */}
          {activeTab === "supervision" && (
            <SupervisorHubScreen
              supervisorUser={currentUser}
              allUsers={users}
              assignedVendors={assignedVendors}
              stores={stores}
              freezers={freezers}
              onInspectFreezer={(fId) => {
                setSelectedFreezerId(fId);
                setActiveTab("congeladores");
              }}
              onNavigateToRoute={(routeId) => {
                setSelectedRouteFilter(routeId);
                setActiveTab("ruta");
              }}
              onOpenNewStoreModal={() => setIsNewStoreModalOpen(true)}
              onOpenMap={handleOpenRouteMap}
            />
          )}

          {/* 3. GERENTE DE CEDIS */}
          {activeTab === "cedis" && (
            <CedisManagerScreen
              managerUser={currentUser}
              stores={stores}
              freezers={freezers}
            />
          )}

          {/* 4. DIRECTOR COMERCIAL */}
          {activeTab === "direccion" && (
            <CommercialDirectorScreen
              directorUser={currentUser}
              onSelectCedis={() => setActiveTab("cedis")}
            />
          )}

          {/* 5. VENDEDOR: PENDIENTES & METAS */}
          {activeTab === "pendientes" && (
            <SellerPendingSalesScreen
              seller={seller}
              stores={stores}
              freezers={freezers}
              pendientes={pendientes}
              salesLog={salesLog}
              onTogglePendiente={handleTogglePendiente}
              onOpenStoreDetail={(store) => {
                setSelectedStore(store);
                setIsStoreDetailOpen(true);
              }}
              onOpenQuickSale={() => {
                setQuickSaleStore(stores[0]);
                setIsQuickSaleOpen(true);
              }}
              onOpenMap={handleOpenRouteMap}
              onOpenPlanogram={(fId) => {
                setSelectedFreezerId(fId);
                setActiveTab("congeladores");
              }}
            />
          )}

          {/* VENDEDOR: RUTA */}
          {activeTab === "ruta" && (
            <SellerRouteScreen
              seller={seller}
              currentUser={currentUser}
              assignedVendors={assignedVendors}
              stores={stores}
              freezers={freezers}
              activeTargetStoreId={activeTargetStoreId}
              onSetActiveTargetStore={handleSetActiveTargetStore}
              onSelectStore={(store) => {
                setSelectedStore(store);
                setIsStoreDetailOpen(true);
              }}
              onOpenPlanogramForFreezer={(freezerId) => {
                setSelectedFreezerId(freezerId);
                setActiveTab("congeladores");
              }}
              onOpenQuickSale={() => {
                setQuickSaleStore(stores[0]);
                setIsQuickSaleOpen(true);
              }}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenMap={handleOpenRouteMap}
              selectedRouteFilter={selectedRouteFilter}
              onSelectRouteFilter={setSelectedRouteFilter}
            />
          )}

          {/* CONGELADORES & PLANOGRAMAS */}
          {activeTab === "congeladores" && (
            <SellerFreezersScreen
              freezers={freezers}
              stores={stores}
              selectedFreezerId={selectedFreezerId}
              onSelectFreezerId={setSelectedFreezerId}
              onUpdateSlot={handleUpdateStorePlanogram}
              onSaveAudit={handleSavePlanogramAudit}
            />
          )}

          {/* ESCANEAR QR */}
          {activeTab === "escanear" && (
            <SellerScannerScreen
              onCodeDetected={handleCodeDetected}
              onOpenBatchGenerator={() => setActiveOperationalModal("batch")}
              existingCodes={freezers.map((f) => f.qrCode)}
            />
          )}

          {/* CATÁLOGO DE PRODUCTOS */}
          {activeTab === "catalogo" && (
            <SellerCatalogScreen
              categories={CATEGORIES}
              products={INITIAL_PRODUCTS}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToOrder={(p) => {
                showToast(`+1 caja de ${p.name} sugerida para tienda`, "success");
              }}
            />
          )}

          {/* PERFIL (VENDEDOR & SUPERVISOR) */}
          {activeTab === "perfil" && (
            <SellerProfileScreen
              currentUser={currentUser}
              seller={seller}
              storesCount={stores.length}
              freezersCount={freezers.length}
              onUpdateSeller={setSeller}
              onLockSession={handleLockSession}
              onOpenBatchGenerator={() => setActiveOperationalModal("batch")}
              onAddNewStore={handleAddNewStore}
              stores={stores}
            />
          )}
        </main>

        {/* Adaptive Persistent Bottom Navigation */}
        <SellerBottomNavigation
          activeTab={activeTab}
          onChangeTab={(tabId) => {
            setActiveTab(tabId);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          role={currentUser?.role || "vendedor"}
          pendingStoresCount={pendingStoresCount}
          userAvatar={currentUser?.avatar || seller.avatar}
        />

        {/* MODAL 1 DEL PROPIETARIO: GESTOR DE CLAVES Y AJUSTES */}
        <OwnerAccessAdminModal
          isOpen={isOwnerAdminOpen}
          onClose={() => setIsOwnerAdminOpen(false)}
          users={users}
          onUpdateUsers={(updatedList) => {
            setUsers(updatedList);
            showToast("Usuarios y claves de acceso actualizados", "success");
          }}
          appSettings={{
            defaultCommissionRate: 4.0,
            geofenceRadiusMeters: 60,
            tempThresholdCold: -18.0,
            companyBrand: "Frimart S.A. de C.V. & La Huerta"
          }}
          onUpdateAppSettings={() => {
            showToast("Ajustes guardados con éxito", "success");
          }}
        />

        {/* MODAL 2 DEL PROPIETARIO: DESPLIEGUE DE ACTUALIZACIONES OTA */}
        <OwnerOtaUpdateModal
          isOpen={isOwnerOtaOpen}
          onClose={() => setIsOwnerOtaOpen(false)}
          otaConfig={otaConfig}
          onDeployUpdate={(newOtaConfig) => {
            setOtaConfig(newOtaConfig);
            showToast(`¡Actualización ${newOtaConfig.currentVersion} enviada a ${newOtaConfig.activeFleetDevices} dispositivos!`, "success", Sparkles);
          }}
          onToggleSandboxPreview={() => {}}
        />

        {/* Floating Toast Notification */}
        {toast && (
          <div 
            role="status"
            aria-live="polite"
            className="fixed top-16 inset-x-0 mx-auto w-fit max-w-[88%] z-50 animate-bounce-subtle pointer-events-none"
          >
            <div className="px-4 py-2.5 rounded-full shadow-lg border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md bg-slate-900/90 text-white border-slate-800">
              <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center text-white shrink-0">
                {toast.icon ? (
                  <toast.icon className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                )}
              </div>
              <span className="leading-tight">{toast.message}</span>
            </div>
          </div>
        )}

        {/* In-App Mobile PWA Direct Install Banner (Android & iOS) */}
        <PwaInstallBanner />

        {/* Store Detail Bottom Sheet */}
        <SellerStoreDetailSheet
          isOpen={isStoreDetailOpen}
          onClose={() => setIsStoreDetailOpen(false)}
          store={selectedStore}
          freezers={freezers}
          sellerLocation={seller.currentLocation}
          onStartAudit={(freezerId) => {
            setSelectedFreezerId(freezerId);
            setActiveTab("congeladores");
          }}
          onOpenQuickSale={(store) => {
            setQuickSaleStore(store);
            setIsQuickSaleOpen(true);
          }}
          onOpenMap={handleOpenRouteMap}
        />

        {/* In-App Interactive Route Map Modal */}
        <SellerRouteMapModal
          isOpen={isRouteMapOpen}
          onClose={() => setIsRouteMapOpen(false)}
          stores={stores}
          seller={seller}
          currentUser={currentUser}
          assignedVendors={assignedVendors}
          freezers={freezers}
          initialStoreId={routeMapTargetStoreId || activeTargetStoreId}
          activeTargetStoreId={activeTargetStoreId}
          onSetActiveTargetStore={(storeId) => handleSetActiveTargetStore(storeId, false)}
          onSelectStore={(store) => {
            setSelectedStore(store);
            setIsStoreDetailOpen(true);
          }}
          onOpenPlanogram={(freezerId) => {
            setSelectedFreezerId(freezerId);
            setActiveTab("congeladores");
          }}
        />

        {/* Quick Sale Register Bottom Sheet */}
        <QuickSaleSheet
          isOpen={isQuickSaleOpen}
          onClose={() => setIsQuickSaleOpen(false)}
          stores={stores}
          initialStore={quickSaleStore}
          onSaveSale={handleSaveQuickSale}
        />

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, qty) => {
            showToast(`+${qty} cajas de ${p.name} añadidas al pedido`, "success");
            setSelectedProduct(null);
          }}
          isFavorite={false}
          onToggleFavorite={() => {}}
          relatedProducts={INITIAL_PRODUCTS.filter(
            (p) => p.category === selectedProduct?.category && p.id !== selectedProduct?.id
          ).slice(0, 4)}
        />

        {/* QR Scanner Modal */}
        <QRScannerModal 
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onCodeDetected={handleCodeDetected}
          existingFreezerCodes={freezers.map((f) => f.qrCode)}
        />

        {/* Freezer GPS Onboarding Modal */}
        <FreezerOnboardingModal 
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          qrCode={pendingScannedCode}
          stores={stores}
          onSave={handleSaveNewFreezer}
        />

        {/* Operational Slide-up Modal: 2,000 Stickers Batch Generator */}
        {activeOperationalModal === "batch" && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
            <div className="w-full max-w-md mx-auto p-4 bg-white rounded-t-[28px] shadow-2xl space-y-3 animate-sheet-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-section-title text-[#0f172a]">Lote de 2,000 Stickers QR</h3>
                    <p className="text-[11px] text-slate-500">Etiquetas metálicas para congeladores</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveOperationalModal(null)} 
                  className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <QRBatchGenerator qrBatch={qrBatch} freezers={freezers} />
            </div>
          </div>
        )}

        {/* Operational Slide-up Modal: Supervisor Console */}
        {activeOperationalModal === "supervision" && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
            <div className="w-full max-w-md mx-auto p-4 bg-white rounded-t-[28px] shadow-2xl space-y-3 animate-sheet-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-section-title text-[#0f172a]">Consola de Supervisión</h3>
                    <p className="text-[11px] text-slate-500">Telemetría y rutas en Aguascalientes</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveOperationalModal(null)} 
                  className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <SupervisorConsole 
                seller={seller}
                stores={stores}
                freezers={freezers}
                onInspectFreezer={(fId) => {
                  setSelectedFreezerId(fId);
                  setActiveOperationalModal(null);
                  setActiveTab("congeladores");
                }}
              />
            </div>
          </div>
        )}

        {/* Operational Slide-up Modal: Admin Master Catalog */}
        {activeOperationalModal === "admin" && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
            <div className="w-full max-w-md mx-auto p-4 bg-white rounded-t-[28px] shadow-2xl space-y-3 animate-sheet-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-section-title text-[#0f172a]">Catálogo Maestro</h3>
                    <p className="text-[11px] text-slate-500">Costos, precios y configuración</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveOperationalModal(null)} 
                  className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AdminCatalogManager />
            </div>
          </div>
        )}

        {/* Operational Notifications Modal */}
        {activeOperationalModal === "notifications" && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
            <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                    <Bell className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-section-title text-[#0f172a]">Avisos de Ruta</h3>
                    <p className="text-[11px] text-slate-500">Alertas operativas de congeladores Ags</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveOperationalModal(null)} 
                  className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Snowflake className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-900">Alerta de Stock Crítico</span>
                      <span className="text-[10px] text-rose-600 font-bold">Hace 15 min</span>
                    </div>
                    <p className="text-xs text-rose-700 mt-1">
                      El congelador <strong className="font-mono">FRM-0089</strong> en Cremería Nueva Benjamín de Alba tiene solo 2 piezas de Brócoli La Huerta. Se requiere resurtido prioritario hoy.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">CEDIS Aguascalientes (1205) Abastecido</span>
                      <span className="text-[10px] text-slate-400">Hoy 06:45 AM</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Llegó embarque con 400 cajas de Franuí Pink y Mezcla California La Huerta disponibles para entrega inmediata.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveOperationalModal(null)}
                className="tap-effect w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Modal Global de Alta de Nuevo Punto de Venta */}
        <NewStoreOnboardingModal
          isOpen={isNewStoreModalOpen}
          onClose={() => setIsNewStoreModalOpen(false)}
          onSave={handleAddNewStore}
          existingStores={stores}
        />
      </div>
    </MobileDeviceFrame>
  );
}
