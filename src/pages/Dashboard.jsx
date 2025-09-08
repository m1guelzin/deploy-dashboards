import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { getTodos, getUsers } from '../axios/axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function DashboardV2() {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([getTodos(), getUsers()]);
        setTodos(t);
        setUsers(u);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Conta TODOS por userId
  const counts = useMemo(() => {
    const map = new Map();
    for (const todo of todos) {
      map.set(todo.userId, (map.get(todo.userId) || 0) + 1);
    }
    return map;
  }, [todos]);

  // Mapa userId → name
  const idToName = useMemo(() => {
    const map = new Map();
    for (const u of users) {
      map.set(u.id, u.name);
    }
    return map;
  }, [users]);

  const sortedIds = useMemo(
    () => Array.from(counts.keys()).sort((a, b) => a - b),
    [counts]
  );

  // Agora os labels serão os nomes
  const labels = useMemo(
    () => sortedIds.map(id => idToName.get(id) || `User ${id}`),
    [sortedIds, idToName]
  );

  const values = useMemo(() => sortedIds.map(id => counts.get(id)), [sortedIds, counts]);

  const data = {
    labels,
    datasets: [
      {
        label: 'TODOS por usuário',
        data: values,
        backgroundColor: 'red',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Quantidade de TODOS por usuário (nomes)' },
      legend: { display: false },
      tooltip: { intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Nome do usuário' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Quantidade' },
        ticks: { precision: 0 },
      },
    },
  };

  if (loading) return <p>Carregando...</p>;
  if (err) return <p>Erro: {err}</p>;

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h2>TODOS por usuário (nomes)</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
