"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useI18n } from "@/lib/providers";

interface Report {
  id: number;
  reporter: string;
  listing_title: string;
  reason: string;
  status: string;
  created_at: string;
}

export function ReportsSection() {
  const { t } = useI18n();
  const supabase = useSupabaseClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch reports with related data
      const { data, error } = await supabase
        .from("moderation_flags")
        .select(`
          id, 
          reporter_id, 
          listing_id, 
          reason, 
          status, 
          created_at,
          profiles(username, full_name),
          listings(title)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }
      
      // Map the data to our Report interface
      const mappedReports: Report[] = data.map((report: any) => ({
        id: report.id,
        reporter: report.profiles?.full_name || report.profiles?.username || "Unknown User",
        listing_title: report.listings?.title || "Unknown Listing",
        reason: report.reason,
        status: report.status,
        created_at: report.created_at,
      }));
      
      setReports(mappedReports);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: number, newStatus: string) => {
    const { error } = await supabase
      .from("moderation_flags")
      .update({ status: newStatus })
      .eq("id", reportId);
    
    if (!error) {
      // Update local state
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
    }
  };

  const takeModerationAction = async (reportId: number, action: string) => {
    // In a real implementation, you would take specific actions based on the action parameter
    // For example, suspending a listing or warning a user
    console.log(`Taking moderation action: ${action} for report ID: ${reportId}`);
    
    // Update the report status to "closed"
    await updateReportStatus(reportId, "closed");
    
    // Show a success message
    alert(`Moderation action "${action}" taken successfully!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("admin.reportsManagement")}</h2>
      
      {/* Reports Table */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">{t("admin.reports")}</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-foreground">{t("admin.noReportsFound")}</h3>
            <p className="mt-1 text-muted-foreground">{t("admin.noReportsToDisplay")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.reportID")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.reporter")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.listing")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.reason")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.status")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.date")}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-4 py-3 text-sm text-foreground">#{report.id}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{report.reporter}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{report.listing_title}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{report.reason}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === "open" 
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "reviewing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {t(`admin.status_${report.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="px-3 py-1 rounded text-xs bg-green-100 text-green-800 hover:bg-green-200 flex items-center"
                          onClick={() => updateReportStatus(report.id, "reviewing")}
                          disabled={report.status !== "open"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {t("admin.markReviewed")}
                        </button>
                        <div className="relative group inline-block">
                          <button
                            className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200 flex items-center disabled:opacity-50"
                            disabled={report.status === "closed"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {t("admin.takeAction")}
                          </button>
                          <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-10 hidden group-hover:block">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                              onClick={() => takeModerationAction(report.id, "suspend_listing")}
                            >
                              {t("admin.suspendListing")}
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                              onClick={() => takeModerationAction(report.id, "warn_user")}
                            >
                              {t("admin.warnUser")}
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                              onClick={() => takeModerationAction(report.id, "remove_listing")}
                            >
                              {t("admin.removeListing")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}