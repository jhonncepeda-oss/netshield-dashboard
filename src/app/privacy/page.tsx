import { Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 p-8 font-sans selection:bg-cyan-900 selection:text-cyan-50">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Política de Privacidad</h1>
            <p className="text-slate-400 text-sm mt-1">Última actualización: 29 de septiembre de 2026</p>
          </div>
        </header>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Recopilación de Información</h2>
            <p>Recopilamos su dirección de correo electrónico, nombre (provisto por Google OAuth) y los archivos de configuración de red que usted sube voluntariamente para su análisis en nuestra plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Uso de la Información</h2>
            <p>Sus archivos de configuración son utilizados exclusivamente por el motor de Python (NetShield Core) en la nube para identificar brechas de seguridad, contraseñas débiles y configuraciones obsoletas. Los reportes generados se asocian a su cuenta para que solo usted tenga acceso a ellos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Enmascaramiento Automático (Redaction)</h2>
            <p>Nuestro motor de auditoría está programado para ofuscar y enmascarar automáticamente credenciales sensibles, contraseñas en texto plano y hashes detectados en las configuraciones analizadas antes de guardar el reporte, asegurando que estos datos críticos no queden expuestos en los informes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Retención de Datos Efímera</h2>
            <p>Por su seguridad y cumplimiento normativo, los archivos de configuración `.cfg` en crudo que usted suba se almacenan en buckets temporales y son eliminados automáticamente de nuestros servidores 7 días después de su procesamiento.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Base Legal y Derechos del Usuario</h2>
            <p>El procesamiento de sus datos y archivos se basa en su consentimiento explícito otorgado al aceptar estos términos y enviar sus configuraciones. Usted tiene el derecho de acceder a su historial de auditorías y solicitar la eliminación completa de su cuenta y reportes en cualquier momento.</p>
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
