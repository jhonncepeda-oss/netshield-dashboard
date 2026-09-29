"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ShieldAlert, ShieldCheck, X, ChevronDown, ChevronUp, Copy, CheckCircle2 } from "lucide-react";

export default function ReportTable() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Drawer states
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [copiedRule, setCopiedRule] = useState<string | null>(null);

  const supabase = createClient();

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_reports")
        .select(
          report_id,
          overall_score,
          timestamp,
          devices ( hostname, ip_address )
        )
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

  const openDrawer = async (report: any) => {
    setSelectedReport(report);
    setLoadingResults(true);
    setExpandedRule(null);
    try {
      const { data, error } = await supabase
        .from('audit_results')
        .select('*')
        .eq('report_id', report.report_id);
      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Error fetching results", error);
    } finally {
      setLoadingResults(false);
    }
  };

  const copyToClipboard = (text: string, ruleId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRule(ruleId);
    setTimeout(() => setCopiedRule(null), 2000);
  };

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden transition-all duration-300">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-semibold text-white">?ltimas Auditor?as</h3>
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
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No hay auditor?as registradas.</td></tr>
              ) : (
                reports.map((report) => {
                  const isSecure = report.overall_score >= 80;
                  return (
                    <tr 
                      key={report.report_id} 
                      onClick={() => openDrawer(report)}
                      className="border-b border-slate-700/30 hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {report.devices?.hostname || "Desconocido"}
                      </td>
                      <td className="px-6 py-4">{report.devices?.ip_address || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={ont-bold }>
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

      {/* DRAWER COMPONENT */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedReport(null)}
          ></div>
          
          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-[#0B1120] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {selectedReport.devices?.hostname}
                  <span className={	ext-sm px-3 py-1 rounded-full font-bold }>
                    Score: {Number(selectedReport.overall_score).toFixed(2)}%
                  </span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Reporte del {new Date(selectedReport.timestamp).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Resultados de Auditor?a</h3>
              
              {loadingResults ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mr-3"></div>
                  Analizando reglas...
                </div>
              ) : results.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No se encontraron detalles para este reporte.</p>
              ) : (
                results.map((res) => {
                  const isFailed = res.status === 'FAILED';
                  const isExpanded = expandedRule === res.result_id;
                  
                  return (
                    <div 
                      key={res.result_id} 
                      className={order rounded-lg overflow-hidden transition-all }
                    >
                      <button 
                        onClick={() => setExpandedRule(isExpanded ? null : res.result_id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isFailed ? <ShieldAlert className="text-rose-400" size={20} /> : <ShieldCheck className="text-emerald-400" size={20} />}
                          <span className="font-medium text-slate-200">{res.rule_name}</span>
                          {isFailed && (
                            <span className={	ext-xs px-2 py-0.5 rounded }>
                              {res.severity}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={isFailed ? 'text-rose-400 text-sm font-semibold' : 'text-emerald-400 text-sm font-semibold'}>
                            {res.status}
                          </span>
                          {isExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-800/50">
                          <p className="text-sm text-slate-300 mb-4">{res.details}</p>
                          
                          {isFailed && res.remediation && (
                            <div className="mt-4">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comando de Remediaci?n</h4>
                              <div className="relative group">
                                <pre className="bg-black/50 border border-slate-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-cyan-400">
                                  <code>{res.remediation}</code>
                                </pre>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(res.remediation, res.result_id);
                                  }}
                                  className="absolute top-2 right-2 p-2 bg-slate-800 rounded text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                                  title="Copiar comando"
                                >
                                  {copiedRule === res.result_id ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/80">
               <button 
                 disabled
                 className="w-full bg-slate-800 text-slate-500 font-medium py-3 rounded-lg border border-slate-700 cursor-not-allowed flex items-center justify-center gap-2"
                 title="Se implementar? en la Fase 5"
               >
                 <span>Descargar Reporte PDF (Pr?ximamente)</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
