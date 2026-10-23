"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import Sidebar from "@/app/componentes/SideBar";
import { api } from "@/app/lib/api";
import { useI18n } from "@/app/lib/i18n";

interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
}

function formatarData(data: string) {
  try {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return data; }
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useI18n();

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  async function carregarNotificacoes() {
    setLoading(true);
    try {
      const data = await (api as any).getNotificacoes?.();
      setNotificacoes(data ? (Array.isArray(data) ? data : data.content ?? []) : []);
    } catch { setNotificacoes([]); }
    finally { setLoading(false); }
  }

  async function marcarLida(id: number) {
    try { await (api as any).marcarNotificacaoLida?.(id); } catch {}
    setNotificacoes((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  function marcarTodasLidas() {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 px-5 md:px-12 py-8 md:ml-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell size={22} className="text-red-600" />
                {t("Notificações")}
                {naoLidas > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{naoLidas}</span>
                )}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {naoLidas === 0
                  ? t("Tudo em dia")
                  : `${naoLidas} ${lang === "en" ? (naoLidas > 1 ? "unread" : "unread") : (naoLidas > 1 ? "não lidas" : "não lida")}`}
              </p>
            </div>
            {naoLidas > 0 && (
              <button onClick={marcarTodasLidas} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition">
                <CheckCheck size={16} />
                {t("Marcar todas como lidas")}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={20} /> {t("Carregando...")}
            </div>
          ) : notificacoes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Bell size={28} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium">{t("Nenhuma notificação")}</p>
              <p className="text-gray-400 text-sm mt-1">{t("Você será avisado sobre atualizações do seu veículo")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notificacoes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.lida && marcarLida(n.id)}
                  className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 transition cursor-pointer ${!n.lida ? "border-red-200 dark:border-red-900/50 shadow-sm" : "border-gray-100 dark:border-gray-800 opacity-70"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${!n.lida ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600"}`} />
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${!n.lida ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>{n.titulo}</p>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.mensagem}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatarData(n.criadaEm)}</p>
                    </div>
                    {!n.lida && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium shrink-0">
                        {t("Nova")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
