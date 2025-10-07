// src/hooks/useAuth.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

export const useSetupAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (setupData) => authService.setupAccount(setupData),
    onSuccess: (response) => {
      toast.success(
        response.data?.message || "Account setup completed successfully!"
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Account setup failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (response) => {
      // Store tokens and user data
      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update React Query cache
      queryClient.setQueryData(["current-user"], user);

      toast.success(`Welcome back, ${user.username}!`);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed";
      toast.error(errorMessage);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("refresh_token");

      // Clear React Query cache
      queryClient.clear();

      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Still clear local data even if API call fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("refresh_token");
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        throw new Error("No user data found");
      }
      return JSON.parse(userData);
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (response) => {
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      // Redirect to login or handle token expiration
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData) => authService.changePassword(passwordData),
    onSuccess: (response) => {
      toast.success(response.data?.message || "Password changed successfully");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to change password";
      toast.error(errorMessage);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
    onSuccess: (response) => {
      toast.success(
        response.data?.message ||
          "Password reset instructions sent to your email"
      );
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to send reset instructions";
      toast.error(errorMessage);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (resetData) => authService.resetPassword(resetData),
    onSuccess: (response) => {
      toast.success(response.data?.message || "Password reset successfully");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to reset password";
      toast.error(errorMessage);
    },
  });
};

// Verify setup token validity
export const useVerifySetupToken = (token) => {
  return useQuery({
    queryKey: ["verify-setup-token", token],
    queryFn: () => authService.verifySetupToken(token),
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => authService.updateProfile(profileData),
    onSuccess: (response) => {
      const updatedUser = response.data?.user;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        queryClient.setQueryData(["current-user"], updatedUser);
      }

      toast.success(response.data?.message || "Profile updated successfully");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update profile";
      toast.error(errorMessage);
    },
  });
};
