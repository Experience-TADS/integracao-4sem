"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Check, X, Loader2, Search } from "lucide-react";
import VendedorSidebar from "@/app/Vendedor/componentes/VendedorSidebar";
import { api, getToken } from "@/app/lib/api";
import { useToast } from "@/app/lib/toast";

interface Documento {
  id: number;
  nome: string;
  tipo?: string;
  status?: string;
  dataEnvio?: string;
  url?: string;
  nomeCliente?: string;
  emailCliente?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export default function DocumentosColaborador() {
  const { showToast } = useToast();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [processando, setProcessando] = useState<number | null>(null);
  const [baixando, setBaixando] = useState<number | null>(null);

  useEffect(() => {
    carregarDocumentos();
  }, []);

  async function carregarDocumentos() {
    setLoading(true);
    try {
      const data = await (api as any).getDocumentosColaborador?.();
      if (data) {
        setDocumentos(Array.isArray(data) ? data : data.content ?? []);
      } else {
        setDocumentos([]);
      }
    } catch {
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  }

  const filtrados = documentos.filter((d) => {
    const t = busca.toLowerCase();
    return (
      !busca ||
      d.nome?.toLowerCase().includes(t) ||
      d.nomeCliente?.toLowerCase().includes(t) ||
      d.tipo?.toLowerCase().includes(t)
    );
  });

  async function aprovar(id: number) {
    setProcessando(id);
    try {
      await (api as any).aprovarDocumento?.(id);
      setDocumentos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "APROVADO" } : d))
      );
      showToast("Documento aprovado com sucesso.", "success");
    } catch {
      showToast("Erro ao aprovar documento.", "error");
    } finally {
      setProcessando(null);
    }
  }

  async function reprovar(id: number) {
    setProcessando(id);
    try {
      await (api as any).reprovarDocumento?.(id);
      setDocumentos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "REPROVADO" } : d))
      );
      showToast("Documento reprovado.", "info");
    } catch {
      showToast("Erro ao reprovar documento.", "error");
    } finally {
      setProcessando(null);
    }
  }

  async function baixar(doc: Documento) {
    setBaixando(doc.id);
    try {
      const token = getToken();
      const url = doc.url || `${API_BASE_URL}/api/documento/${doc.id}/download`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = doc.nome || `documento_${doc.id}`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      showToast("Não foi possível baixar o documento.", "error");
    } finally {
      setBaixando(null);
    }
  }

  function statusBadge(status?: string) {
    switch (status?.toUpperCase()) {
      case "APROVADO":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "REPROVADO":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <VendedorSidebar />
      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={22} className="text-red-600" />
              Documentos
            </h1>
            <p className="text-gray-500 mt-1">Gerencie os documentos dos clientes</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Conectado
          </div>
        </div>

        <div className="relative max-w-lg mb-6">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, cliente ou tipo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
              <Loader2 className="animate-spin" size={20} /> Carregando...
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <p className="text-gray-400">Nenhum documento encontrado.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-5 px-6 py-3 text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 font-medium uppercase tracking-wide">
                <span className="col-span-2">Documento</span>
                <span>Cliente</span>
                <span>Status</span>
                <span className="text-right">Ações</span>
              </div>
              {filtrados.map((doc) => (
                <div
                  key={doc.id}
                  className="grid grid-cols-1 md:grid-cols-5 px-6 py-4 items-center border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition gap-y-2"
                >
                  <div className="md:col-span-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{doc.nome}</p>
                      <div className="flex items-center gap-2">
                        {doc.tipo && <p className="text-xs text-gray-400">{doc.tipo}</p>}
                        {doc.dataEnvio && (
                          <p className="text-xs text-gray-400">
                            {new Date(doc.dataEnvio).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {doc.nomeCliente || "—"}
                    {doc.emailCliente && (
                      <p className="text-xs text-gray-400">{doc.emailCliente}</p>
                    )}
                  </div>

                  <div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge(doc.status)}`}>
                      {doc.status || "Pendente"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 md:justify-end flex-wrap">
                    <button
                      onClick={() => baixar(doc)}
                      disabled={baixando === doc.id}
                      className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                      {baixando === doc.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Download size={12} />
                      )}
                      Baixar
                    </button>
                    {doc.status?.toUpperCase() !== "APROVADO" && (
                      <button
                        onClick={() => aprovar(doc.id)}
                        disabled={processando === doc.id}
                        className="flex items-center gap-1 text-xs text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1.5 rounded-lg transition hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50"
                      >
                        {processando === doc.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={12} />
                        )}
                        Aprovar
                      </button>
                    )}
                    {doc.status?.toUpperCase() !== "REPROVADO" && (
                      <button
                        onClick={() => reprovar(doc.id)}
                        disabled={processando === doc.id}
                        className="flex items-center gap-1 text-xs text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1.5 rounded-lg transition hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50"
                      >
                        <X size={12} />
                        Reprovar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
