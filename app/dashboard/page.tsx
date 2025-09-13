import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Redirecionar para dashboard baseado no role do usuário
  // O AccessControl no layout já gerencia isso
  redirect("/dashboard/dashboard-admin");
}