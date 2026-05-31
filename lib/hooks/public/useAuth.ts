import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SendOtpPayload,
  VerifyOtpPayload,
  ResetPasswordOtpPayload,
  GoogleCallbackPayload,
} from '@/lib/types';

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetch the currently authenticated user. */
export function useAuthUser() {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const res = await api.get('/api/auth/user');
      return res.data.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Login with email + password. */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await api.post('/api/auth/login', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}

/** Register a new customer account. */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await api.post('/api/auth/register', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}

/** Logout the current session. */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/auth/logout');
      return res.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

/** Update the authenticated user's profile. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await api.put('/api/auth/profile', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
  });
}

/** Change the authenticated user's password. */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const res = await api.put('/api/auth/password', payload);
      return res.data;
    },
  });
}

/** Send a password-reset link to the given email. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const res = await api.post('/api/auth/forgot-password', payload);
      return res.data;
    },
  });
}

/** Reset password using a token from the reset email. */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const res = await api.post('/api/auth/reset-password', payload);
      return res.data;
    },
  });
}

/** Send an OTP for password reset. */
export function useSendOtp() {
  return useMutation({
    mutationFn: async (payload: SendOtpPayload) => {
      const res = await api.post('/api/auth/send-otp', payload);
      return res.data;
    },
  });
}

/** Send an OTP for new account registration. */
export function useSendRegistrationOtp() {
  return useMutation({
    mutationFn: async (payload: SendOtpPayload) => {
      const res = await api.post('/api/auth/send-registration-otp', payload);
      return res.data;
    },
  });
}

/** Verify an OTP code. */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const res = await api.post('/api/auth/verify-otp', payload);
      return res.data;
    },
  });
}

/** Reset password using a verified OTP. */
export function useResetPasswordOtp() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordOtpPayload) => {
      const res = await api.post('/api/auth/reset-password-otp', payload);
      return res.data;
    },
  });
}

/** Authenticate via Google OAuth. */
export function useGoogleCallback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GoogleCallbackPayload) => {
      const res = await api.post('/api/auth/google/callback', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}
