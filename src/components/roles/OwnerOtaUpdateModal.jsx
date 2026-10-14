import React, { useState } from "react";
import {
  Radio,
  Send,
  RefreshCw,
  Sliders,
  X,
  Play,
  Zap,
  Cpu
} from "lucide-react";
import AppSelect from "../ui/AppSelect";

export default function OwnerOtaUpdateModal({
  isOpen,
  onClose,
  otaConfig,
  onDeployUpdate,
  onToggleSandboxPreview
}) {
  const [candidateVersion, setCandidateVersion] = useState(otaConfig?.candidateUpdate?.version || "v2.5.0");
  const [releaseTitle, setReleaseTitle] = useState(otaConfig?.candidateUpdate?.releaseName || "Frimart OS • Sprint Cierre 2026 & Módulo Gobernanza");
  const [description, setDescription] = useState(otaConfig?.candidateUpdate?.description || "Actualización integral con 5 roles por clave de acceso y telemetría de congeladores La Huerta.");
  const [targetAudience, setTargetAudience] = useState(otaConfig?.candidateUpdate?.targetAudience || "all");
  
  // Feature flags
  const [flags, setFlags] = useState(otaConfig?.candidateUpdate?.featureFlags || {
    enableStrictGeofencing: true,
    enableOfflineSyncTurbo: true,
    enableThermalAlertsPush: true,
    enableVoiceAssistantRoutes: false,
    enableLiveCameraQRScanner: true
  });

  // Deployment simulation states
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0); // 0: idle, 1: compiling, 2: uploading to cdn, 3: pushing to fleet, 4: done
  const [deployProgress, setDeployProgress] = useState(0);

  if (!isOpen) return null;

  const handleToggleFlag = (key) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartDeploy = () => {
    setIsDeploying(true);
    setDeployStep(1);
    setDeployProgress(20);

    setTimeout(() => {
      setDeployStep(2);
      setDeployProgress(55);
    }, 1000);

    setTimeout(() => {
      setDeployStep(3);
      setDeployProgress(85);
    }, 2200);

    setTimeout(() => {
      setDeployStep(4);
      setDeployProgress(100);

      const releaseRecord = {
        id: `DEP-${Date.now()}`,
        version: candidateVersion,
        deployedAt: new Date().toLocaleDateString("es-MX") + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        deployedBy: "Director General & Propietario Frimart",
        status: "success",
        devicesCount: otaConfig?.activeFleetDevices || 52,
        appliedCount: otaConfig?.activeFleetDevices || 52,
        notes: releaseTitle,
        featureFlags: flags
      };

      onDeployUpdate({
        ...otaConfig,
        currentVersion: candidateVersion,
        synchronizedDevices: otaConfig?.activeFleetDevices || 52,
        pendingDevices: 0,
        deploymentHistory: [releaseRecord, ...(otaConfig?.deploymentHistory || [])]
      });

      // Notify broadcast event
      localStorage.setItem("frimart_broadcast_update", JSON.stringify({
        version: candidateVersion,
        title: releaseTitle,
        timestamp: Date.now()
      }));

      setTimeout(() => {
        setIsDeploying(false);
        setDeployStep(0);
        onClose();
      }, 1500);
    }, 3600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white sm:rounded-[32px] rounded-t-[28px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-sheet-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Outfit'] tracking-tight flex items-center gap-2">
                Centro de Ajustes & Despliegue OTA
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                Prueba de cambios y liberación remota a todos los dispositivos Frimart
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeploying}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Active Fleet Status */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
                Flota Móvil Conectada
              </span>
              <span className="text-xl font-bold font-['Outfit']">
                {otaConfig?.activeFleetDevices || 52} Dispositivos Activos
              </span>
              <span className="text-[11px] text-emerald-50/80 block mt-0.5">
                Versión actual instalada: <strong className="text-white font-mono">{otaConfig?.currentVersion || "v2.4.2"}</strong>
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                <Radio className="w-3 h-3 animate-pulse" />
                Telemetría OTA Lista
              </span>
            </div>
          </div>

          {/* Formulario de Nueva Versión y Ajustes */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Configurar Actualización Candidata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Versión a Lanzar</label>
                <input
                  type="text"
                  value={candidateVersion}
                  onChange={(e) => setCandidateVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destinatarios</label>
                <AppSelect
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="all">Toda la Flota (Todos los roles)</option>
                  <option value="vendedores">Solo Vendedores de Ruta</option>
                  <option value="supervisores">Solo Supervisores de Zona</option>
                  <option value="cedis">Solo Gerentes de CEDIS</option>
                </AppSelect>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Título del Release</label>
                <input
                  type="text"
                  value={releaseTitle}
                  onChange={(e) => setReleaseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Descripción y Notas del Release</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Feature Flags / Banderas de Funcionalidad */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Ajustes de Funcionalidad (Feature Flags)
            </h3>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Sincronización Offline Turbo</span>
                  <span className="text-[10px] text-slate-500">Permite guardar notas de venta y auditorías sin señal 4G</span>
                </div>
                <input
                  type="checkbox"
                  checked={flags.enableOfflineSyncTurbo}
                  onChange={() => handleToggleFlag("enableOfflineSyncTurbo")}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Geocerca Estricta (Tolerancia 60m)</span>
                  <span className="text-[10px] text-slate-500">Solo permite check-in si el vendedor está junto al congelador</span>
                </div>
                <input
                  type="checkbox"
                  checked={flags.enableStrictGeofencing}
                  onChange={() => handleToggleFlag("enableStrictGeofencing")}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Alertas Térmicas Push en Tiempo Real</span>
                  <span className="text-[10px] text-slate-500">Notificar si un congelador La Huerta supera -18°C</span>
                </div>
                <input
                  type="checkbox"
                  checked={flags.enableThermalAlertsPush}
                  onChange={() => handleToggleFlag("enableThermalAlertsPush")}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Sandbox Test Button */}
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-sky-900 block">Modo Sandbox / Entorno de Pruebas</span>
              <span className="text-[10px] text-sky-700">Previsualiza los cambios en tu app antes de mandarla a los vendedores</span>
            </div>
            <button
              type="button"
              onClick={() => {
                alert("✓ Entorno de pruebas activado: Puedes navegar la aplicación con los nuevos ajustes antes de enviarla.");
              }}
              className="tap-effect px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer text-xs flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5" />
              Probar Aquí
            </button>
          </div>

          {/* Deployment Animation / Progress */}
          {isDeploying && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  {deployStep === 1 && "1/3 Compilando paquete de actualización..."}
                  {deployStep === 2 && "2/3 Subiendo a Servidores Frimart Cloud CDN..."}
                  {deployStep === 3 && `3/3 Enviando OTA Push a ${otaConfig?.activeFleetDevices || 52} dispositivos...`}
                  {deployStep === 4 && "¡Actualización desplegada con éxito!"}
                </span>
                <span className="font-mono font-bold text-emerald-300">{deployProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${deployProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Big Action Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeploying}
            className="px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={handleStartDeploy}
            disabled={isDeploying}
            className="tap-effect flex-1 max-w-xs py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Mandar Actualización a Todos los Dispositivos
          </button>
        </div>
      </div>
    </div>
  );
}
