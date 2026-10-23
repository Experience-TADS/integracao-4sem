"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "@/app/componentes/SideBar";
import { api } from "@/app/lib/api";
import { useI18n } from "@/app/lib/i18n";

interface Recall {
  id: number;
  titulo: string;
  descricao: string;
  instrucoes?: string;
  dataPublicacao?: string;
  visualizado?: boolean;
  modelo?: string;
}

export default function RecallPage() {
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);
  const { t, lang } = useI18n();

  useEffect(() => { carregarRecalls(); }, []);

  async function carregarRecalls() {
    setLoading(true);
    try {
      const data = await (api as any).getRecalls?.();
      setRecalls(data ? (Array.isArray(data) ? data : data.content ?? []) : []);
    } catch { setRecalls([]); }
    finally { setLoading(false); }
  }

  function toggleExpansao(id: number) {
    setExpandido((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) setRecalls((r) => r.map((rc) => (rc.id === id ? { ...rc, visualizado: true } : rc)));
      return next;
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 px-5 md:px-12 py-8 md:ml-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={22} className="text-amber-500" />
              {t("Recalls")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{t("Avisos de recall relacionados ao seu veículo")}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              {t("Verificando recalls...")}
            </div>
          ) : recalls.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <p className="text-gray-700 dark:text-white font-medium">{t("Nenhum recall encontrado")}</p>
              <p className="text-gray-400 text-sm mt-1">{t("Seu veículo está em dia com os alertas da Toyota")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recalls.map((rc) => (
                <div key={rc.id} className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden ${!rc.visualizado ? "border-amber-300 dark:border-amber-700" : "border-gray-100 dark:border-gray-800"}`}>
                  <div onClick={() => toggleExpansao(rc.id)} className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className={!rc.visualizado ? "text-amber-500 mt-0.5 shrink-0" : "text-gray-400 mt-0.5 shrink-0"} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{rc.titulo}</p>
                        {rc.modelo && <p className="text-xs text-gray-400 mt-0.5">{lang === "en" ? "Model:" : "Modelo:"} {rc.modelo}</p>}
                        {rc.dataPublicacao && <p className="text-xs text-gray-400">{new Date(rc.dataPublicacao).toLocaleDateString("pt-BR")}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!rc.visualizado && <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">{t("Novo")}</span>}
                      {expandido === rc.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </div>
                  {expandido === rc.id && (
                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rc.descricao}</p>
                      {rc.instrucoes && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">{lang === "en" ? "Instructions" : "Instruções"}</p>
                          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{rc.instrucoes}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle size={14} />
                        {t("Visualizado")}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
