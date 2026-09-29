"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function ReportTable() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_reports")
        .select(`
          report_id,
          overall_score,
          timestamp,
          devices ( hostname, ip_address )
        `)
        .order("timestamp", { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_reports' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden transition-all duration-300">
      <div className="p-6 border-b border-slate-700/50">
        <h3 className="text-xl font-semibold text-white">Últimas Auditorías</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800/50">
            <tr>
              <th className="px-6 py-4">Dispositivo</th>
              <th className="px-6 py-4">IP</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center">Cargando reportes...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay auditorías registradas.</td></tr>
            ) : (
              reports.map((report) => {
                const isSecure = report.overall_score >= 80;
                return (
                  <tr key={report.report_id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {report.devices?.hostname || "Desconocido"}
                    </td>
                    <td className="px-6 py-4">{report.devices?.ip_address || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${isSecure ? "text-emerald-400" : "text-rose-400"}`}>
                        {Number(report.overall_score).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isSecure ? (
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded w-max">
                          <ShieldCheck size={16} /> Seguro
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-2 py-1 rounded w-max">
                          <ShieldAlert size={16} /> Vulnerable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(report.timestamp).toLocaleString()}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
