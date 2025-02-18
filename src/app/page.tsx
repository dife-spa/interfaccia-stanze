// app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [idStanza, setIdStanza] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !idStanza) {
      setError('Entrambi i campi sono obbligatori');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, idStanza }),
      });
      if (res.ok) {
        // On successful login, redirect to the interface page.
        router.push('/interface');
      } else {
        const data = await res.json();
        setError(data.error || 'Credenziali non valide');
      }
    } catch (err) {
      setError('Errore di connessione');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl text-white mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="idStanza" className="block text-white text-sm font-bold mb-2">
            Id Stanza
          </label>
          <input
            type="text"
            id="idStanza"
            value={idStanza}
            onChange={(e) => setIdStanza(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-white text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Accedi
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
