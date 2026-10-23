"use client";

import { useState } from "react";
import { MapPin, Phone, ChevronRight, Store } from "lucide-react";
import Sidebar from "@/app/componentes/SideBar";
import { useI18n } from "@/app/lib/i18n";

type Concessionaria = {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  telefone: string;
  mapEmbed: string;
  mapRoute: string;
};

const concessionarias: Concessionaria[] = [
  {
    id: 1,
    nome: "Ramires Motors Toyota",
    endereco: "Av. São Paulo, 1000 – Além Ponte",
    cidade: "Sorocaba – SP",
    telefone: "(15) 3212-9000",
    mapEmbed: "https://www.google.com/maps?q=Ramires+Motors+Toyota+Sorocaba&output=embed",
    mapRoute: "https://www.google.com/maps/dir/?api=1&destination=Ramires+Motors+Toyota+Sorocaba",
  },
  {
    id: 2,
    nome: "Toyota Central São Paulo",
    endereco: "Av. Paulista, 2000 – Bela Vista",
    cidade: "São Paulo – SP",
    telefone: "(11) 3456-7890",
    mapEmbed: "https://www.google.com/maps?q=Toyota+Central+Av+Paulista+Sao+Paulo&output=embed",
    mapRoute: "https://www.google.com/maps/dir/?api=1&destination=Toyota+Central+Av+Paulista+Sao+Paulo",
  },
  {
    id: 3,
    nome: "Toyota Campinas",
    endereco: "Rod. Dom Pedro I, 3500 – Jardim Santa Genebra",
    cidade: "Campinas – SP",
    telefone: "(19) 3355-6677",
    mapEmbed: "https://www.google.com/maps?q=Toyota+Campinas+Rod+Dom+Pedro+I&output=embed",
    mapRoute: "https://www.google.com/maps/dir/?api=1&destination=Toyota+Campinas+Rod+Dom+Pedro+I",
  },
  {
    id: 4,
    nome: "Toyota Santo André",
    endereco: "Av. Industrial, 800 – Vila Luzita",
    cidade: "Santo André – SP",
    telefone: "(11) 4455-3300",
    mapEmbed: "https://www.google.com/maps?q=Toyota+Santo+Andre+Av+Industrial&output=embed",
    mapRoute: "https://www.google.com/maps/dir/?api=1&destination=Toyota+Santo+Andre+Av+Industrial",
  },
];

export default function Loja() {
  const [selecionada, setSelecionada] = useState<Concessionaria>(concessionarias[0]);
  const [busca, setBusca] = useState("");
  const { t } = useI18n();

  const filtradas = concessionarias.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.cidade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 px-5 md:px-12 py-8 md:ml-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("Concessionária")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t("Encontre a unidade mais próxima de você")}</p>
          </div>

          <div className="relative mb-6">
            <Store className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t("Buscar por nome ou cidade...")}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-3">
              {filtradas.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">{t("Nenhuma encontrada.")}</p>
              ) : (
                filtradas.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelecionada(c)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selecionada.id === c.id
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold text-sm ${selecionada.id === c.id ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                          {c.nome}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.cidade}</p>
                      </div>
                      <ChevronRight size={16} className={selecionada.id === c.id ? "text-red-500" : "text-gray-300"} />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selecionada.nome}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t("Concessionária oficial Toyota")}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="w-5 h-5 mt-0.5 text-red-500 shrink-0" />
                      <div>
                        <p>{selecionada.endereco}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{selecionada.cidade}, Brasil</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
                    <Phone className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="font-medium">{selecionada.telefone}</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-sm mb-6">
                    <iframe key={selecionada.id} src={selecionada.mapEmbed} className="w-full h-56 border-0" loading="lazy" />
                  </div>
                  <a
                    href={selecionada.mapRoute}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-red-600 text-white py-3.5 rounded-xl text-center font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-md"
                  >
                    <MapPin size={18} />
                    {t("Como chegar")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
