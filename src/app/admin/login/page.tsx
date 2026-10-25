import { loginAction } from "../actions";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="login">
      <form action={loginAction} className="card">
        <h1>GuardianTag Admin</h1>
        {error && <p className="err">Wrong password.</p>}
        <input type="password" name="password" placeholder="Admin password" autoFocus required />
        <button>Sign in</button>
      </form>
    </div>
  );
}
