"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "pt" | "en";

const translations: Record<string, Record<Lang, string>> = {
  // Geral
  "Carregando...": { pt: "Carregando...", en: "Loading..." },
  "Tentar novamente": { pt: "Tentar novamente", en: "Try again" },
  "Cancelar": { pt: "Cancelar", en: "Cancel" },
  "Salvar": { pt: "Salvar", en: "Save" },
  "Confirmar": { pt: "Confirmar", en: "Confirm" },
  "Fechar": { pt: "Fechar", en: "Close" },
  "Sair": { pt: "Sair", en: "Sign out" },
  "Conectado": { pt: "Conectado", en: "Connected" },
  "Sem conexão": { pt: "Sem conexão", en: "No connection" },
  "Nenhum resultado encontrado.": { pt: "Nenhum resultado encontrado.", en: "No results found." },
  "Anterior": { pt: "Anterior", en: "Previous" },
  "Próximo": { pt: "Próximo", en: "Next" },
  "Progresso": { pt: "Progresso", en: "Progress" },
  "Voltar": { pt: "Voltar", en: "Back" },
  "Baixar": { pt: "Baixar", en: "Download" },
  "Buscar...": { pt: "Buscar...", en: "Search..." },
  "Nova": { pt: "Nova", en: "New" },
  "Novo": { pt: "Novo", en: "New" },
  "Ativo": { pt: "Ativo", en: "Active" },
  "Inativo": { pt: "Inativo", en: "Inactive" },
  "Todos": { pt: "Todos", en: "All" },
  "Ativos": { pt: "Ativos", en: "Active" },
  "Inativos": { pt: "Inativos", en: "Inactive" },
  "Página": { pt: "Página", en: "Page" },
  "de": { pt: "de", en: "of" },

  // Login
  "Toyota Experience": { pt: "Toyota Experience", en: "Toyota Experience" },
  "Acompanhe seu veículo em tempo real": { pt: "Acompanhe seu veículo em tempo real", en: "Track your vehicle in real time" },
  "Crie sua conta": { pt: "Crie sua conta", en: "Create your account" },
  "Login": { pt: "Login", en: "Login" },
  "Cadastro": { pt: "Cadastro", en: "Sign Up" },
  "Email": { pt: "Email", en: "Email" },
  "Senha": { pt: "Senha", en: "Password" },
  "Entrar": { pt: "Entrar", en: "Sign In" },
  "Entrando...": { pt: "Entrando...", en: "Signing in..." },
  "Nome completo": { pt: "Nome completo", en: "Full name" },
  "Data de nascimento": { pt: "Data de nascimento", en: "Date of birth" },
  "Confirmar senha": { pt: "Confirmar senha", en: "Confirm password" },
  "Criar conta": { pt: "Criar conta", en: "Create account" },
  "Criando conta...": { pt: "Criando conta...", en: "Creating account..." },

  // Header / Home
  "Olá,": { pt: "Olá,", en: "Hello," },
  "bem-vindo": { pt: "bem-vindo", en: "welcome" },
  "Novidades Toyota": { pt: "Novidades Toyota", en: "Toyota News" },
  "Ver detalhes": { pt: "Ver detalhes", en: "View details" },
  "Sair da conta": { pt: "Sair da conta", en: "Sign out" },
  "Notificações": { pt: "Notificações", en: "Notifications" },
  "Diagnóstico do Veículo": { pt: "Diagnóstico do Veículo", en: "Vehicle Diagnostics" },
  "Disponível na Play Store e App Store": { pt: "Disponível na Play Store e App Store", en: "Available on Play Store and App Store" },

  // Acompanhamento
  "Seus Pedidos": { pt: "Seus Pedidos", en: "Your Orders" },
  "pedido(s)": { pt: "pedido(s)", en: "order(s)" },
  "Adicionar": { pt: "Adicionar", en: "Add" },
  "Adicionar pedido": { pt: "Adicionar pedido", en: "Add order" },
  "Informe o número do pedido fornecido pelo vendedor": { pt: "Informe o número do pedido fornecido pelo vendedor", en: "Enter the order number provided by the seller" },
  "Número do pedido": { pt: "Número do pedido", en: "Order number" },
  "Buscando...": { pt: "Buscando...", en: "Searching..." },
  "Agendar retirada": { pt: "Agendar retirada", en: "Schedule pickup" },
  "Confirmar agendamento": { pt: "Confirmar agendamento", en: "Confirm scheduling" },
  "Escolha a data e o horário": { pt: "Escolha a data e o horário", en: "Choose date and time" },
  "Data": { pt: "Data", en: "Date" },
  "Horário": { pt: "Horário", en: "Time" },
  "Acompanhamento": { pt: "Acompanhamento", en: "Tracking" },
  "Compra realizada": { pt: "Compra realizada", en: "Purchase confirmed" },
  "Início de produção": { pt: "Início de produção", en: "Production started" },
  "Pintura": { pt: "Pintura", en: "Painting" },
  "Instalação do motor": { pt: "Instalação do motor", en: "Engine installation" },
  "Acabamento interno": { pt: "Acabamento interno", en: "Interior finishing" },
  "Inspeção final": { pt: "Inspeção final", en: "Final inspection" },
  "Liberado para transporte": { pt: "Liberado para transporte", en: "Released for transport" },
  "Data do pedido:": { pt: "Data do pedido:", en: "Order date:" },
  "Valor total:": { pt: "Valor total:", en: "Total value:" },
  "Vendedor:": { pt: "Vendedor:", en: "Seller:" },
  "ⓘ Saiba mais": { pt: "ⓘ Saiba mais", en: "ⓘ Learn more" },
  "Você ainda não tem pedidos vinculados.": { pt: "Você ainda não tem pedidos vinculados.", en: "You have no linked orders yet." },

  // Perfil cliente
  "Perfil": { pt: "Perfil", en: "Profile" },
  "Seus dados pessoais e preferências": { pt: "Seus dados pessoais e preferências", en: "Your personal data and preferences" },
  "Nome": { pt: "Nome", en: "Name" },
  "Telefone": { pt: "Telefone", en: "Phone" },
  "Preferências": { pt: "Preferências", en: "Preferences" },
  "Controle como você recebe notificações": { pt: "Controle como você recebe notificações", en: "Control how you receive notifications" },
  "Notificações por Email": { pt: "Notificações por Email", en: "Email Notifications" },
  "Receber atualizações por email": { pt: "Receber atualizações por email", en: "Receive updates by email" },
  "Notificações por SMS": { pt: "Notificações por SMS", en: "SMS Notifications" },
  "Alertas diretos no celular": { pt: "Alertas diretos no celular", en: "Direct alerts on your phone" },
  "Emails Promocionais": { pt: "Emails Promocionais", en: "Promotional Emails" },
  "Ofertas e novidades": { pt: "Ofertas e novidades", en: "Offers and news" },
  "Tema escuro": { pt: "Tema escuro", en: "Dark mode" },
  "Alternar entre modo claro e escuro": { pt: "Alternar entre modo claro e escuro", en: "Toggle light/dark mode" },
  "Nível": { pt: "Nível", en: "Level" },
  "Iniciante": { pt: "Iniciante", en: "Beginner" },
  "Bronze": { pt: "Bronze", en: "Bronze" },
  "Prata": { pt: "Prata", en: "Silver" },
  "Ouro": { pt: "Ouro", en: "Gold" },
  "pedido(s) realizados": { pt: "pedido(s) realizados", en: "order(s) placed" },

  // Notificações
  "Tudo em dia": { pt: "Tudo em dia", en: "All caught up" },
  "Marcar todas como lidas": { pt: "Marcar todas como lidas", en: "Mark all as read" },
  "Nenhuma notificação": { pt: "Nenhuma notificação", en: "No notifications" },
  "Você será avisado sobre atualizações do seu veículo": { pt: "Você será avisado sobre atualizações do seu veículo", en: "You will be notified about vehicle updates" },

  // Recall
  "Recalls": { pt: "Recalls", en: "Recalls" },
  "Avisos de recall relacionados ao seu veículo": { pt: "Avisos de recall relacionados ao seu veículo", en: "Recall notices for your vehicle" },
  "Verificando recalls...": { pt: "Verificando recalls...", en: "Checking recalls..." },
  "Nenhum recall encontrado": { pt: "Nenhum recall encontrado", en: "No recalls found" },
  "Seu veículo está em dia com os alertas da Toyota": { pt: "Seu veículo está em dia com os alertas da Toyota", en: "Your vehicle is up to date with Toyota alerts" },
  "Visualizado": { pt: "Visualizado", en: "Viewed" },

  // Diagnóstico
  "Códigos DTC e status do seu veículo": { pt: "Códigos DTC e status do seu veículo", en: "DTC codes and vehicle status" },
  "Verificando diagnóstico...": { pt: "Verificando diagnóstico...", en: "Checking diagnostics..." },
  "Nenhum problema detectado": { pt: "Nenhum problema detectado", en: "No issues detected" },
  "Leve seu veículo a uma concessionária Toyota": { pt: "Leve seu veículo a uma concessionária Toyota", en: "Take your vehicle to a Toyota dealership" },
  "Seu veículo está funcionando normalmente": { pt: "Seu veículo está funcionando normalmente", en: "Your vehicle is running normally" },
  "Sistema afetado": { pt: "Sistema afetado", en: "Affected system" },
  "Alta": { pt: "Alta", en: "High" },
  "Média": { pt: "Média", en: "Medium" },
  "Baixa": { pt: "Baixa", en: "Low" },

  // Documentos
  "Meus Documentos": { pt: "Meus Documentos", en: "My Documents" },
  "Documentos relacionados ao seu veículo": { pt: "Documentos relacionados ao seu veículo", en: "Documents related to your vehicle" },
  "Carregando documentos...": { pt: "Carregando documentos...", en: "Loading documents..." },
  "Nenhum documento disponível": { pt: "Nenhum documento disponível", en: "No documents available" },

  // Loja
  "Concessionária": { pt: "Concessionária", en: "Dealership" },
  "Encontre a unidade mais próxima de você": { pt: "Encontre a unidade mais próxima de você", en: "Find the nearest location" },
  "Buscar por nome ou cidade...": { pt: "Buscar por nome ou cidade...", en: "Search by name or city..." },
  "Nenhuma encontrada.": { pt: "Nenhuma encontrada.", en: "None found." },
  "Como chegar": { pt: "Como chegar", en: "Get directions" },
  "Concessionária oficial Toyota": { pt: "Concessionária oficial Toyota", en: "Official Toyota dealership" },

  // SaibaMais
  "Processo de Fabricação": { pt: "Processo de Fabricação", en: "Manufacturing Process" },

  // Apps
  "Apps Toyota": { pt: "Apps Toyota", en: "Toyota Apps" },
  "Explore os aplicativos oficiais da Toyota": { pt: "Explore os aplicativos oficiais da Toyota", en: "Explore Toyota's official apps" },

  // Vendedor - Dashboard
  "Bom dia": { pt: "Bom dia", en: "Good morning" },
  "Boa tarde": { pt: "Boa tarde", en: "Good afternoon" },
  "Boa noite": { pt: "Boa noite", en: "Good evening" },
  "Resumo das atividades recentes.": { pt: "Resumo das atividades recentes.", en: "Recent activity summary." },
  "Pedidos": { pt: "Pedidos", en: "Orders" },
  "Clientes": { pt: "Clientes", en: "Customers" },
  "total no sistema": { pt: "total no sistema", en: "total in system" },
  "cadastrados": { pt: "cadastrados", en: "registered" },
  "vs mês anterior": { pt: "vs mês anterior", en: "vs last month" },
  "este mês": { pt: "este mês", en: "this month" },
  "Vendas Mensais": { pt: "Vendas Mensais", en: "Monthly Sales" },
  "Top Veículos": { pt: "Top Veículos", en: "Top Vehicles" },
  "Pedidos Recentes": { pt: "Pedidos Recentes", en: "Recent Orders" },
  "Nenhum pedido encontrado.": { pt: "Nenhum pedido encontrado.", en: "No orders found." },

  // Vendedor - Pedidos
  "Gerencie os pedidos dos clientes": { pt: "Gerencie os pedidos dos clientes", en: "Manage customer orders" },
  "Buscar por cliente, pedido ou veículo...": { pt: "Buscar por cliente, pedido ou veículo...", en: "Search by customer, order or vehicle..." },
  "Detalhes do Pedido": { pt: "Detalhes do Pedido", en: "Order Details" },
  "Cliente:": { pt: "Cliente:", en: "Customer:" },
  "Veículo:": { pt: "Veículo:", en: "Vehicle:" },
  "Ano:": { pt: "Ano:", en: "Year:" },
  "Cor:": { pt: "Cor:", en: "Color:" },
  "Valor:": { pt: "Valor:", en: "Value:" },
  "Data:": { pt: "Data:", en: "Date:" },
  "Em produção": { pt: "Em produção", en: "In production" },
  "Inspeção": { pt: "Inspeção", en: "Inspection" },
  "Em transporte": { pt: "Em transporte", en: "In transit" },
  "Finalizado": { pt: "Finalizado", en: "Completed" },
  "Pedido confirmado": { pt: "Pedido confirmado", en: "Order confirmed" },

  // Vendedor - Clientes
  "Gerenciamento de clientes": { pt: "Gerenciamento de clientes", en: "Customer management" },
  "Buscar cliente...": { pt: "Buscar cliente...", en: "Search customer..." },
  "Cadastrar Cliente": { pt: "Cadastrar Cliente", en: "Add Customer" },
  "Novo Cliente": { pt: "Novo Cliente", en: "New Customer" },
  "Editar Cliente": { pt: "Editar Cliente", en: "Edit Customer" },
  "Nenhum cliente encontrado.": { pt: "Nenhum cliente encontrado.", en: "No customers found." },

  // Vendedor - Estoque
  "Estoque": { pt: "Estoque", en: "Inventory" },
  "Buscar por modelo, cor ou chassi...": { pt: "Buscar por modelo, cor ou chassi...", en: "Search by model, color or chassis..." },
  "Disponível": { pt: "Disponível", en: "Available" },
  "Reservado": { pt: "Reservado", en: "Reserved" },
  "Produção": { pt: "Produção", en: "Production" },
  "Transporte": { pt: "Transporte", en: "Transport" },
  "Vendido": { pt: "Vendido", en: "Sold" },
  "Nenhum veículo encontrado.": { pt: "Nenhum veículo encontrado.", en: "No vehicles found." },
  "Carregando estoque...": { pt: "Carregando estoque...", en: "Loading inventory..." },

  // Vendedor - Documentos
  "Documentos": { pt: "Documentos", en: "Documents" },
  "Gerencie os documentos dos clientes": { pt: "Gerencie os documentos dos clientes", en: "Manage customer documents" },
  "Buscar por nome, cliente ou tipo...": { pt: "Buscar por nome, cliente ou tipo...", en: "Search by name, customer or type..." },
  "Aprovar": { pt: "Aprovar", en: "Approve" },
  "Reprovar": { pt: "Reprovar", en: "Reject" },
  "Nenhum documento encontrado.": { pt: "Nenhum documento encontrado.", en: "No documents found." },
  "APROVADO": { pt: "APROVADO", en: "APPROVED" },
  "REPROVADO": { pt: "REPROVADO", en: "REJECTED" },
  "PENDENTE": { pt: "PENDENTE", en: "PENDING" },

  // Vendedor - Perfil
  "Salvar alterações": { pt: "Salvar alterações", en: "Save changes" },
  "Alterações salvas com sucesso.": { pt: "Alterações salvas com sucesso.", en: "Changes saved successfully." },
  "Informações da Conta": { pt: "Informações da Conta", en: "Account Information" },
  "Cargo": { pt: "Cargo", en: "Role" },
  "Membro desde": { pt: "Membro desde", en: "Member since" },
  "Total de vendas": { pt: "Total de vendas", en: "Total sales" },
  "Vendedor Sênior": { pt: "Vendedor Sênior", en: "Senior Salesperson" },
  "Painel do Vendedor": { pt: "Painel do Vendedor", en: "Seller Panel" },
  "Dashboard": { pt: "Dashboard", en: "Dashboard" },
  "Administração": { pt: "Administração", en: "Administration" },

  // Vendedor - Admin
  "Painel Administrativo": { pt: "Painel Administrativo", en: "Admin Panel" },
  "Novo Vendedor": { pt: "Novo Vendedor", en: "New Seller" },
  "Buscar usuário...": { pt: "Buscar usuário...", en: "Search user..." },
  "Criar vendedor": { pt: "Criar vendedor", en: "Create seller" },
  "Alterar status do usuário?": { pt: "Alterar status do usuário?", en: "Change user status?" },
  "será desativado": { pt: "será desativado", en: "will be deactivated" },
  "será ativado": { pt: "será ativado", en: "will be activated" },
  "Nenhum usuário encontrado.": { pt: "Nenhum usuário encontrado.", en: "No users found." },
  "Desativar": { pt: "Desativar", en: "Deactivate" },
  "Ativar": { pt: "Ativar", en: "Activate" },
  "Acesso negado": { pt: "Acesso negado", en: "Access denied" },
  "Você não tem permissão para acessar esta página.": { pt: "Você não tem permissão para acessar esta página.", en: "You don't have permission to access this page." },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "pt",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang;
    if (saved === "pt" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  function t(key: string): string {
    return translations[key]?.[lang] ?? key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
