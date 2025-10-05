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
      toast.success(response.data?.message || "Clock in successful");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Clock in failed");
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["attendance-logs"]);
      toast.success(response.data?.message || "Clock out successful");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Clock out failed");
    },
  });
};

export const useAttendanceLogs = (filters) => {
  return useQuery({
    queryKey: ["attendance-logs", filters],
    queryFn: () => attendanceService.getLogs(filters),
    select: (response) => response.data,
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
