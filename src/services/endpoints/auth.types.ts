export type LoginRequest = {
  phone_number: string;
  password: string;
};

export type User = {
  id: string;
  phone_number: string;
  name: string;
  email: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};
