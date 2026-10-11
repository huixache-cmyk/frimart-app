import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Delete, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Building2,
  BarChart3,
  Crown,
  ChevronRight,
  Info
} from "lucide-react";
import { ROLES } from "../../data/authRolesData";

export default function AuthLockScreen({ 
  users = [], 
  onLoginSuccess,
  currentSessionUser = null
}) {
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedQuickRole, setSelectedQuickRole] = useState(null);

  const handleKeyPress = (digit) => {
    if (pin.length >= 6) return;
    setErrorMsg("");
    const newPin = pin + digit;
    setPin(newPin);
    
    // Auto submit if 4 digits
    if (newPin.length === 4) {
      validatePin(newPin);
    }
  };

  const handleDelete = () => {
    setErrorMsg("");
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setErrorMsg("");
    setPin("");
  };

  const validatePin = (codeToTest) => {
    setIsVerifying(true);
    setTimeout(() => {
      const match = users.find((u) => u.accessKey === codeToTest && u.status === "active");
      if (match) {
        setIsVerifying(false);
        onLoginSuccess(match);
      } else {
        setIsVerifying(false);
        setErrorMsg("Clave de acceso incorrecta o usuario inactivo.");
        // Vibration if supported
        if (window.navigator?.vibrate) {
          try { window.navigator.vibrate([80, 50, 80]); } catch (e) {}
        }
      }
    }, 250);
  };

  const handleQuickLogin = (user) => {
    setPin(user.accessKey);
    setSelectedQuickRole(user.role);
    validatePin(user.accessKey);
  };

  // Preset demo accounts for fast access
  const demoAccounts = [
    { roleKey: "vendedor", label: "Vendedor (Ruta 04)", pin: "1234", icon: Truck, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { roleKey: "supervisor", label: "Supervisor de Zona", pin: "4321", icon: ShieldCheck, color: "text-sky-700 bg-sky-50 border-sky-200" },
    { roleKey: "gerente_cedis", label: "Gerente de CEDIS", pin: "5678", icon: Building2, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { roleKey: "director_comercial", label: "Director Comercial", pin: "7890", icon: BarChart3, color: "text-purple-700 bg-purple-50 border-purple-200" },
    { roleKey: "propietario", label: "Modo Propietario", pin: "9999", icon: Crown, color: "text-rose-700 bg-rose-50 border-rose-200" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none animate-fade-in relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Branding */}
      <div className="relative z-10 pt-4 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-emerald-400 mb-3 shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Acceso Seguro Frimart OS & La Huerta</span>
        </div>

        <div className="flex items-center justify-center gap-2.5 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-lg font-['Outfit']">
            FR
          </div>
          <h1 className="text-3xl font-extrabold font-['Outfit'] tracking-tight text-white">
            FRIMART <span className="text-emerald-400">OS</span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-xs font-medium">
          Ingresa tu clave de acceso o selecciona tu perfil asignado
        </p>
      </div>

      {/* Central PIN Display & Status */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        {/* PIN Digit Indicators */}
        <div className="flex items-center justify-center gap-3.5 mb-4">
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                  hasDigit
                    ? "bg-emerald-400 border-emerald-400 scale-110 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                    : "bg-slate-800/80 border-slate-600"
                }`}
              />
            );
          })}
        </div>

        {/* Error or verifying feedback */}
        <div className="h-6 flex items-center justify-center">
          {errorMsg ? (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold animate-shake">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          ) : isVerifying ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Validando clave de acceso...</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">Clave de 4 dígitos</span>
          )}
        </div>

        {/* Numeric Keypad (4x3) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[280px] mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(String(num))}
              className="tap-effect h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/80 active:bg-slate-600 border border-slate-700/70 text-xl font-bold font-['Outfit'] text-white shadow-md flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="tap-effect h-14 rounded-2xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-xs font-bold text-slate-400 flex items-center justify-center transition cursor-pointer"
          >
            Limpiar
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="tap-effect h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/80 active:bg-slate-600 border border-slate-700/70 text-xl font-bold font-['Outfit'] text-white shadow-md flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="tap-effect h-14 rounded-2xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Borrar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom: Fast Demo Switcher / Role Shortcuts */}
      <div className="relative z-10 pt-2 pb-2">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 max-w-md mx-auto backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              Acceso Rápido por Rol
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1-Tap Demo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {demoAccounts.map((acc) => {
              const userObj = users.find((u) => u.role === acc.roleKey);
              if (!userObj) return null;
              const IconComp = acc.icon;

              return (
                <button
                  key={acc.roleKey}
                  onClick={() => handleQuickLogin(userObj)}
                  className="tap-effect p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-left transition flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-700/50">
                    <IconComp className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-white truncate leading-tight">
                      {ROLES[acc.roleKey]?.shortName}
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">
                      PIN: {acc.pin}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
