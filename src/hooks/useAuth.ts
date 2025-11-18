"use client";

import { useCallback, useState } from "react";

interface Credentials {
  email: string;
  password: string;
}

export default function useAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = useCallback(async ({ email }: Credentials) => {
    setIsAuthenticating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuthenticating(false);
    console.info(`Usuario autenticado: ${email}`);
  }, []);

  return {
    login,
    isAuthenticating,
  };
}
