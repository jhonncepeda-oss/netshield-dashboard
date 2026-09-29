"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { ShieldAlert, ShieldCheck, X, ChevronDown, ChevronUp, Copy, CheckCircle2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function ReportTable() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters & Pagination
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SECURE" | "VULNERABLE">("ALL");
  const PAGE_SIZE = 10;

  // Drawer states
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [copiedRule, setCopiedRule] = useState<string | null>(null);

  const supabase = createClient();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("audit_reports")
        .select(
          report_id,
          overall_score,
          timestamp,
          devices!inner ( hostname, ip_address )
        , { count: 'exact' });

      if (searchQuery) {
        query = query.or(hostname.ilike.%%,ip_address.ilike.%%, { referencedTable: 'devices' });
      }

      if (statusFilter === "SECURE") {
        query = query.gte("overall_score", 80);
      } else if (statusFilter === "VULNERABLE") {
        query = query.lt("overall_score", 80);
      }

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.order("timestamp", { ascending: false }).range(from, to);
        
      const { data, count, error } = await query;
      
      if (error) throw error;
      setReports(data || []);
      if (count !== null) setTotalCount(count);
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_reports' }, () => {
        if (page === 0) fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [page, fetchReports]);

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

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden transition-all duration-300">
        <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">Auditor?as</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar IP o Hostname..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                className="w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setPage(0); }}
                className="w-full sm:w-auto appearance-none bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">Todos</option>
                <option value="SECURE">Seguros</option>
                <option value="VULNERABLE">Vulnerables</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
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
                <tr><td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex justify-center"><Loader2 className="animate-spin text-cyan-500" size={24} /></div>
                </td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No se encontraron resultados.</td></tr>
              ) : (
                reports.map((report) => {
                  const isSecure = report.overall_score >= 80;
                  return (
                    <tr 
                      key={report.report_id} 
                      onClick={() => openDrawer(report)}
                      className="border-b border-slate-700/30 hover:bg-slate-800/60 transition-colors cursor-pointer animate-in fade-in slide-in-from-top-2 duration-500"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-700/50 flex items-center justify-between bg-slate-800/30">
            <span className="text-sm text-slate-400">
              Mostrando {page * PAGE_SIZE + 1} a {Math.min((page + 1) * PAGE_SIZE, totalCount)} de {totalCount} resultados
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DRAWER COMPONENT */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedReport(null)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-[#0B1120] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
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
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/80">
               <button 
                 onClick={() => {
                   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                   window.open(${apiUrl}/export//pdf, "_blank");
                 }}
                 className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 <span>Descargar Reporte PDF</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
