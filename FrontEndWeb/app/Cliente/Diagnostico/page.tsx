"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "@/app/componentes/SideBar";
import { api } from "@/app/lib/api";

interface CodigoDTC {
  id?: number;
  codigo: string;
  descricao: string;
  severidade?: "alta" | "media" | "baixa" | string;
  sistema?: string;
}

function severidadeBadge(severidade?: string) {
  switch (severidade?.toLowerCase()) {
    case "alta":
      return { cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "Alta" };
    case "media":
    case "média":
      return { cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Média" };
    default:
      return { cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "Baixa" };
  }
}

export default function Diagnostico() {
  const [codigos, setCodigos] = useState<CodigoDTC[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    carregarDTC();
  }, []);

  async function carregarDTC() {
    setLoading(true);
    try {
      const data = await (api as any).getDTC?.();
      if (data) {
        setCodigos(Array.isArray(data) ? data : data.content ?? []);
      }
    } catch {
      setCodigos([]);
    } finally {
      setLoading(false);
    }
  }

  const temProblema = codigos.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 px-5 md:px-12 py-8 md:ml-20">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={22} className="text-red-600" />
              Diagnóstico do Veículo
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Códigos DTC e status do seu veículo
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              Verificando diagnóstico...
            </div>
          ) : (
            <>
              <div className={`rounded-2xl border p-5 mb-6 flex items-center gap-4 ${
                temProblema
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              }`}>
                {temProblema ? (
                  <AlertCircle size={28} className="text-red-500 shrink-0" />
                ) : (
                  <CheckCircle size={28} className="text-green-500 shrink-0" />
                )}
                <div>
                  <p className={`font-semibold ${temProblema ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"}`}>
                    {temProblema
                      ? `${codigos.length} código(s) DTC detectado(s)`
                      : "Nenhum problema detectado"}
                  </p>
                  <p className={`text-sm mt-0.5 ${temProblema ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                    {temProblema
                      ? "Leve seu veículo a uma concessionária Toyota"
                      : "Seu veículo está funcionando normalmente"}
                  </p>
                </div>
              </div>

              {codigos.length > 0 && (
                <div className="space-y-3">
                  {codigos.map((dtc, i) => {
                    const key = dtc.codigo || String(i);
                    const badge = severidadeBadge(dtc.severidade);
                    return (
                      <div
                        key={key}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                      >
                        <div
                          onClick={() => setExpandido(expandido === key ? null : key)}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-red-600 text-sm bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-lg">
                              {dtc.codigo}
                            </span>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {dtc.descricao}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                              {badge.label}
                            </span>
                            {expandido === key ? (
                              <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        {expandido === key && dtc.sistema && (
                          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sistema afetado</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{dtc.sistema}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
