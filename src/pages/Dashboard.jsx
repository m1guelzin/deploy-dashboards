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
import { getTodos } from '../axios/axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await getTodos();
        setTodos(t);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    const map = new Map();
    for (const todo of todos) {
      map.set(todo.userId, (map.get(todo.userId) || 0) + 1);
    }
    return map;
  }, [todos]);

  const sortedIds = useMemo(
    () => Array.from(counts.keys()).sort((a, b) => a - b),
    [counts]
  );

  const labels = useMemo(() => sortedIds.map(String), [sortedIds]);
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
      title: { display: true, text: 'Quantidade de TODOS por usuário' },
      legend: { display: false },
      tooltip: { intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'ID do usuário' },
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
      <h2>TODOS por usuário (Tarefas)</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
