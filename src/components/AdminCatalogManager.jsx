import React, { useState, useEffect } from "react";
import { 
  Users, 
  MapPin, 
  Store, 
  Building2, 
  Target, 
  Layers, 
  Receipt, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Check, 
  X, 
  AlertCircle,
  Sparkles,
  DollarSign,
  Package,
  Calendar
} from "lucide-react";
import { LA_HUERTA_SKUS } from "../data/mockData";

const DEFAULT_SELLERS = [
  {
    id: "VEND-104",
    name: "Juan Pablo Morales",
    email: "j.morales@frimart.com.mx",
    phone: "998-123-4567",
    cedis: "CEDIS Cancún (01)",
    routeId: "RUTA-04",
    routeName: "Ruta 04 - Oxxo & Autoservicios Cancún",
    dailyQuota: 35000,
    dailyBoxes: 140,
    commissionRate: 4.0,
    status: "active"
  },
  {
    id: "VEND-105",
    name: "María Eugenia Torres",
    email: "m.torres@frimart.com.mx",
    phone: "998-987-6543",
    cedis: "CEDIS Cancún (01)",
    routeId: "RUTA-02",
    routeName: "Ruta 02 - Riviera Maya Hoteles",
    dailyQuota: 48000,
    dailyBoxes: 190,
    commissionRate: 4.5,
    status: "active"
  },
  {
    id: "VEND-108",
    name: "Carlos Alberto Reyes",
    email: "c.reyes@frimart.com.mx",
    phone: "999-456-7890",
    cedis: "CEDIS Mérida (02)",
    routeId: "RUTA-11",
    routeName: "Ruta 11 - Mérida Tradicional",
    dailyQuota: 28000,
    dailyBoxes: 110,
    commissionRate: 3.8,
    status: "active"
  }
];

const DEFAULT_ROUTES = [
  {
    id: "RUTA-04",
    name: "Ruta 04 - Oxxo & Autoservicios Cancún",
    cedis: "CEDIS Cancún (01)",
    vendorName: "Juan Pablo Morales",
    days: "Lun - Sáb",
    storesCount: 8,
    status: "active"
  },
  {
    id: "RUTA-02",
    name: "Ruta 02 - Riviera Maya Hoteles & Clubes",
    cedis: "CEDIS Cancún (01)",
    vendorName: "María Eugenia Torres",
    days: "Lun - Vie",
    storesCount: 12,
    status: "active"
  },
  {
    id: "RUTA-11",
    name: "Ruta 11 - Mérida Tradicional Abarrotes",
    cedis: "CEDIS Mérida (02)",
    vendorName: "Carlos Alberto Reyes",
    days: "Lun - Sáb",
    storesCount: 15,
    status: "active"
  }
];

const DEFAULT_CEDIS = [
  {
    id: "CEDIS-01",
    code: "CUN",
    name: "CEDIS Cancún Principal",
    state: "Quintana Roo",
    address: "Av. López Portillo Km 7.5, Bodega 14",
    manager: "Ing. Guillermo Salcedo",
    monthlyTarget: 3800000,
    activeRoutes: 6,
    status: "active"
  },
  {
    id: "CEDIS-02",
    code: "MID",
    name: "CEDIS Mérida Periférico",
    state: "Yucatán",
    address: "Anillo Periférico Poniente #1200",
    manager: "Lic. Patricia Ceballos",
    monthlyTarget: 4200000,
    activeRoutes: 8,
    status: "active"
  },
  {
    id: "CEDIS-03",
    code: "PDC",
    name: "CEDIS Playa del Carmen Express",
    state: "Quintana Roo",
    address: "Carretera Federal Cancún-Tulum Sm 54",
    manager: "Raúl Castañeda",
    monthlyTarget: 2100000,
    activeRoutes: 3,
    status: "active"
  }
];

const DEFAULT_GOALS = [
  {
    id: "GOAL-2026-09",
    targetType: "Diaria por Vendedor",
    subject: "Juan Pablo Morales (Ruta 04)",
    amountTarget: 35000,
    boxesTarget: 140,
    effectiveVisitsTarget: 8,
    bonusPercent: 4.0,
    period: "Septiembre 2026",
    status: "active"
  },
  {
    id: "GOAL-2026-09B",
    targetType: "Diaria por Vendedor",
    subject: "María Eugenia Torres (Ruta 02)",
    amountTarget: 48000,
    boxesTarget: 190,
    effectiveVisitsTarget: 12,
    bonusPercent: 4.5,
    period: "Septiembre 2026",
    status: "active"
  },
  {
    id: "GOAL-CEDIS-CUN",
    targetType: "Mensual CEDIS",
    subject: "CEDIS Cancún (Total Plaza)",
    amountTarget: 3800000,
    boxesTarget: 15200,
    effectiveVisitsTarget: 480,
    bonusPercent: 2.5,
    period: "Septiembre 2026",
    status: "active"
  }
];

const DEFAULT_PLANOGRAMS = [
  {
    id: "PLN-OXXO-5CH",
    name: "Planograma Maestro OXXO 5 Charolas (La Huerta)",
    chain: "Cadena Comercial OXXO",
    shelvesCount: 5,
    updatedAt: "2026-09-18",
    version: "v10.12",
    skusCount: 11,
    totalFacings: 27,
    status: "active"
  },
  {
    id: "PLN-SOR-5CH",
    name: "Planograma Soriana Autoservicios (Góndola Doble)",
    chain: "Soriana Híper / Súper",
    shelvesCount: 5,
    updatedAt: "2026-09-01",
    version: "v4.2",
    skusCount: 12,
    totalFacings: 34,
    status: "active"
  },
  {
    id: "PLN-ABARROTES-4CH",
    name: "Planograma Mueble Compacto 4 Charolas (Abarrotes)",
    chain: "Canal Tradicional / Independientes",
    shelvesCount: 4,
    updatedAt: "2026-08-15",
    version: "v2.0",
    skusCount: 8,
    totalFacings: 18,
    status: "active"
  }
];

export default function AdminCatalogManager({ 
  seller, 
  onUpdateSeller,
  stores, 
  onUpdateStores,
  freezers,
  onUpdateFreezers,
  showToast
}) {
  const [activeCatalog, setActiveCatalog] = useState("vendedores");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initial Catalogs State with LocalStorage Persistence
  const [sellersList, setSellersList] = useState(() => {
    const saved = localStorage.getItem("frimart_sellersList");
    return saved ? JSON.parse(saved) : DEFAULT_SELLERS;
  });

  const [routesList, setRoutesList] = useState(() => {
    const saved = localStorage.getItem("frimart_routesList");
    return saved ? JSON.parse(saved) : DEFAULT_ROUTES;
  });

  const [cedisList, setCedisList] = useState(() => {
    const saved = localStorage.getItem("frimart_cedisList");
    return saved ? JSON.parse(saved) : DEFAULT_CEDIS;
  });

  const [goalsList, setGoalsList] = useState(() => {
    const saved = localStorage.getItem("frimart_goalsList");
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [masterPlanograms, setMasterPlanograms] = useState(() => {
    const saved = localStorage.getItem("frimart_masterPlanograms");
    return saved ? JSON.parse(saved) : DEFAULT_PLANOGRAMS;
  });

  // LocalStorage Auto-Sync
  useEffect(() => {
    localStorage.setItem("frimart_sellersList", JSON.stringify(sellersList));
  }, [sellersList]);

  useEffect(() => {
    localStorage.setItem("frimart_routesList", JSON.stringify(routesList));
  }, [routesList]);

  useEffect(() => {
    localStorage.setItem("frimart_cedisList", JSON.stringify(cedisList));
  }, [cedisList]);

  useEffect(() => {
    localStorage.setItem("frimart_goalsList", JSON.stringify(goalsList));
  }, [goalsList]);

  useEffect(() => {
    localStorage.setItem("frimart_masterPlanograms", JSON.stringify(masterPlanograms));
  }, [masterPlanograms]);

  // Form State for generic modal
  const [formData, setFormData] = useState({});

  // Helper to open create modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    if (activeCatalog === "vendedores") {
      setFormData({
        id: `VEND-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        email: "",
        phone: "",
        cedis: "CEDIS Cancún (01)",
        routeName: "Ruta 04 - Oxxo & Autoservicios Cancún",
        dailyQuota: 35000,
        dailyBoxes: 140,
        commissionRate: 4.0,
        status: "active"
      });
    } else if (activeCatalog === "rutas") {
      setFormData({
        id: `RUTA-0${routesList.length + 1}`,
        name: "",
        cedis: "CEDIS Cancún (01)",
        vendorName: "Juan Pablo Morales",
        days: "Lun - Sáb",
        storesCount: 6,
        status: "active"
      });
    } else if (activeCatalog === "negocios") {
      setFormData({
        id: `STORE-0${stores.length + 1}`,
        code: "NVO",
        name: "",
        chain: "OXXO",
        type: "Conveniencia",
        address: "",
        lat: 21.1500,
        lng: -86.8400,
        geofenceRadius: 60,
        managerName: "",
        status: "pending"
      });
    } else if (activeCatalog === "cedis") {
      setFormData({
        id: `CEDIS-0${cedisList.length + 1}`,
        code: "PLZ",
        name: "",
        state: "Quintana Roo",
        address: "",
        manager: "",
        monthlyTarget: 3000000,
        activeRoutes: 4,
        status: "active"
      });
    } else if (activeCatalog === "metas") {
      setFormData({
        id: `GOAL-${Date.now()}`,
        targetType: "Diaria por Vendedor",
        subject: "Vendedor de Campo",
        amountTarget: 35000,
        boxesTarget: 140,
        effectiveVisitsTarget: 8,
        bonusPercent: 4.0,
        period: "Septiembre 2026",
        status: "active"
      });
    } else if (activeCatalog === "planogramas") {
      setFormData({
        id: `PLN-${Date.now()}`,
        name: "Nuevo Planograma Frimart",
        chain: "Cadena Comercial",
        shelvesCount: 5,
        updatedAt: new Date().toISOString().slice(0, 10),
        version: "v1.0",
        skusCount: 10,
        totalFacings: 24,
        status: "active"
      });
    }
    setIsCreateModalOpen(true);
  };

  // Helper to open edit modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsCreateModalOpen(true);
  };

  // Handle In-App Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteClick = (id, name, catalog = activeCatalog) => {
    setDeleteTarget({ id, name, catalog });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, catalog, name } = deleteTarget;
    if (catalog === "vendedores") {
      setSellersList(prev => prev.filter(i => i.id !== id));
    } else if (catalog === "rutas") {
      setRoutesList(prev => prev.filter(i => i.id !== id));
    } else if (catalog === "negocios") {
      onUpdateStores(stores.filter(i => i.id !== id));
    } else if (catalog === "cedis") {
      setCedisList(prev => prev.filter(i => i.id !== id));
    } else if (catalog === "metas") {
      setGoalsList(prev => prev.filter(i => i.id !== id));
    } else if (catalog === "planogramas") {
      setMasterPlanograms(prev => prev.filter(i => i.id !== id));
    }
    if (showToast) {
      showToast(`✓ "${name || id}" dado de baja y guardado en almacenamiento`, "info");
    }
    setDeleteTarget(null);
  };

  // Handle Save (Create or Update)
  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Update
      if (activeCatalog === "vendedores") {
        setSellersList(prev => prev.map(i => i.id === editingItem.id ? formData : i));
        if (formData.id === seller.id) {
          onUpdateSeller(prev => ({
            ...prev,
            name: formData.name,
            route: formData.routeName,
            dailyGoal: {
              ...prev.dailyGoal,
              targetAmount: Number(formData.dailyQuota),
              targetBoxes: Number(formData.dailyBoxes),
              commissionRate: Number(formData.commissionRate) / 100
            }
          }));
        }
      } else if (activeCatalog === "rutas") {
        setRoutesList(prev => prev.map(i => i.id === editingItem.id ? formData : i));
      } else if (activeCatalog === "negocios") {
        onUpdateStores(stores.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
      } else if (activeCatalog === "cedis") {
        setCedisList(prev => prev.map(i => i.id === editingItem.id ? formData : i));
      } else if (activeCatalog === "metas") {
        setGoalsList(prev => prev.map(i => i.id === editingItem.id ? formData : i));
      } else if (activeCatalog === "planogramas") {
        setMasterPlanograms(prev => prev.map(i => i.id === editingItem.id ? formData : i));
      }
    } else {
      // Create
      if (activeCatalog === "vendedores") {
        setSellersList(prev => [formData, ...prev]);
      } else if (activeCatalog === "rutas") {
        setRoutesList(prev => [formData, ...prev]);
      } else if (activeCatalog === "negocios") {
        onUpdateStores([formData, ...stores]);
      } else if (activeCatalog === "cedis") {
        setCedisList(prev => [formData, ...prev]);
      } else if (activeCatalog === "metas") {
        setGoalsList(prev => [formData, ...prev]);
      } else if (activeCatalog === "planogramas") {
        setMasterPlanograms(prev => [formData, ...prev]);
      }
    }
    if (showToast) {
      showToast(
        editingItem 
          ? `✓ Cambios guardados permanentemente en ${activeCatalog.toUpperCase()}` 
          : `✓ Nuevo registro guardado permanentemente en ${activeCatalog.toUpperCase()}`,
        "success"
      );
    }
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="glass-panel p-5 border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Building2 className="w-6 h-6 text-sky-600" />
                Catálogos Maestros & Administración (Altas, Bajas y Edición)
              </h2>
              <span className="bg-sky-50 text-sky-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-sky-200">
                Panel Central
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Control integral del sistema comercial Frimart: Administra vendedores, rutas comerciales, negocios y geocercas GPS, CEDIS/plazas, cuotas de venta y plantillas de planogramas oficiales.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="tactile-btn flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Dar de Alta Nuevo Registro</span>
          </button>
        </div>

        {/* Catalog Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-5 border-t border-slate-200 pt-4 text-xs font-semibold">
          {[
            { id: "vendedores", label: "Vendedores", icon: Users, count: sellersList.length },
            { id: "rutas", label: "Rutas Comerciales", icon: MapPin, count: routesList.length },
            { id: "negocios", label: "Negocios & Puntos de Venta", icon: Store, count: stores.length },
            { id: "cedis", label: "CEDIS & Plazas", icon: Building2, count: cedisList.length },
            { id: "metas", label: "Metas Comerciales", icon: Target, count: goalsList.length },
            { id: "planogramas", label: "Planogramas Maestros", icon: Layers, count: masterPlanograms.length },
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = activeCatalog === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCatalog(cat.id); setSearchTerm(""); }}
                className={`tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20 font-bold"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Content Area */}
      <div className="glass-panel p-6 border border-slate-200">
        {/* Search & Stats Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Buscar en ${activeCatalog}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 font-mono transition"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Operaciones:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Alta</span>
            <span>•</span>
            <span className="text-sky-600 font-bold flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edición</span>
            <span>•</span>
            <span className="text-rose-600 font-bold flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Baja</span>
          </div>
        </div>

        {/* TABLA 1: VENDEDORES */}
        {activeCatalog === "vendedores" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">ID / Nombre</th>
                  <th className="py-2.5 px-3">Contacto</th>
                  <th className="py-2.5 px-3">CEDIS / Plaza</th>
                  <th className="py-2.5 px-3">Ruta Asignada</th>
                  <th className="py-2.5 px-3">Cuota Diaria</th>
                  <th className="py-2.5 px-3">Comisión</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellersList
                  .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                        <span className="font-mono text-[10px] text-sky-700 font-bold">{s.id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div>{s.email}</div>
                        <div className="text-slate-400 text-[10px]">{s.phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700 border border-slate-200">
                          {s.cedis}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-sky-700">
                        {s.routeName}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-emerald-700">
                          ${Number(s.dailyQuota).toLocaleString("es-MX")} MXN
                        </div>
                        <div className="text-[10px] text-slate-500">{s.dailyBoxes} cajas/día</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-purple-700">
                        {s.commissionRate}%
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 bg-slate-100 hover:bg-sky-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                            title="Editar vendedor"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(s.id, s.name, "vendedores")}
                            className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                            title="Dar de baja vendedor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLA 2: RUTAS COMERCIALES */}
        {activeCatalog === "rutas" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Código / Nombre Ruta</th>
                  <th className="py-2.5 px-3">CEDIS Base</th>
                  <th className="py-2.5 px-3">Vendedor Titular</th>
                  <th className="py-2.5 px-3">Frecuencia</th>
                  <th className="py-2.5 px-3">Puntos de Venta</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {routesList
                  .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-sm">{r.name}</div>
                        <span className="font-mono text-[10px] text-sky-700 font-bold">{r.id}</span>
                      </td>
                      <td className="py-3 px-3">{r.cedis}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">{r.vendorName}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{r.days}</td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-800 border border-slate-200">
                          {r.storesCount} tiendas
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 bg-slate-100 hover:bg-sky-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(r.id, r.name, "rutas")}
                            className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                            title="Dar de baja ruta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLA 3: NEGOCIOS / TIENDAS (CLIENTES) */}
        {activeCatalog === "negocios" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nombre del Negocio</th>
                  <th className="py-2.5 px-3">Cadena / Canal</th>
                  <th className="py-2.5 px-3">Dirección</th>
                  <th className="py-2.5 px-3">Coordenadas GPS</th>
                  <th className="py-2.5 px-3">Geocerca</th>
                  <th className="py-2.5 px-3">Congeladores</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores
                  .filter(st => st.name.toLowerCase().includes(searchTerm.toLowerCase()) || (st.address || "").toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(st => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                        <span className="font-mono text-[10px] text-slate-500">ID: {st.id} • {st.code}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-sky-700 border border-slate-200">
                          {st.chain} ({st.type})
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-500">
                        {st.address}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-700 text-[11px] font-semibold">
                        {st.lat.toFixed(4)}°, {st.lng.toFixed(4)}°
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        ±{st.geofenceRadius}m
                      </td>
                      <td className="py-3 px-3">
                        {st.freezersCount > 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {st.freezersCount} activo(s)
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Sin congelador
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 bg-slate-100 hover:bg-sky-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(st.id, st.name, "negocios")}
                            className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                            title="Dar de baja negocio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLA 4: CEDIS O PLAZAS */}
        {activeCatalog === "cedis" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Código / Nombre CEDIS</th>
                  <th className="py-2.5 px-3">Estado / Región</th>
                  <th className="py-2.5 px-3">Gerente de Plaza</th>
                  <th className="py-2.5 px-3">Presupuesto Mensual</th>
                  <th className="py-2.5 px-3">Rutas Activas</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cedisList.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                      <span className="font-mono text-[10px] text-sky-700 font-bold">{c.id} ({c.code})</span>
                    </td>
                    <td className="py-3 px-3">{c.state}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{c.manager}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      ${Number(c.monthlyTarget).toLocaleString("es-MX")} MXN
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-sky-700">
                      {c.activeRoutes} rutas
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 bg-slate-100 hover:bg-sky-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c.id, c.name, "cedis")}
                          className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                          title="Dar de baja CEDIS"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLA 5: METAS COMERCIALES */}
        {activeCatalog === "metas" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tipo / Asignado A</th>
                  <th className="py-2.5 px-3">Período</th>
                  <th className="py-2.5 px-3">Meta en Pesos ($)</th>
                  <th className="py-2.5 px-3">Meta en Cajas</th>
                  <th className="py-2.5 px-3">Visitas Objetivo</th>
                  <th className="py-2.5 px-3">Bono %</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {goalsList.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-sm">{g.subject}</div>
                      <span className="font-mono text-[10px] text-sky-700 font-bold">{g.targetType}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{g.period}</td>
                    <td className="py-3 px-3 font-mono font-black text-emerald-700">
                      ${Number(g.amountTarget).toLocaleString("es-MX")} MXN
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {g.boxesTarget.toLocaleString()} cajas
                    </td>
                    <td className="py-3 px-3 font-mono text-sky-700 font-semibold">
                      {g.effectiveVisitsTarget} visitas
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">
                      {g.bonusPercent}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="p-1.5 bg-slate-100 hover:bg-sky-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(g.id, g.subject, "metas")}
                          className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                          title="Dar de baja meta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TABLA 6: PLANOGRAMAS MAESTROS */}
        {activeCatalog === "planogramas" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Código / Nombre Plantilla</th>
                  <th className="py-2.5 px-3">Cadena Aplicable</th>
                  <th className="py-2.5 px-3">Charolas</th>
                  <th className="py-2.5 px-3">SKUs Activos</th>
                  <th className="py-2.5 px-3">Vistas Totales</th>
                  <th className="py-2.5 px-3">Vigencia / Versión</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {masterPlanograms.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <span className="font-mono text-[10px] text-sky-700 font-bold">{p.id}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">{p.chain}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{p.shelvesCount} charolas</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{p.skusCount} SKUs</td>
                    <td className="py-3 px-3 font-mono font-bold text-sky-700">{p.totalFacings} vistas</td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {p.version} ({p.updatedAt})
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 bg-slate-100 hover:bg-sky-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p.id, p.name, "planogramas")}
                          className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition border border-slate-200"
                          title="Dar de baja planograma"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL GENÉRICO DE ALTA / EDICIÓN */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl my-8 relative text-slate-800">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                {editingItem ? "Modificar / Editar Registro" : "Alta de Nuevo Registro"} ({activeCatalog.toUpperCase()})
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* VENDEDOR FORM FIELDS */}
              {activeCatalog === "vendedores" && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre Completo del Vendedor:</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico:</label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Teléfono:</label>
                      <input
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">CEDIS Asignado:</label>
                      <select
                        value={formData.cedis || ""}
                        onChange={(e) => setFormData({ ...formData, cedis: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      >
                        {cedisList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ruta Asignada:</label>
                      <select
                        value={formData.routeName || ""}
                        onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      >
                        {routesList.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Meta Diaria ($):</label>
                      <input
                        type="number"
                        required
                        value={formData.dailyQuota || ""}
                        onChange={(e) => setFormData({ ...formData, dailyQuota: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Cuota Cajas:</label>
                      <input
                        type="number"
                        required
                        value={formData.dailyBoxes || ""}
                        onChange={(e) => setFormData({ ...formData, dailyBoxes: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Comisión (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.commissionRate || ""}
                        onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* NEGOCIOS / TIENDAS FORM FIELDS */}
              {activeCatalog === "negocios" && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre del Punto de Venta:</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Cadena Comercial:</label>
                      <select
                        value={formData.chain || "OXXO"}
                        onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="OXXO">Cadena Comercial OXXO</option>
                        <option value="Soriana">Soriana (Híper / Súper)</option>
                        <option value="Walmart">Walmart / Bodega Aurrerá</option>
                        <option value="Willys">Super Willys</option>
                        <option value="Independiente">Abarrotes Independiente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Código de Tienda (CR/POS):</label>
                      <input
                        type="text"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Dirección Completa:</label>
                    <input
                      type="text"
                      required
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Latitud GPS:</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={formData.lat || ""}
                        onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Longitud GPS:</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={formData.lng || ""}
                        onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Radio Geocerca (m):</label>
                      <input
                        type="number"
                        required
                        value={formData.geofenceRadius || 60}
                        onChange={(e) => setFormData({ ...formData, geofenceRadius: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* RUTAS FORM FIELDS */}
              {activeCatalog === "rutas" && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre de la Ruta:</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">CEDIS:</label>
                      <select
                        value={formData.cedis || ""}
                        onChange={(e) => setFormData({ ...formData, cedis: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      >
                        {cedisList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Vendedor Asignado:</label>
                      <input
                        type="text"
                        value={formData.vendorName || ""}
                        onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* CEDIS FORM FIELDS */}
              {activeCatalog === "cedis" && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Nombre del CEDIS / Plaza:</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Código / Siglas:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. CUN"
                        value={formData.code || ""}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold uppercase focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Estado o Región:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Quintana Roo, Yucatán..."
                        value={formData.state || ""}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Gerente de Plaza:</label>
                      <input
                        type="text"
                        required
                        placeholder="Nombre del gerente"
                        value={formData.manager || ""}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Dirección de Bodega / Almacén:</label>
                    <input
                      type="text"
                      placeholder="Dirección completa del CEDIS"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Presupuesto Mensual ($ MXN):</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.monthlyTarget || ""}
                        onChange={(e) => setFormData({ ...formData, monthlyTarget: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Número de Rutas Activas:</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.activeRoutes || ""}
                        onChange={(e) => setFormData({ ...formData, activeRoutes: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold text-sky-700 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* METAS FORM FIELDS */}
              {activeCatalog === "metas" && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Objetivo / Asignado A:</label>
                    <input
                      type="text"
                      required
                      value={formData.subject || ""}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Meta en Pesos ($ MXN):</label>
                      <input
                        type="number"
                        required
                        value={formData.amountTarget || ""}
                        onChange={(e) => setFormData({ ...formData, amountTarget: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Meta en Cajas:</label>
                      <input
                        type="number"
                        required
                        value={formData.boxesTarget || ""}
                        onChange={(e) => setFormData({ ...formData, boxesTarget: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* PLANOGRAMAS FORM FIELDS */}
              {activeCatalog === "planogramas" && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre de la Plantilla de Planograma:</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Cadena Comercial:</label>
                      <input
                        type="text"
                        value={formData.chain || ""}
                        onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Número de Charolas:</label>
                      <select
                        value={formData.shelvesCount || 5}
                        onChange={(e) => setFormData({ ...formData, shelvesCount: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                      >
                        <option value={3}>3 Charolas</option>
                        <option value={4}>4 Charolas</option>
                        <option value={5}>5 Charolas (Estándar OXXO)</option>
                        <option value={6}>6 Charolas</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="tactile-btn px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="tactile-btn px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 shadow-lg shadow-sky-600/25 cursor-pointer"
                >
                  {editingItem ? "Guardar Cambios" : "Crear Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BAJA IN-APP */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-slate-800">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Confirmar Baja de Registro</h3>
                <p className="text-xs text-slate-400 font-mono uppercase">Catálogo: {deleteTarget.catalog}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              ¿Estás seguro de que deseas dar de baja <strong className="text-slate-900">"{deleteTarget.name}"</strong>? Esta acción eliminará el registro de la lista activa.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="tactile-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="tactile-btn px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
