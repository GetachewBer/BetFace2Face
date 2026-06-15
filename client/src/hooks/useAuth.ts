import { useState } from 'react';
import axios from 'axios';
import type { RegisterFormData, LoginFormData, AuthResponse } from '../types/auth';

const API = axios.create({ baseURL: '/api' });

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOTP = async (dialCode: string, phoneNumber: string): Promise<AuthResponse | null> => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post<AuthResponse>('/auth/phone/send-otp', { dialCode, phoneNumber });
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndRegister = async (formData: RegisterFormData, otp: string): Promise<AuthResponse | null> => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post<AuthResponse>('/auth/phone/verify-otp', {
        ...formData,
        otp,
      });
      if (data.token) localStorage.setItem('token', data.token);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: LoginFormData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post<AuthResponse>('/auth/phone/login', loginData);
      if (data.token) localStorage.setItem('token', data.token);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  return { sendOTP, verifyOTPAndRegister, login, logout, loading, error };
};