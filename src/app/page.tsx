import UploadConfig from "@/components/UploadConfig";
import ReportTable from "@/components/ReportTable";
import { Shield, User, LogOut, Server } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import TermsUpdater from "@/components/TermsUpdater";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || user?.email || 'Administrador';

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-300 p-4 sm:p-8 md:p-12 font-sans selection:bg-white/20 selection:text-white relative overflow-hidden">
      
      {/* Glassmorphism Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px]"></div>
      </div>

      <TermsUpdater currentVersion={user?.user_metadata?.terms_version || 0} />
      
      <div className="max-w-[1400px] mx-auto space-y-12 relative z-10">
        
        {/* Glassmorphism Header */}
        <header className="flex items-center justify-between border-b border-white/10 pb-8">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.03)]">
              <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white tracking-tight">
                NetShield Core
              </h1>
              <p className="text-neutral-400 text-xs uppercase tracking-widest mt-1">Network Security Auditing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-300" />
              </div>
              <span className="text-sm font-medium text-neutral-200 hidden sm:block">{userName}</span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
            <form action="/auth/signout" method="post">
              <button className="text-xs uppercase tracking-widest font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Cerrar Sesión</span>
              </button>
            </form>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column (Upload & System Status) */}
          <div className="xl:col-span-4 space-y-8">
            <UploadConfig userId={user?.id} />
            
            {/* Glassmorphism System Status */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-6">
                <Server className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-medium text-white uppercase tracking-widest">Estado del Sistema</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-neutral-400 text-sm">Motor de Auditoría</span>
                  <span className="flex items-center gap-2 text-xs font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span> ONLINE
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-neutral-400 text-sm">Base de Datos</span>
                  <span className="flex items-center gap-2 text-xs font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span> SYNCED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Table) */}
          <div className="xl:col-span-8">
            <ReportTable />
          </div>

        </main>
      </div>
    </div>
  );
}
