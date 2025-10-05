// src/hooks/useDepartments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../services/departmentService";
import { toast } from "react-toastify";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentService.getAll(),
  });
};

export const useDepartment = (id) => {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentService.getById(id),
    enabled: !!id,
  });
};

export const useActiveDepartments = () => {
  return useQuery({
    queryKey: ["departments", "active"],
    queryFn: () => departmentService.getActive(),
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      toast.success("Department created successfully");
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      toast.success("Department deleted successfully");
    },
  });
};
