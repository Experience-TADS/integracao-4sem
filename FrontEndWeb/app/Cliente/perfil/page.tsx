"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, LogOut, Moon, Sun, Star, Globe } from "lucide-react";
import Sidebar from "@/app/componentes/SideBar";
import { api, removeToken } from "@/app/lib/api";
import { getTheme, toggleTheme } from "@/app/lib/theme";
import { useI18n } from "@/app/lib/i18n";

const NIVEIS = [
  { min: 0, max: 1, label: "Iniciante", cor: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800" },
  { min: 1, max: 3, label: "Bronze", cor: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  { min: 3, max: 6, label: "Prata", cor: "text-gray-500", bg: "bg-gray-200 dark:bg-gray-700" },
  { min: 6, max: 99, label: "Ouro", cor: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
];

function getNivel(qtdPedidos: number) {
  return NIVEIS.find((n) => qtdPedidos >= n.min && qtdPedidos < n.max) ?? NIVEIS[0];
}

export default function Perfil() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("—");
  const [isDark, setIsDark] = useState(false);
  const [qtdPedidos, setQtdPedidos] = useState(0);

  const [prefs, setPrefs] = useState({
    emailNotif: false,
    smsNotif: true,
    promo: false,
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/Login");
      return;
    }
    setEmail(user);
    setIsDark(getTheme() === "dark");

    const savedPrefs = localStorage.getItem("prefs");
    if (savedPrefs) setPrefs(JSON.parse(savedPrefs));

    api.getMe()
      .then((data) => {
        if (data.nome) setNome(data.nome);
        if (data.email) setEmail(data.email);
      })
      .catch(() => {});

    api.getMeusPedidos()
      .then((pedidos) => setQtdPedidos(pedidos.length))
      .catch(() => {});
  }, [router]);

  function updatePref(key: string) {
    const updated = { ...prefs, [key]: !prefs[key as keyof typeof prefs] };
    setPrefs(updated);
    localStorage.setItem("prefs", JSON.stringify(updated));
  }

  function handleToggleTheme() {
    const next = toggleTheme();
    setIsDark(next === "dark");
  }

  function sair() {
    removeToken();
    router.push("/Login");
  }

  function Switch({ active }: { active: boolean }) {
    return (
      <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${active ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600"}`}>
        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${active ? "translate-x-6" : ""}`} />
      </div>
    );
  }

  const nivel = getNivel(qtdPedidos);
  const { lang, setLang, t } = useI18n();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 px-5 md:px-12 py-8 md:ml-20">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("Perfil")}</h1>
            <p className="text-gray-500 text-sm mt-1">{t("Seus dados pessoais e preferências")}</p>
          </div>

          <div className="flex flex-col items-center mb-8 gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full shadow-md">
              <User className="text-red-600 w-10 h-10" />
            </div>
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${nivel.bg} ${nivel.cor}`}>
              <Star size={14} />
              {t("Nível")} {t(nivel.label)}
            </div>
            <p className="text-xs text-gray-400">{qtdPedidos} {t("pedido(s) realizados")}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
            {[
              { icon: <User className="text-gray-500 w-5 h-5" />, label: t("Nome"), value: nome },
              { icon: <Mail className="text-gray-500 w-5 h-5" />, label: t("Email"), value: email },
              { icon: <Phone className="text-gray-500 w-5 h-5" />, label: t("Telefone"), value: "—" },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex items-center gap-4 p-5 ${i < arr.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("Preferências")}</h2>
            <p className="text-sm text-gray-500">{t("Controle como você recebe notificações")}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-4">
            {[
              { key: "emailNotif", label: t("Notificações por Email"), desc: t("Receber atualizações por email") },
              { key: "smsNotif", label: t("Notificações por SMS"), desc: t("Alertas diretos no celular") },
              { key: "promo", label: t("Emails Promocionais"), desc: t("Ofertas e novidades") },
            ].map((item, i, arr) => (
              <div
                key={item.key}
                onClick={() => updatePref(item.key)}
                className={`flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${i < arr.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <Switch active={prefs[item.key as keyof typeof prefs]} />
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
            <div
              onClick={handleToggleTheme}
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition border-b border-gray-100 dark:border-gray-800"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t("Tema escuro")}</p>
                <p className="text-xs text-gray-400">{t("Alternar entre modo claro e escuro")}</p>
              </div>
              <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${isDark ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                <div className={`flex items-center justify-center bg-white w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${isDark ? "translate-x-6" : ""}`}>
                  {isDark ? <Moon size={10} className="text-gray-700" /> : <Sun size={10} className="text-yellow-500" />}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {lang === "pt" ? "Idioma" : "Language"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lang === "pt" ? "Selecionar idioma" : "Select language"}
                  </p>
                </div>
              </div>
              <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setLang("pt")}
                  className={`px-3 py-1.5 text-sm font-medium transition ${lang === "pt" ? "bg-red-600 text-white" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                >
                  PT
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 py-1.5 text-sm font-medium transition ${lang === "en" ? "bg-red-600 text-white" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={sair}
            className="w-full bg-white dark:bg-gray-900 border border-red-500 text-red-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition shadow-sm"
          >
            <LogOut size={18} />
            {t("Sair da conta")}
          </button>

        </div>
      </div>
    </div>
  );
}
