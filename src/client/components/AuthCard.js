import Header from "./Header";

// One shared shell for login, forgot password and reset password pages
export default function AuthCard({ title, subtitle, children }) {
  return (
    <>
      <Header />
      <main className="mx-auto mt-14 max-w-md px-5">
        <div className="rounded-3xl border border-line bg-white p-8 shadow-xl shadow-brand/5">
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="mb-5 mt-1 text-sm text-ink/60">{subtitle}</p>
          {children}
        </div>
      </main>
    </>
  );
}
