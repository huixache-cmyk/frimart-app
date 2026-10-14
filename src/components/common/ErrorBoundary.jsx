import React from "react";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Sparkles
} from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Frimart OS App Crash:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    // Clear potentially corrupted transient session if needed and reload
    try {
      window.location.reload();
    } catch (e) {
      window.location.href = "/";
    }
  };

  handleResetApp = () => {
    try {
      localStorage.removeItem("frimart_active_target_store_id");
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/40">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Frimart OS • Recuperación</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight mb-2">
            Ocurrió un detalle al cargar la vista
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mb-6">
            La aplicación detectó una pausa inesperada. Puedes recargar la pantalla para reanudar tu ruta sin perder tus ventas.
          </p>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={this.handleReload}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reanudar Aplicación</span>
            </button>

            <button
              onClick={this.handleResetApp}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </button>
          </div>

          {this.state.error && (
            <details className="mt-8 text-left w-full max-w-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-500 overflow-hidden">
              <summary className="cursor-pointer text-slate-400 font-mono">Detalle técnico</summary>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] text-rose-300/80 overflow-x-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
