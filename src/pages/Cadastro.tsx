import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HeartHandshake, UserPlus } from "lucide-react";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    if (senha !== confirmarSenha) {
      setErro("As senhas informadas não são iguais.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    setMensagem(
      "Dados validados! O envio do cadastro será habilitado na integração com a API."
    );
  }

  return (
    <main className="relative isolate flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-teal-50 px-5 py-12">

      <div className="absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 -z-10 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="w-full max-w-md">

        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-700"
        >
          <ArrowLeft size={17} />
          Voltar para o início
        </Link>

        <div className="rounded-3xl border border-violet-100 bg-white p-7 shadow-xl shadow-violet-100/60 sm:p-9">

          <div className="mb-7 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <HeartHandshake size={34} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Crie sua conta
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Faça parte do Mind Connect e tenha acesso aos nossos
              recursos de cuidado e acolhimento.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="nome"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nome completo
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value);
                  setErro("");
                  setMensagem("");
                }}
                placeholder="Digite seu nome completo"
                maxLength={100}
                autoComplete="name"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErro("");
                  setMensagem("");
                }}
                placeholder="seuemail@exemplo.com"
                maxLength={150}
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Senha
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(event) => {
                  setSenha(event.target.value);
                  setErro("");
                  setMensagem("");
                }}
                placeholder="Crie uma senha"
                minLength={8}
                autoComplete="new-password"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                A senha deve possuir pelo menos 8 caracteres.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmarSenha"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirmar senha
              </label>

              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(event) => {
                  setConfirmarSenha(event.target.value);
                  setErro("");
                  setMensagem("");
                }}
                placeholder="Digite sua senha novamente"
                minLength={8}
                autoComplete="new-password"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {erro}
              </div>
            )}

            {mensagem && (
              <div
                role="status"
                className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-700"
              >
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-800 hover:shadow-xl"
            >
              <UserPlus size={19} />
              Criar minha conta
            </button>

          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Ao criar uma conta, você poderá acessar os recursos
              personalizados do Mind Connect.
            </p>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Mind Connect — Conectando pessoas ao cuidado.
        </p>

      </div>
    </main>
  );
}

export default Cadastro;