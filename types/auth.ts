export interface User {
  userId: string;

  email: string;

  isVip: boolean;

  role: string;
}

export interface AuthContextType {
  user: User | null;

  token: string | null;

  loading: boolean;

  login: (
    token: string,
  ) => void;

  logout: () => void;
}