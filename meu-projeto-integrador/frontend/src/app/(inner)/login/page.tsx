'use client';

import HeaderOne from "@/components/header/HeaderOne";
import FooterOne from "@/components/footer/Footer";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await api.login(email, password);
      router.push(user.role === "ADMIN" ? "/admin-account" : "/user-account");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="demo-one"><HeaderOne /><div className="rts-register-area rts-section-gap bg_light-1"><div className="container"><div className="registration-wrapper-1"><h3 className="title">Acesse sua conta</h3><form className="registration-form" onSubmit={submit}><div className="input-wrapper"><label htmlFor="email">E-mail*</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div className="input-wrapper"><label htmlFor="password">Senha*</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>{error && <p role="alert">{error}</p>}<button className="rts-btn btn-primary" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button><p>Não tem uma conta? <Link href="/register">Cadastre-se</Link></p></form></div></div></div><FooterOne /></div>;
}
