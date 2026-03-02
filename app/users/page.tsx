type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default async function UsersPage() {
  const res = await fetch('http://127.0.0.1:3001/users', {
    cache: 'no-store',
  });

  const users: User[] = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
}