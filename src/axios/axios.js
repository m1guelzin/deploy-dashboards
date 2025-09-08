const API = 'https://jsonplaceholder.typicode.com';

export async function getTodos() {
  const res = await fetch(`${API}/todos`);
  if (!res.ok) throw new Error('Erro ao buscar TODOS');
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API}/users`);
  if (!res.ok) throw new Error('Erro ao buscar USERS');
  return res.json();
}