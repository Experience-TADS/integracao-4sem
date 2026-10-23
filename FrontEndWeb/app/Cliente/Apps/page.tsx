"use client";

import Sidebar from "@/app/componentes/SideBar";
import { Smartphone, ExternalLink } from "lucide-react";
import { useI18n } from "@/app/lib/i18n";

const toyotaApps = [
  { name: "Toyota App", descPT: "Aplicativo oficial da Toyota para acompanhar informações do veículo, agendar serviços, acessar manuais digitais e receber notificações importantes.", descEN: "Toyota's official app to track vehicle info, schedule services, access digital manuals and receive important notifications.", url: "https://www.toyota.com.br/servicos/toyota-app", icon: "📱" },
  { name: "Toyota Play", descPT: "Central multimídia com acesso a conteúdos exclusivos, conectividade com apps e integração com seu veículo Toyota.", descEN: "Multimedia hub with exclusive content, app connectivity and integration with your Toyota vehicle.", url: "https://www.toyota.com.br/inovacao/toyota-play", icon: "🎬" },
  { name: "Toyota Mobility", descPT: "Gerencie veículos conectados, acompanhe diagnósticos em tempo real e utilize serviços inteligentes de mobilidade.", descEN: "Manage connected vehicles, track real-time diagnostics and use smart mobility services.", url: "https://www.toyota.com.br/inovacao/mobilidade", icon: "🚗" },
  { name: "KINTO Share", descPT: "Serviço de compartilhamento de carros da Toyota. Alugue veículos por horas ou dias com praticidade e segurança.", descEN: "Toyota's car-sharing service. Rent vehicles by the hour or day with convenience and safety.", url: "https://www.kintomobility.com.br/", icon: "🔑" },
  { name: "Toyota Gazoo Racing", descPT: "Acompanhe o mundo das corridas, eventos automobilísticos e novidades esportivas da Toyota Gazoo Racing.", descEN: "Follow the world of motorsport, automotive events and sports news from Toyota Gazoo Racing.", url: "https://www.toyota.com.br/mundo-toyota/gazoo-racing", icon: "🏁" },
  { name: "Toyota Financial", descPT: "Acesse seus financiamentos, consulte parcelas, contratos e serviços financeiros diretamente pelo app oficial.", descEN: "Access your financing, check installments, contracts and financial services through the official app.", url: "https://www.toyotafinancial.com.br/", icon: "💳" },
];

export default function Apps() {
  const { lang, t } = useI18n();

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 md:ml-20 flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-10 pb-10">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("Apps Toyota")}</h1>
            <p className="text-sm text-gray-500">{t("Explore os aplicativos oficiais da Toyota")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {toyotaApps.map((app) => (
              <div
                key={app.name}
                onClick={() => window.open(app.url, "_blank")}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow hover:shadow-md transition cursor-pointer flex flex-col justify-between min-h-[150px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-lg text-lg">
                    {app.icon}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{app.name}</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {lang === "en" ? app.descEN : app.descPT}
                </p>
                <div className="flex justify-end mt-3">
                  <ExternalLink className="text-gray-400" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center pb-6 text-gray-400 text-xs flex items-center justify-center gap-2">
          <Smartphone size={14} />
          {t("Disponível na Play Store e App Store")}
        </div>
      </div>
    </div>
  );
}
