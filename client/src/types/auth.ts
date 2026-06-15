export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export interface RegisterFormData {
  fullName: string;
  nickname: string;
  dialCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface LoginFormData {
  phone: string;
  password: string;
}

export interface User {
  id: string;
  phone?: string;
  email?: string;
  fullName: string;
  nickname: string;
  balance: number;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  otp?: string;
}