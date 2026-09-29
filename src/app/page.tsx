import UploadConfig from "@/components/UploadConfig";
import ReportTable from "@/components/ReportTable";
import { Shield, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || user?.email || 'Usuario';

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 selection:bg-cyan-500/30 p-4 sm:p-8 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                NetShield Core
              </h1>
              <p className="text-slate-400 text-sm mt-1">Network Security Auditing Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <User className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">{userName}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Upload) */}
          <div className="lg:col-span-1 space-y-8">
            <UploadConfig />
            
            <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-2">Estado del Sistema</h3>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Backend API</span>
                  <span className="flex items-center gap-2 text-sm text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Base de Datos</span>
                  <span className="flex items-center gap-2 text-sm text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Conectado
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Table) */}
          <div className="lg:col-span-2">
            <ReportTable />
          </div>

        </main>
      </div>

      {/* Decorative Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      </div>
    </div>
  );
}
