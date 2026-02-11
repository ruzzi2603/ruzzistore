"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
  lastLoginAt?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3002";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    loadUsers();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Login falhou");
      }
      const data = await res.json();
      const accessToken = data?.accessToken;
      if (!accessToken) throw new Error("Token invalido");
      localStorage.setItem("admin_token", accessToken);
      setToken(accessToken);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Falha ao carregar usuarios");
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setUsers([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="text-3xl font-semibold">RuzziStore Admin</h1>
          </div>
          {token && (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              Sair
            </button>
          )}
        </header>

        {!token ? (
          <form
            onSubmit={handleLogin}
            className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Login</h2>
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2"
            />
            <label className="text-sm text-slate-400 mt-4 block">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2"
            />
            {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-lg bg-cyan-400 text-slate-900 py-2 font-semibold hover:bg-cyan-300 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={loadUsers}
                disabled={loading}
                className="rounded-lg bg-cyan-400 text-slate-900 px-4 py-2 font-semibold hover:bg-cyan-300 disabled:opacity-60"
              >
                {loading ? "Carregando..." : "Carregar usuarios"}
              </button>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="text-left px-4 py-3">Nome</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Criado</th>
                    <th className="text-left px-4 py-3">Ultimo login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-slate-500">
                        Nenhum usuario carregado.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-t border-white/5">
                        <td className="px-4 py-3">{u.name || "-"}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{new Date(u.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
