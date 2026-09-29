import { Shield } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 p-8 font-sans selection:bg-cyan-900 selection:text-cyan-50">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Términos y Condiciones</h1>
            <p className="text-slate-400 text-sm mt-1">Última actualización: 29 de septiembre de 2026</p>
          </div>
        </header>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar NetShield Core, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder a la plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Uso del Servicio</h2>
            <p>NetShield Core está diseñado para el análisis automatizado de configuraciones de red. Usted es responsable de garantizar que tiene los derechos legales y permisos necesarios para subir y analizar los archivos de configuración de sus dispositivos (Cisco, etc.). Queda estrictamente prohibido usar la plataforma para analizar archivos de terceros sin su consentimiento explícito.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Privacidad y Seguridad</h2>
            <p>Los archivos de configuración subidos a la plataforma serán analizados mediante reglas automatizadas de ciberseguridad. Sus datos serán procesados con la máxima seguridad. Consulte nuestra Política de Privacidad para más detalles.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Limitación de Responsabilidad</h2>
            <p>Las auditorías generadas por NetShield Core son herramientas de asistencia y no garantizan la detección del 100% de las vulnerabilidades existentes. Las recomendaciones deben ser revisadas por un profesional de seguridad antes de ser aplicadas en entornos de producción.</p>
          </section>
        </div>

        <div className="pt-8">
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            &larr; Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
