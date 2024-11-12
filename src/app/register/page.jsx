"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Usuario creado exitosamente');
        // Reiniciar los campos de entrada
        setUsername('');
        setPassword('');
      } else {
        alert(data.message || 'Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error en la creación del usuario:', error);
      alert('Ocurrió un error al procesar la solicitud');
    }
  };

  return (
    <div>
      <h2>Crear usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Crear usuario</button>
      </form>
      <Link href="/">
      <button style={{ marginTop: '10px' }}>
        Regresar a Login
      </button>
      </Link>
    </div>
    
  );
}
