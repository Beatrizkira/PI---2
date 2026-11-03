'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { api, User } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminAccount() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.me().then(({ user: current }) => {
      if (current.role !== 'ADMIN') { router.replace('/user-account'); return; }
      setUser(current);
      setForm({ name: current.name, email: current.email, phone: current.phone || '', address: current.address || '' });
    }).catch(() => router.replace('/login'));
  }, [router]);

  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      const result = await api.updateProfile(form);
      setUser(result.user);
      setMessage('Dados salvos com sucesso.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar.');
    }
  }

  async function logout() { await api.logout(); router.push('/login'); }
  if (!user) return <div className="account-tab-area-start rts-section-gap"><div className="container-2">Carregando...</div></div>;

  return <div className="account-tab-area-start rts-section-gap"><div className="container-2"><div className="row"><div className="col-lg-3"><div className="nav accout-dashborard-nav flex-column nav-pills me-3"><button className="nav-link active">Painel</button><button className="nav-link" onClick={() => document.getElementById('account-details')?.scrollIntoView()}>Dados da conta</button><Link className="nav-link" href="/estoque">Estoque</Link><button className="nav-link" onClick={logout}>Sair</button></div></div><div className="col-lg-9 pl--50"><div className="dashboard-account-area"><h2 className="title">Olá, {user.name}!</h2><p className="disc">Gerencie seus dados de conta abaixo.</p></div><form id="account-details" className="account-details-area" onSubmit={save}><h2 className="title">Dados da conta</h2><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" required /><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="E-mail" required /><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefone" /><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Endereço" />{message && <p role="status">{message}</p>}<button className="rts-btn btn-primary">Salvar alterações</button></form></div></div></div></div>;
}
