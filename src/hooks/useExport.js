// src/hooks/useExport.js
import { useState } from "react";
import { reportService } from "../services/reportService";
import { toast } from "react-toastify";

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const exportAttendanceReport = async (filters, format = "excel") => {
    setIsExporting(true);
    try {
      const response = await reportService.exportAttendanceReport({
        ...filters,
        format: format,
      });

      const filename = `attendance-report-${filters.start_date}-to-${
        filters.end_date
      }.${format === "excel" ? "xlsx" : "csv"}`;
      downloadFile(response.data, filename);
      toast.success("Attendance report exported successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to export attendance report"
      );
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportSummaryReport = async (filters, format = "excel") => {
    setIsExporting(true);
    try {
      const response = await reportService.exportSummaryReport({
        ...filters,
        format: format,
      });

      const filename = `summary-report-${filters.start_date}-to-${
        filters.end_date
      }.${format === "excel" ? "xlsx" : "csv"}`;
      downloadFile(response.data, filename);
      toast.success("Summary report exported successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to export summary report"
      );
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportDepartmentReport = async (
    departmentId,
    filters,
    format = "excel"
  ) => {
    setIsExporting(true);
    try {
      const response = await reportService.exportDepartmentReport(
        departmentId,
        {
          ...filters,
          format: format,
        }
      );

      const filename = `department-${departmentId}-report-${filters.month}-${
        filters.year
      }.${format === "excel" ? "xlsx" : "csv"}`;
      downloadFile(response.data, filename);
      toast.success("Department report exported successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to export department report"
      );
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportAttendanceReport,
    exportSummaryReport,
    exportDepartmentReport,
  };
};
