import React, { useState } from "react";
import {
  Crown,
  KeyRound,
  Sliders,
  Plus,
  Pencil,
  Check,
  X,
  Search,
  Eye,
  EyeOff,
  Save
} from "lucide-react";
import { ROLES, MASTER_CEDIS } from "../../data/authRolesData";
import AppSelect from "../ui/AppSelect";

export default function OwnerAccessAdminModal({
  isOpen,
  onClose,
  users = [],
  onUpdateUsers,
  appSettings = {},
  onUpdateAppSettings
}) {
  const [activeTab, setActiveTab] = useState("keys"); // 'keys' | 'settings' | 'new_user'
  const [searchUser, setSearchUser] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingPin, setEditingPin] = useState("");
  const [showPins, setShowPins] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "vendedor",
    accessKey: "",
    phone: "",
    cedisId: "CEDIS-AGS",
    routeId: "RUTA-04"
  });

  // Settings state
  const [settings, setSettings] = useState({
    defaultCommissionRate: appSettings.defaultCommissionRate || 4.0,
    geofenceRadiusMeters: appSettings.geofenceRadiusMeters || 60,
    tempThresholdCold: appSettings.tempThresholdCold || -18.0,
    companyBrand: appSettings.companyBrand || "Frimart S.A. de C.V. & La Huerta"
  });

  if (!isOpen) return null;

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setEditingPin(user.accessKey);
  };

  const handleSavePin = (userId) => {
    if (!editingPin || editingPin.length < 4) {
      alert("La clave de acceso debe tener al menos 4 caracteres o dígitos.");
      return;
    }
    const updated = users.map((u) => 
      u.id === userId ? { ...u, accessKey: editingPin } : u
    );
    onUpdateUsers(updated);
    setEditingUserId(null);
  };

  const handleToggleUserStatus = (userId) => {
    const updated = users.map((u) => 
      u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
    );
    onUpdateUsers(updated);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.accessKey) {
      alert("Por favor completa el nombre y la clave de acceso.");
      return;
    }

    const created = {
      id: `USR-${Date.now()}`,
      name: newUser.name,
      email: newUser.email || `${newUser.name.toLowerCase().replace(/\s+/g, ".")}@frimart.com.mx`,
      role: newUser.role,
      accessKey: newUser.accessKey,
      phone: newUser.phone || "998-000-0000",
      cedisId: newUser.cedisId,
      cedisName: MASTER_CEDIS.find((c) => c.id === newUser.cedisId)?.name || "CEDIS Aguascalientes (1205)",
      routeId: newUser.routeId,
      routeName: `Ruta ${newUser.routeId}`,
      status: "active",
      lastLogin: "Nuevo usuario",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    };

    onUpdateUsers([...users, created]);
    setNewUser({
      name: "",
      email: "",
      role: "vendedor",
      accessKey: "",
      phone: "",
      cedisId: "CEDIS-AGS",
      routeId: "RUTA-04"
    });
    setActiveTab("keys");
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdateAppSettings(settings);
    alert("✓ Ajustes corporativos guardados con éxito.");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.accessKey.includes(searchUser)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white sm:rounded-[32px] rounded-t-[28px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-sheet-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Outfit'] tracking-tight flex items-center gap-2">
                Modo Propietario • Administración & Claves
              </h2>
              <p className="text-[11px] text-rose-200/80">
                Gobernanza de accesos, roles y configuración de la app
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-4 pt-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 text-xs font-bold">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("keys")}
              className={`tap-effect px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "keys" ? "bg-white text-rose-700 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Claves de Acceso ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("new_user")}
              className={`tap-effect px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "new_user" ? "bg-white text-rose-700 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Acceso
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`tap-effect px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "settings" ? "bg-white text-rose-700 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Ajustes de la App
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: GESTIÓN DE CLAVES */}
          {activeTab === "keys" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Buscar usuario por nombre o rol..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-rose-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  onClick={() => setShowPins(!showPins)}
                  className="tap-effect px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {showPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPins ? "Ocultar PINs" : "Ver PINs"}
                </button>
              </div>

              <div className="space-y-2">
                {filteredUsers.map((user) => {
                  const roleConfig = ROLES[user.role] || ROLES.vendedor;
                  const isEditing = editingUserId === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`p-3.5 rounded-2xl border transition shadow-2xs space-y-2 ${
                        user.status === "suspended"
                          ? "bg-slate-100 border-slate-300 opacity-60"
                          : "bg-white border-slate-200 hover:border-rose-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{user.name}</span>
                              <span
                                className="text-[10px] font-bold px-2 py-0.2 rounded-full border"
                                style={{
                                  backgroundColor: roleConfig.bgColor,
                                  color: roleConfig.color,
                                  borderColor: roleConfig.borderColor
                                }}
                              >
                                {roleConfig.shortName}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {user.cedisName} • {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Status Toggle */}
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`tap-effect text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                            user.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                          title="Alternar estado activo/suspendido"
                        >
                          {user.status === "active" ? "Activo" : "Suspendido"}
                        </button>
                      </div>

                      {/* PIN Edit Row */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-[11px] font-medium">Clave de Acceso:</span>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editingPin}
                                onChange={(e) => setEditingPin(e.target.value)}
                                className="w-20 px-2 py-1 text-xs border border-rose-400 rounded-lg font-mono font-bold bg-white text-slate-900"
                                maxLength={8}
                                autoFocus
                              />
                              <button
                                onClick={() => handleSavePin(user.id)}
                                className="p-1 rounded-md bg-emerald-600 text-white cursor-pointer"
                                title="Guardar clave"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="p-1 rounded-md bg-slate-200 text-slate-600 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                              {showPins ? user.accessKey : "••••"}
                            </span>
                          )}
                        </div>

                        {!isEditing && (
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="tap-effect text-rose-600 font-bold hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            Cambiar Clave
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: NUEVO USUARIO / ACCESO */}
          {activeTab === "new_user" && (
            <form onSubmit={handleCreateUser} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-rose-600" />
                Dar de Alta Nueva Clave & Usuario
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Ej. Fernando Salgado"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Rol en la Empresa</label>
                  <AppSelect
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="vendedor">1. Vendedor (Rutas, Metas, Pendientes, Ventas)</option>
                    <option value="supervisor">2. Supervisor (Vendedores a cargo)</option>
                    <option value="gerente_cedis">3. Gerente de CEDIS</option>
                    <option value="director_comercial">4. Director Comercial (Todos los CEDIS)</option>
                    <option value="propietario">5. Modo Propietario (Owner / Master)</option>
                  </AppSelect>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Clave de Acceso (PIN)</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={newUser.accessKey}
                    onChange={(e) => setNewUser({ ...newUser, accessKey: e.target.value })}
                    placeholder="Ej. 7788"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">CEDIS Asignado</label>
                  <AppSelect
                    value={newUser.cedisId}
                    onChange={(e) => setNewUser({ ...newUser, cedisId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    {MASTER_CEDIS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </AppSelect>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("keys")}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="tap-effect px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Guardar y Activar Clave
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: AJUSTES DE LA APLICACIÓN */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-rose-600" />
                  Parámetros Globales de Operación
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tasa de Comisión Base Vendedores (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.defaultCommissionRate}
                      onChange={(e) => setSettings({ ...settings, defaultCommissionRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">Porcentaje sobre ventas netas</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Radio de Geocerca GPS (Metros)</label>
                    <input
                      type="number"
                      value={settings.geofenceRadiusMeters}
                      onChange={(e) => setSettings({ ...settings, geofenceRadiusMeters: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">Tolerancia para check-in automático</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Umbral Alerta Frío Congelador (°C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={settings.tempThresholdCold}
                      onChange={(e) => setSettings({ ...settings, tempThresholdCold: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">Alerta si sube de -18.0°C</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Razón Social y Marcas</label>
                    <input
                      type="text"
                      value={settings.companyBrand}
                      onChange={(e) => setSettings({ ...settings, companyBrand: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="tap-effect px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Guardar Ajustes Corporativos
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
