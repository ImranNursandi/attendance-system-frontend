// src/hooks/useEmployees.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../services/employeeService";
import { toast } from "react-toastify";

export const useEmployees = (params) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => employeeService.getAll(params),
    keepPreviousData: true,
  });
};

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeeService.getById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => employeeService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.delete,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["employees"]);
      toast.success(response.data?.message || "Employee deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete employee");
    },
  });
};
