"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("Revisa tu correo para confirmar el registro (o inicia sesión si auto-confirm está activado).");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">NetShield Core</h2>
          <p className="text-slate-400 text-sm mt-1">Inicia sesión para continuar</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="admin@empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="••••••••"
            />
          </div>
          
          {error && <div className="text-rose-400 text-sm bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">{error}</div>}

          <div className="flex gap-4 pt-2">
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-lg border border-slate-700 transition-colors"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
