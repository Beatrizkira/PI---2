'use client';

import HeaderOne from "@/components/header/HeaderOne";
import FooterOne from "@/components/footer/Footer";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await api.register(form.name, form.email, form.password);
      router.push("/user-account");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível criar a conta.");
    }
  }
  return <div className="demo-one"><HeaderOne /><div className="rts-register-area rts-section-gap bg_light-1"><div className="container"><div className="registration-wrapper-1"><h3 className="title">Crie sua conta</h3><form className="registration-form" onSubmit={submit}><div className="input-wrapper"><label htmlFor="name">Nome*</label><input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div><div className="input-wrapper"><label htmlFor="email">E-mail*</label><input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div><div className="input-wrapper"><label htmlFor="password">Senha (mínimo 8 caracteres)*</label><input id="password" type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>{error && <p role="alert">{error}</p>}<button className="rts-btn btn-primary">Criar conta</button><p>Já tem uma conta? <Link href="/login">Entrar</Link></p></form></div></div></div><FooterOne /></div>;
}
