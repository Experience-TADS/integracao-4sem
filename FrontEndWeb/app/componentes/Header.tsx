"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Activity } from "lucide-react";
import { api } from "@/app/lib/api";
import { useI18n } from "@/app/lib/i18n";

export default function Header() {
  const [nome, setNome] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    const cached = localStorage.getItem("user");
    if (cached) setNome(cached.split("@")[0]);
    api.getMe()
      .then((data) => { if (data.nome) setNome(data.nome); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex items-start justify-between mb-6 sm:mb-8">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{t("Olá,")}</p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {nome || t("bem-vindo")} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">{t("Novidades Toyota")}</p>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => router.push("/Cliente/Diagnostico")}
          title={t("Diagnóstico do Veículo")}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:border-red-300 dark:hover:text-red-400 transition shadow-sm"
        >
          <Activity size={18} />
        </button>
        <button
          onClick={() => router.push("/Cliente/Notificacoes")}
          title={t("Notificações")}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:border-red-300 dark:hover:text-red-400 transition shadow-sm"
        >
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}
