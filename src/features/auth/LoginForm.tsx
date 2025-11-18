"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useAuth from "@/hooks/useAuth";

export default function LoginForm() {
  const { login, isAuthenticating } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <Input label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button type="submit" disabled={isAuthenticating}>
        {isAuthenticating ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
