"use client";

import { useEffect, useState } from "react";
import { Search, Car, Loader2, Package } from "lucide-react";
import VendedorSidebar from "@/app/Vendedor/componentes/VendedorSidebar";
import { api, type VeiculoResponse } from "@/app/lib/api";

function statusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "DISPONIVEL":
    case "DISPONÍVEL":
      return { label: "Disponível", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    case "RESERVADO":
      return { label: "Reservado", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
    case "VENDIDO":
      return { label: "Vendido", cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" };
    case "EM_PRODUCAO":
    case "MONTAGEM_ESTRUTURAL":
    case "PINTURA":
    case "INSTALACAO_MOTOR":
    case "ACABAMENTO_INTERNO":
      return { label: "Em produção", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "INSPECAO_FINAL":
      return { label: "Inspeção", cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
    case "LIBERACAO_TRANSPORTE":
      return { label: "Em transporte", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" };
    default:
      return { label: status || "—", cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" };
  }
}

export default function Estoque() {
  const [veiculos, setVeiculos] = useState<VeiculoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    carregarEstoque();
  }, []);

  async function carregarEstoque() {
    setLoading(true);
    setErro("");
    try {
      const data = await api.getVeiculos(0, 100);
      setVeiculos(data.content);
    } catch {
      setErro("Não foi possível carregar o estoque.");
    } finally {
      setLoading(false);
    }
  }

  const filtrados = veiculos.filter((v) => {
    const t = busca.toLowerCase();
    const matchBusca =
      !busca ||
      v.produto?.modelo?.toLowerCase().includes(t) ||
      v.produto?.cor?.toLowerCase().includes(t) ||
      String(v.chassi).includes(t);
    const matchStatus =
      filtroStatus === "todos" ||
      v.statusVeiculo?.toUpperCase() === filtroStatus.toUpperCase();
    return matchBusca && matchStatus;
  });

  const statusOptions = [
    "todos",
    "DISPONIVEL",
    "RESERVADO",
    "EM_PRODUCAO",
    "LIBERACAO_TRANSPORTE",
    "VENDIDO",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <VendedorSidebar />
      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package size={22} className="text-red-600" />
              Estoque
            </h1>
            <p className="text-gray-500 mt-1">
              {loading ? "Carregando..." : `${filtrados.length} veículo(s)`}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${erro ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
            <div className={`w-2 h-2 rounded-full ${erro ? "bg-red-500" : "bg-green-500"}`} />
            {erro ? "Sem conexão" : "Conectado"}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por modelo, cor ou chassi..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((s) => {
              const label =
                s === "todos"
                  ? "Todos"
                  : s === "DISPONIVEL"
                  ? "Disponível"
                  : s === "RESERVADO"
                  ? "Reservado"
                  : s === "EM_PRODUCAO"
                  ? "Produção"
                  : s === "LIBERACAO_TRANSPORTE"
                  ? "Transporte"
                  : "Vendido";
              return (
                <button
                  key={s}
                  onClick={() => setFiltroStatus(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                    filtroStatus === s
                      ? "bg-red-600 text-white"
                      : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
              <Loader2 className="animate-spin" size={20} /> Carregando estoque...
            </div>
          ) : erro ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-3">{erro}</p>
              <button onClick={carregarEstoque} className="text-sm text-red-600 underline">
                Tentar novamente
              </button>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Car size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              Nenhum veículo encontrado.
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-6 px-6 py-3 text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 font-medium uppercase tracking-wide">
                <span>Chassi</span>
                <span>Modelo</span>
                <span>Cor</span>
                <span>Versão</span>
                <span>Ano</span>
                <span>Status</span>
              </div>
              {filtrados.map((v) => {
                const badge = statusBadge(v.statusVeiculo);
                return (
                  <div
                    key={v.id}
                    className="grid grid-cols-2 md:grid-cols-6 px-6 py-4 items-center border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition gap-y-1"
                  >
                    <span className="text-xs text-gray-400 font-mono">#{v.chassi}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {v.produto?.modelo ?? "—"}
                    </span>
                    <span className="text-gray-500">{v.produto?.cor ?? "—"}</span>
                    <span className="text-gray-500 text-sm">{v.produto?.versao ?? "—"}</span>
                    <span className="text-gray-500">{v.produto?.ano ?? "—"}</span>
                    <span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
