// src/hooks/useAttendance.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "../services/attendanceService";
import { toast } from "react-toastify";

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["attendance-logs"]);
      queryClient.invalidateQueries(["today-attendance"]);
      queryClient.invalidateQueries(["employee-attendance"]);
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["attendance-logs"]);
      queryClient.invalidateQueries(["today-attendance"]);
      queryClient.invalidateQueries(["employee-attendance"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Clock out failed";
      toast.error(errorMessage);
    },
  });
};

export const useAttendanceLogs = (filters) => {
  return useQuery({
    queryKey: ["attendance-logs", filters],
    queryFn: () => attendanceService.getLogs(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployeeAttendance = (employeeId, filters) => {
  return useQuery({
    queryKey: ["employee-attendance", employeeId, filters],
    queryFn: () => attendanceService.getEmployeeAttendance(employeeId, filters),
    enabled: !!employeeId,
    select: (response) => response.data,
  });
};

// NEW: Hook for today's attendance
export const useTodayAttendance = (filters) => {
  return useQuery({
    queryKey: ["today-attendance", filters],
    queryFn: () =>
      attendanceService.getLogs({
        ...filters,
        start_date:
          filters?.start_date || new Date().toISOString().split("T")[0],
        end_date: filters?.end_date || new Date().toISOString().split("T")[0],
      }),
    select: (response) => response.data,
    refetchOnWindowFocus: true,
  });
};

// NEW: Hook for attendance statistics
export const useAttendanceStats = (employeeId, params) => {
  return useQuery({
    queryKey: ["attendance-stats", employeeId, params],
    queryFn: () => attendanceService.getStats(employeeId, params),
    enabled: !!employeeId,
    select: (response) => response.data,
  });
};

// NEW: Hook for creating attendance manually (admin only)
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.createAttendance,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["attendance-logs"]);
      queryClient.invalidateQueries(["employee-attendance"]);
      toast.success(
        response.data?.message || "Attendance record created successfully"
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create attendance record";
      toast.error(errorMessage);
    },
  });
};

// NEW: Hook for updating attendance (admin only)
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => attendanceService.updateAttendance(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["attendance-logs"]);
      queryClient.invalidateQueries(["employee-attendance"]);
      toast.success(
        response.data?.message || "Attendance record updated successfully"
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update attendance record";
      toast.error(errorMessage);
    },
  });
};

// NEW: Hook for bulk operations
export const useBulkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.bulkOperation,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["attendance-logs"]);
      queryClient.invalidateQueries(["employee-attendance"]);
      toast.success(
        response.data?.message || "Bulk operation completed successfully"
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Bulk operation failed";
      toast.error(errorMessage);
    },
  });
};
