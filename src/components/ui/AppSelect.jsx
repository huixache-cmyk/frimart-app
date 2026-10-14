import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Check,
  X
} from "lucide-react";

/**
 * AppSelect — reemplazo directo de <select> nativo.
 * El selector nativo de Android/iOS usa la fuente del sistema y no respeta el
 * diseño de la app. Este componente acepta los mismos hijos <option> y la misma
 * firma onChange(e) con e.target.value (siempre string, como el nativo).
 */
function flattenOptions(children) {
  const out = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === React.Fragment || child.type === "optgroup") {
      out.push(...flattenOptions(child.props.children));
      return;
    }
    if (child.type === "option") {
      const raw = child.props.value ?? child.props.children;
      const label = React.Children.toArray(child.props.children).join("");
      out.push({ value: String(raw), label, disabled: !!child.props.disabled });
    }
  });
  return out;
}

export default function AppSelect({
  value,
  defaultValue,
  onChange,
  children,
  className = "",
  disabled = false,
  title,
  id,
  name
}) {
  const [open, setOpen] = useState(false);
  const [innerValue, setInnerValue] = useState(defaultValue);
  const options = flattenOptions(children);
  const current = String(value ?? innerValue ?? options[0]?.value ?? "");
  const selected = options.find((o) => o.value === current) || options[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const choose = (opt) => {
    if (opt.disabled) return;
    setOpen(false);
    if (value === undefined) setInnerValue(opt.value);
    onChange?.({ target: { value: opt.value, name }, currentTarget: { value: opt.value, name } });
  };

  return (
    <>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`${className} flex items-center justify-between gap-2 text-left cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end sm:justify-center animate-fade-in"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-md mx-auto bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl animate-sheet-up max-h-[70vh] flex flex-col font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
                <span className="w-10 h-1 rounded-full bg-slate-200 absolute left-1/2 -translate-x-1/2 -mt-1.5 sm:hidden" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {title || "Selecciona una opción"}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="overflow-y-auto py-1.5 px-2" role="listbox">
                {options.map((opt) => {
                  const isSel = opt.value === current;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSel}
                        disabled={opt.disabled}
                        onClick={() => choose(opt)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] leading-snug transition cursor-pointer disabled:opacity-40 ${
                          isSel ? "bg-emerald-50 text-emerald-900 font-semibold" : "text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSel && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
