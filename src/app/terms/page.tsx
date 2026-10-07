import { Shield } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Glassmorphism Background Orbs */}
      <div className="absolute top-0 -left-32 w-96 h-96 bg-cyan-900/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-blue-900/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10 bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-xl mt-10">
        <header className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/5 shadow-inner">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Términos y Condiciones</h1>
            <p className="text-white/50 text-sm mt-1">Última actualización: 29 de septiembre de 2026</p>
          </div>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar NetShield Core, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder a la plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Uso del Servicio</h2>
            <p>NetShield Core está diseñado para el análisis automatizado de configuraciones de red. Usted es responsable de garantizar que tiene los derechos legales y permisos necesarios para subir y analizar los archivos de configuración de sus dispositivos (Cisco, etc.). Queda estrictamente prohibido usar la plataforma para analizar archivos de terceros sin su consentimiento explícito.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Uso Aceptable (Anti-Abuso)</h2>
            <p>Queda estrictamente prohibido el uso de bots, scripts automatizados, herramientas de scraping o cualquier forma de ingeniería inversa dirigida hacia nuestra API (Backend) para saltarse la interfaz gráfica oficial. Cualquier intento de abuso resultará en la suspensión inmediata de la cuenta.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Cláusula de Indemnidad</h2>
            <p>NetShield Core opera bajo el principio de buena fe. Al utilizar la plataforma, usted declara bajo juramento tener la autorización legal para analizar las configuraciones subidas. El usuario acepta eximir de toda responsabilidad civil o penal a NetShield Core y a sus creadores en caso de que suba archivos obtenidos ilícitamente o audite redes sin autorización.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Disponibilidad del Servicio (SLA)</h2>
            <p>El servicio se proporciona "Tal cual" (As-Is). Debido a nuestra arquitectura de servidores en la nube, la plataforma puede presentar tiempos de carga iniciales extendidos (cold-starts) o mantenimientos no programados. No ofrecemos garantías de disponibilidad ininterrumpida (uptime) ni otorgamos derecho a compensaciones por interrupciones del servicio.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Limitación de Responsabilidad</h2>
            <p>Las auditorías generadas por NetShield Core son herramientas de asistencia y no garantizan la detección del 100% de las vulnerabilidades existentes. Las recomendaciones deben ser revisadas por un profesional de seguridad antes de ser aplicadas en entornos de producción.</p>
          </section>
        </div>

        <div className="pt-8 border-t border-white/10">
          <Link href="/login" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors border border-white/5">
            &larr; Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
