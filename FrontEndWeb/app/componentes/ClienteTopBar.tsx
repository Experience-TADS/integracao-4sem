"use client";

import { useRouter } from "next/navigation";
import { Bell, Activity } from "lucide-react";

interface Props {
  titulo: string;
  subtitulo?: string;
  direita?: React.ReactNode;
}

export default function ClienteTopBar({ titulo, subtitulo, direita }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{titulo}</h1>
        {subtitulo && <p className="text-sm text-gray-500 mt-0.5">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-2">
        {direita}
        <button
          onClick={() => router.push("/Cliente/Diagnostico")}
          title="Diagnóstico do veículo"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:border-red-300 transition shadow-sm"
        >
          <Activity size={18} />
        </button>
        <button
          onClick={() => router.push("/Cliente/Notificacoes")}
          title="Notificações"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:border-red-300 transition shadow-sm"
        >
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}
