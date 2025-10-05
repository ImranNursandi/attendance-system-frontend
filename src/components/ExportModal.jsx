// src/components/ExportModal.js
import React, { useState, useEffect } from "react";
import { useExport } from "../hooks/useExport";

const ExportModal = ({
  isOpen,
  onClose,
  type,
  filters,
  departmentId,
  departments = [],
}) => {
  const {
    isExporting,
    exportAttendanceReport,
    exportSummaryReport,
    exportDepartmentReport,
  } = useExport();
  const [format, setFormat] = useState("excel");
  const [selectedDepartmentId, setSelectedDepartmentId] =
    useState(departmentId);
  const [exportFilters, setExportFilters] = useState(filters);

  // Update local state when props change
  useEffect(() => {
    setSelectedDepartmentId(departmentId);
    setExportFilters(filters);
  }, [departmentId, filters]);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      switch (type) {
        case "attendance":
          await exportAttendanceReport(exportFilters, format);
          break;
        case "summary":
          await exportSummaryReport(exportFilters, format);
          break;
        case "department":
          if (!selectedDepartmentId) {
            alert("Please select a department");
            return;
          }
          await exportDepartmentReport(
            selectedDepartmentId,
            exportFilters,
            format
          );
          break;
        default:
          throw new Error("Invalid export type");
      }
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "attendance":
        return "Export Attendance Report";
      case "summary":
        return "Export Summary Report";
      case "department":
        return "Export Department Report";
      default:
        return "Export Data";
    }
  };

  const handleFilterChange = (key, value) => {
    setExportFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-gray-800 border border-gray-700 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{getTitle()}</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Department Selection (for department reports) */}
          {type === "department" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-300 font-semibold">
                  Select Department
                </span>
              </label>
              <select
                className="select select-bordered bg-gray-700 border-gray-600 text-white w-full"
                value={selectedDepartmentId || ""}
                onChange={(e) =>
                  setSelectedDepartmentId(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">Choose a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {departments.length === 0 && (
                <div className="text-warning text-sm mt-2">
                  No departments available. Please create departments first.
                </div>
              )}
            </div>
          )}

          {/* Month and Year Selection (for department reports) */}
          {type === "department" && selectedDepartmentId && (
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Month</span>
                </label>
                <select
                  className="select select-bordered bg-gray-700 border-gray-600 text-white"
                  value={exportFilters.month || new Date().getMonth() + 1}
                  onChange={(e) =>
                    handleFilterChange("month", parseInt(e.target.value))
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Year</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered bg-gray-700 border-gray-600 text-white"
                  value={exportFilters.year || new Date().getFullYear()}
                  onChange={(e) =>
                    handleFilterChange("year", parseInt(e.target.value))
                  }
                  min="2020"
                  max="2030"
                />
              </div>
            </div>
          )}

          {/* Date Range (for attendance and summary reports) */}
          {(type === "attendance" || type === "summary") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Start Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered bg-gray-700 border-gray-600 text-white"
                  value={exportFilters.start_date || ""}
                  onChange={(e) =>
                    handleFilterChange("start_date", e.target.value)
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">End Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered bg-gray-700 border-gray-600 text-white"
                  value={exportFilters.end_date || ""}
                  onChange={(e) =>
                    handleFilterChange("end_date", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-300 font-semibold">
                Export Format
              </span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={format === "excel"}
                  onChange={(e) => setFormat(e.target.value)}
                  className="radio radio-primary"
                />
                <span className="text-gray-300">Excel (.xlsx)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={(e) => setFormat(e.target.value)}
                  className="radio radio-primary"
                />
                <span className="text-gray-300">CSV (.csv)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              onClick={onClose}
              className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isExporting}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="btn bg-gradient-to-r from-green-500 to-green-600 border-none text-white hover:from-green-600 hover:to-green-700"
              disabled={
                isExporting || (type === "department" && !selectedDepartmentId)
              }
            >
              {isExporting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Exporting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
