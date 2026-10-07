import { Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Política de Privacidad</h1>
            <p className="text-white/50 text-sm mt-1">Última actualización: 29 de septiembre de 2026</p>
          </div>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Recopilación de Información</h2>
            <p>Recopilamos su dirección de correo electrónico, nombre (provisto por Google OAuth) y los archivos de configuración de red que usted sube voluntariamente para su análisis en nuestra plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Uso de la Información</h2>
            <p>Sus archivos de configuración son utilizados exclusivamente por el motor de Python (NetShield Core) en la nube para identificar brechas de seguridad, contraseñas débiles y configuraciones obsoletas. Los reportes generados se asocian a su cuenta para que solo usted tenga acceso a ellos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Enmascaramiento Automático (Redaction)</h2>
            <p>Nuestro motor de auditoría está programado para ofuscar y enmascarar automáticamente credenciales sensibles, contraseñas en texto plano y hashes detectados en las configuraciones analizadas antes de guardar el reporte, asegurando que estos datos críticos no queden expuestos en los informes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Retención de Datos Efímera</h2>
            <p>Por su seguridad y cumplimiento normativo, los archivos de configuración `.cfg` en crudo que usted suba se almacenan en buckets temporales y son eliminados automáticamente de nuestros servidores 7 días después de su procesamiento.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Base Legal y Derechos del Usuario</h2>
            <p>El procesamiento de sus datos y archivos se basa en su consentimiento explícito otorgado al aceptar estos términos y enviar sus configuraciones. Usted tiene el derecho de acceder a su historial de auditorías y solicitar la eliminación completa de su cuenta y reportes en cualquier momento.</p>
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
