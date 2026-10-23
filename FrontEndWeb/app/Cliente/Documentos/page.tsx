"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Loader2, Eye } from "lucide-react";
import Sidebar from "@/app/componentes/SideBar";
import { api, getToken } from "@/app/lib/api";

interface Documento {
  id: number;
  nome: string;
  tipo?: string;
  status?: string;
  dataEnvio?: string;
  url?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export default function Documentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [baixando, setBaixando] = useState<number | null>(null);

  useEffect(() => {
    carregarDocumentos();
  }, []);

  async function carregarDocumentos() {
    setLoading(true);
    try {
      const data = await (api as any).getDocumentos?.();
      if (data) {
        setDocumentos(Array.isArray(data) ? data : data.content ?? []);
      }
    } catch {
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  }

  async function baixarDocumento(doc: Documento) {
    setBaixando(doc.id);
    try {
      const token = getToken();
      const url = doc.url || `${API_BASE_URL}/api/documento/${doc.id}/download`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Falha no download");

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = doc.nome || `documento_${doc.id}`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      alert("Não foi possível baixar o documento.");
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
      <Sidebar />
      <div className="flex-1 px-5 md:px-12 py-8 md:ml-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={22} className="text-red-600" />
              Meus Documentos
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Documentos relacionados ao seu veículo
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              Carregando documentos...
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FileText size={28} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium">Nenhum documento disponível</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow overflow-hidden">
              <div className="grid grid-cols-4 px-6 py-3 text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 font-medium uppercase tracking-wide">
                <span className="col-span-2">Documento</span>
                <span>Status</span>
                <span className="text-right">Ação</span>
              </div>
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="grid grid-cols-4 px-6 py-4 items-center border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
                          {doc.nome}
                        </p>
                        {doc.tipo && (
                          <p className="text-xs text-gray-400">{doc.tipo}</p>
                        )}
                        {doc.dataEnvio && (
                          <p className="text-xs text-gray-400">
                            {new Date(doc.dataEnvio).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {doc.status && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge(doc.status)}`}>
                        {doc.status}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => baixarDocumento(doc)}
                      disabled={baixando === doc.id}
                      className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition disabled:opacity-50"
                    >
                      {baixando === doc.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Download size={15} />
                      )}
                      Baixar
                    </button>
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
