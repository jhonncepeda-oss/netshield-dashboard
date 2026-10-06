"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { ShieldAlert, ShieldCheck, X, ChevronDown, Copy, CheckCircle2, Search, Filter, ChevronLeft, ChevronRight, Loader2, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RULE_TITLES: Record<string, string> = {
  "SEC-01": "Cifrado Global de Contraseñas (CWE-316)",
  "SEC-02": "Inhabilitación del Protocolo Telnet (CWE-319)",
  "SEC-03": "Timeout de Sesión Inactiva (CWE-613)",
  "SEC-04": "Servidor HTTP de Gestión (CVE-2018-0171)",
  "SEC-05": "Centralización de Logs (CWE-778)"
};

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
      const { data: { session } } = await supabase.auth.getSession();
      
      let query = supabase
        .from("audit_reports")
        .select(`
          report_id,
          overall_score,
          timestamp,
          devices!inner ( hostname, ip_address )
        `, { count: 'exact' })
        .eq('user_id', session?.user?.id || 'none');

      if (searchQuery) {
        query = query.or(`hostname.ilike.%${searchQuery}%,ip_address.ilike.%${searchQuery}%`, { referencedTable: 'devices' });
      }

      const { data, count, error } = await query
        .order('timestamp', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) throw error;

      let filteredData = data || [];
      if (statusFilter === "SECURE") {
        filteredData = filteredData.filter(r => r.overall_score >= 80);
      } else if (statusFilter === "VULNERABLE") {
        filteredData = filteredData.filter(r => r.overall_score < 80);
      }

      setReports(filteredData);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchReports();
    
    // Listen for new uploads from UploadConfig
    const handleUpload = () => fetchReports();
    window.addEventListener("reportUploaded", handleUpload);
    
    return () => window.removeEventListener("reportUploaded", handleUpload);
  }, [fetchReports]);

  const openDrawer = async (report: any) => {
    setSelectedReport(report);
    setLoadingResults(true);
    setExpandedRule(null);
    try {
      const { data, error } = await supabase
        .from("audit_results")
        .select("*")
        .eq('report_id', report.report_id);

      if (error) throw error;
      
      const mappedData = data?.map(res => ({
        ...res,
        rule_name: RULE_TITLES[res.rule_id] || `Regla de Seguridad ${res.rule_id}`,
        status: res.passed ? "SEGURO" : "VULNERABLE",
        severity: res.passed ? "" : "ALTA"
      })) || [];

      setResults(mappedData);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoadingResults(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRule(id);
    setTimeout(() => setCopiedRule(null), 2000);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden text-neutral-300 font-sans">
        {/* Filters Header */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por Hostname o IP..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="text-neutral-400 w-4 h-4" />
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(0);
              }}
              className="bg-white/5 backdrop-blur-md border border-white/10 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-white/30 transition-all [&>option]:bg-neutral-900"
            >
              <option value="ALL">Todos los Reportes</option>
              <option value="SECURE">Seguros (80%+)</option>
              <option value="VULNERABLE">Vulnerables</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-neutral-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm uppercase tracking-widest font-medium">Cargando reportes</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-neutral-500">
              <div className="p-4 bg-white/5 rounded-full mb-4">
                <ShieldCheck className="w-10 h-10 opacity-30 text-white" />
              </div>
              <p className="text-sm">No se encontraron auditorías.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-white/5 text-neutral-400 text-xs uppercase tracking-widest font-semibold">
                  <th className="px-6 py-4">Dispositivo</th>
                  <th className="px-6 py-4">Puntuación</th>
                  <th className="px-6 py-4">Fecha de Análisis</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {reports.map((report) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={report.report_id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{report.devices?.hostname}</div>
                        <div className="text-xs text-neutral-500 font-mono mt-0.5">{report.devices?.ip_address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${report.overall_score >= 80 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]'}`} 
                              style={{ width: `${report.overall_score}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-mono font-bold ${report.overall_score >= 80 ? 'text-neutral-200' : 'text-red-400'}`}>
                            {Number(report.overall_score).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {new Date(report.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openDrawer(report)}
                          className="px-4 py-1.5 bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium uppercase tracking-wider transition-all shadow-sm backdrop-blur-md"
                        >
                          Revisar
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black/20">
            <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
              Pág {page + 1} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all backdrop-blur-md"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all backdrop-blur-md"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DRAWER COMPONENT */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[60] flex justify-end font-sans">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedReport(null)}
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-neutral-950/80 backdrop-blur-2xl border-l border-white/10 h-full flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/10 bg-white/5">
                <div>
                  <h2 className="text-xl font-medium text-white flex items-center gap-3">
                    {selectedReport.devices?.hostname}
                    <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase tracking-widest font-bold border bg-white/5 backdrop-blur-md ${selectedReport.overall_score >= 80 ? 'border-cyan-500/30 text-cyan-400' : 'border-red-500/30 text-red-400'}`}>
                      Score: {Number(selectedReport.overall_score).toFixed(2)}%
                    </span>
                  </h2>
                  <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest">
                    {new Date(selectedReport.timestamp).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                <h3 className="text-sm font-semibold text-neutral-300 mb-6 uppercase tracking-widest border-b border-white/5 pb-2">Desglose de Reglas</h3>
                
                {loadingResults ? (
                  <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                    <Loader2 className="animate-spin h-6 w-6 mb-3" />
                    <span className="text-xs uppercase tracking-widest font-medium">Analizando...</span>
                  </div>
                ) : results.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8 text-sm">No se encontraron detalles para este reporte.</p>
                ) : (
                  <div className="space-y-3">
                    {results.map((res) => {
                      const isFailed = res.passed === false;
                      const isExpanded = expandedRule === res.result_id || expandedRule === res.rule_id;

                      return (
                        <motion.div 
                          layout
                          key={res.result_id} 
                          className={`border rounded-xl overflow-hidden bg-white/5 backdrop-blur-md transition-colors ${isFailed ? 'border-red-500/20 shadow-[0_0_15px_rgba(248,113,113,0.05)]' : 'border-white/10'}`}
                        >
                          <button 
                            onClick={() => setExpandedRule(isExpanded ? null : res.result_id)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {isFailed ? <ShieldAlert className="text-red-400 w-5 h-5" strokeWidth={1.5} /> : <ShieldCheck className="text-cyan-400 w-5 h-5" strokeWidth={1.5} />}
                              <span className={`text-sm font-medium ${isFailed ? 'text-white' : 'text-neutral-200'}`}>{res.rule_name}</span>
                              {isFailed && (
                                <span className="text-[10px] px-2 py-0.5 border border-red-500/30 bg-red-500/10 text-red-300 uppercase tracking-widest font-bold rounded-md">
                                  {res.severity}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${isFailed ? 'text-red-400' : 'text-cyan-400'}`}>
                                {res.status}
                              </span>
                              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown size={16} className="text-neutral-400" />
                              </motion.div>
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-0">
                                  <div className="h-px w-full bg-white/10 mb-4"></div>
                                  <p className={`text-sm leading-relaxed ${isFailed ? "text-red-200/80" : "text-neutral-400"}`}>{res.details}</p>
                                  
                                  {isFailed && res.remediation && (
                                    <div className="mt-5">
                                      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Comando de Remediación</h4>
                                      <div className="relative group">
                                        <pre className="bg-black/40 border border-white/5 rounded-lg p-4 overflow-x-auto text-xs font-mono text-neutral-300 shadow-inner">
                                          <code>{res.remediation}</code>
                                        </pre>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(res.remediation, res.result_id);
                                          }}
                                          className="absolute top-2 right-2 p-1.5 bg-white/10 backdrop-blur-md rounded-md text-neutral-300 opacity-0 group-hover:opacity-100 transition-all hover:text-white border border-white/10 hover:bg-white/20"
                                          title="Copiar comando"
                                        >
                                          {copiedRule === res.result_id ? <CheckCircle2 size={14} className="text-white" /> : <Copy size={14} />}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-8 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                 <button 
                   onClick={() => {
                     const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                     window.open(`${apiUrl}/export/${selectedReport.report_id}/pdf`, "_blank");
                   }}
                   className="w-full bg-white hover:bg-neutral-200 text-black font-medium text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
                 >
                   <Download size={18} strokeWidth={2} />
                   <span>Descargar Reporte Ejecutivo</span>
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
