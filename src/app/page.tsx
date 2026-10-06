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
    <div className="min-h-screen bg-[#000000] text-neutral-300 p-4 sm:p-8 md:p-12 font-sans selection:bg-white selection:text-black">
      <TermsUpdater currentVersion={user?.user_metadata?.terms_version || 0} />
      
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Minimalist Header */}
        <header className="flex items-center justify-between border-b border-neutral-800 pb-8">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-[#0a0a0a] border border-neutral-800 rounded-lg">
              <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white tracking-tight">
                NetShield Core
              </h1>
              <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">Network Security Auditing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#111] border border-neutral-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-400" />
              </div>
              <span className="text-sm font-medium text-neutral-300 hidden sm:block">{userName}</span>
            </div>
            <div className="w-px h-8 bg-neutral-800 hidden sm:block"></div>
            <form action="/auth/signout" method="post">
              <button className="text-xs uppercase tracking-widest font-medium text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Cerrar Sesi?n</span>
              </button>
            </form>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column (Upload & System Status) */}
          <div className="xl:col-span-4 space-y-8">
            <UploadConfig userId={user?.id} />
            
            {/* Minimalist System Status */}
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Server className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-medium text-white uppercase tracking-widest">Estado del Sistema</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-800/50 pb-4">
                  <span className="text-neutral-400 text-sm">Motor de Auditor?a</span>
                  <span className="flex items-center gap-2 text-xs font-mono text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> ONLINE
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-neutral-400 text-sm">Base de Datos</span>
                  <span className="flex items-center gap-2 text-xs font-mono text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> SYNCED
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
