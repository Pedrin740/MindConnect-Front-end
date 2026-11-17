import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Check, Eye, EyeOff, LockKeyhole, Mail, Moon, Sun, Monitor, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme, type Theme } from "../context/ThemeContext";
import { ApiError } from "../services/api";

const opcoesTema: {
  valor: Theme;
  titulo: string;
  descricao: string;
  Icone: typeof Sun;
}[] = [
  {
    valor: "claro",
    titulo: "Claro",
    descricao: "Visual tradicional e luminoso.",
    Icone: Sun,
  },
  {
    valor: "intermediario",
    titulo: "Intermediário",
    descricao: "Tons neutros e contraste moderado.",
    Icone: Monitor,
  },
  {
    valor: "escuro",
    titulo: "Escuro",
    descricao: "Interface escura para ambientes com pouca luz.",
    Icone: Moon,
  },
];

function mensagemErro(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}

export default function Configuracoes() {
  const {
    user,
    atualizarConta,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState(user?.email ?? "");
  const [senhaAtualEmail, setSenhaAtualEmail] = useState("");

  const [senhaAtualSenha, setSenhaAtualSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenhas, setMostrarSenhas] = useState(false);

  const [salvandoEmail, setSalvandoEmail] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const [mensagemEmail, setMensagemEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");

  const [mensagemSenha, setMensagemSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const temaEscuro = theme === "escuro";
  const temaIntermediario = theme === "intermediario";

  const fundoPagina = temaEscuro
    ? "bg-slate-950"
    : temaIntermediario
      ? "bg-slate-200"
      : "bg-slate-50";

  const fundoCard = temaEscuro
    ? "border-slate-700 bg-slate-900"
    : temaIntermediario
      ? "border-slate-300 bg-slate-50"
      : "border-slate-200 bg-white";

  const textoPrincipal = temaEscuro
    ? "text-slate-100"
    : "text-slate-900";

  const textoSecundario = temaEscuro
    ? "text-slate-300"
    : "text-slate-600";

  const textoCampo = temaEscuro
    ? "text-slate-200"
    : "text-slate-700";

  const estiloInput = temaEscuro
    ? "border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-900"
    : "border-slate-200 bg-white text-slate-800 focus:border-violet-500 focus:ring-violet-100";

  async function salvarEmail(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErroEmail("");
    setMensagemEmail("");

    if (!email.trim() || !senhaAtualEmail) {
      setErroEmail(
        "Informe o novo e-mail e sua senha atual."
      );
      return;
    }

    if (
      email.trim().toLowerCase() ===
      user?.email.toLowerCase()
    ) {
      setErroEmail(
        "O novo e-mail é igual ao e-mail atual."
      );
      return;
    }

    setSalvandoEmail(true);

    try {
      await atualizarConta(email, senhaAtualEmail);

      setEmail(email.trim().toLowerCase());
      setSenhaAtualEmail("");

      setMensagemEmail(
        "E-mail atualizado com sucesso."
      );
    } catch (error) {
      setErroEmail(mensagemErro(error));
    } finally {
      setSalvandoEmail(false);
    }
  }

  async function salvarSenha(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErroSenha("");
    setMensagemSenha("");

    if (
      !senhaAtualSenha ||
      !novaSenha ||
      !confirmarSenha
    ) {
      setErroSenha(
        "Preencha todos os campos de senha."
      );
      return;
    }

    if (
      novaSenha.length < 6 ||
      novaSenha.length > 72
    ) {
      setErroSenha(
        "A nova senha deve ter entre 6 e 72 caracteres."
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha(
        "A confirmação não corresponde à nova senha."
      );
      return;
    }

    if (novaSenha === senhaAtualSenha) {
      setErroSenha(
        "A nova senha deve ser diferente da senha atual."
      );
      return;
    }

    setSalvandoSenha(true);

    try {
      await atualizarConta(
        user?.email ?? "",
        senhaAtualSenha,
        novaSenha
      );

      setSenhaAtualSenha("");
      setNovaSenha("");
      setConfirmarSenha("");

      setMensagemSenha(
        "Senha atualizada com sucesso."
      );
    } catch (error) {
      setErroSenha(mensagemErro(error));
    } finally {
      setSalvandoSenha(false);
    }
  }

  if (isLoading) {
    return (
      <div
        className={`flex min-h-[60vh] items-center justify-center ${fundoPagina} ${textoSecundario}`}
      >
        Carregando configurações...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const campoSenha = `w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 ${estiloInput}`;

  return (
    <section
      className={`min-h-[calc(100vh-76px)] px-4 py-10 transition-colors duration-300 sm:px-6 lg:px-8 ${fundoPagina}`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-violet-700">
            Minha conta
          </p>

          <h1
            className={`text-3xl font-bold tracking-tight ${textoPrincipal}`}
          >
            Configurações
          </h1>

          <p className={`mt-2 ${textoSecundario}`}>
            Gerencie sua aparência e mantenha seus dados
            de acesso atualizados.
          </p>
        </div>

        <div
          className={`mb-6 flex items-center gap-4 rounded-2xl border p-5 shadow-sm ${fundoCard}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <UserRound size={23} />
          </div>

          <div className="min-w-0">
            <p className={`font-semibold ${textoPrincipal}`}>
              {user.nome}
            </p>

            <p
              className={`truncate text-sm ${
                temaEscuro ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {user.email}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Aparência */}

          <section
            className={`rounded-2xl border p-6 shadow-sm lg:col-span-2 ${fundoCard}`}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <Sun size={21} />
              </div>

              <div>
                <h2
                  className={`text-lg font-semibold ${textoPrincipal}`}
                >
                  Aparência
                </h2>

                <p className={`text-sm ${textoSecundario}`}>
                  Escolha como o Mind Connect será exibido.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {opcoesTema.map(
                ({
                  valor,
                  titulo,
                  descricao,
                  Icone,
                }) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setTheme(valor)}
                    aria-pressed={theme === valor}
                    className={`rounded-xl border p-4 text-left transition ${
                      theme === valor
                        ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                        : temaEscuro
                          ? "border-slate-700 hover:border-violet-500 hover:bg-slate-800"
                          : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Icone
                        className="text-violet-700"
                        size={21}
                      />

                      {theme === valor && (
                        <Check
                          className="text-violet-700"
                          size={19}
                        />
                      )}
                    </div>

                    <p
                      className={`font-semibold ${
                        theme === valor
                          ? "text-slate-900"
                          : textoPrincipal
                      }`}
                    >
                      {titulo}
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        theme === valor
                          ? "text-slate-600"
                          : textoSecundario
                      }`}
                    >
                      {descricao}
                    </p>
                  </button>
                )
              )}
            </div>
          </section>

          {/* Alteração de e-mail */}

          <section
            className={`rounded-2xl border p-6 shadow-sm ${fundoCard}`}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <Mail size={21} />
              </div>

              <div>
                <h2
                  className={`text-lg font-semibold ${textoPrincipal}`}
                >
                  Alterar e-mail
                </h2>

                <p className={`text-sm ${textoSecundario}`}>
                  Atualize o endereço usado para entrar.
                </p>
              </div>
            </div>

            <form
              onSubmit={salvarEmail}
              className="space-y-4"
            >
              <label
                className={`block text-sm font-medium ${textoCampo}`}
              >
                Novo e-mail

                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 ${estiloInput}`}
                />
              </label>

              <label
                className={`block text-sm font-medium ${textoCampo}`}
              >
                Senha atual

                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senhaAtualEmail}
                  onChange={(event) =>
                    setSenhaAtualEmail(event.target.value)
                  }
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 ${estiloInput}`}
                />
              </label>

              {erroEmail && (
                <p role="alert" className="text-sm text-red-600">
                  {erroEmail}
                </p>
              )}

              {mensagemEmail && (
                <p
                  role="status"
                  className="text-sm text-emerald-600"
                >
                  {mensagemEmail}
                </p>
              )}

              <button
                type="submit"
                disabled={salvandoEmail}
                className="w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvandoEmail
                  ? "Salvando..."
                  : "Salvar novo e-mail"}
              </button>
            </form>
          </section>

          {/* Alteração de senha */}

          <section
            className={`rounded-2xl border p-6 shadow-sm ${fundoCard}`}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <LockKeyhole size={21} />
              </div>

              <div>
                <h2
                  className={`text-lg font-semibold ${textoPrincipal}`}
                >
                  Alterar senha
                </h2>

                <p className={`text-sm ${textoSecundario}`}>
                  Use uma senha forte e exclusiva.
                </p>
              </div>
            </div>

            <form
              onSubmit={salvarSenha}
              className="space-y-4"
            >
              <label
                className={`block text-sm font-medium ${textoCampo}`}
              >
                Senha atual

                <div className="relative mt-2">
                  <input
                    type={mostrarSenhas ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={senhaAtualSenha}
                    onChange={(event) =>
                      setSenhaAtualSenha(event.target.value)
                    }
                    className={campoSenha}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenhas((atual) => !atual)
                    }
                    aria-label={
                      mostrarSenhas
                        ? "Ocultar senhas"
                        : "Mostrar senhas"
                    }
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      temaEscuro
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {mostrarSenhas ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <label
                className={`block text-sm font-medium ${textoCampo}`}
              >
                Nova senha

                <input
                  type={mostrarSenhas ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  maxLength={72}
                  value={novaSenha}
                  onChange={(event) =>
                    setNovaSenha(event.target.value)
                  }
                  className={`mt-2 ${campoSenha}`}
                />
              </label>

              <label
                className={`block text-sm font-medium ${textoCampo}`}
              >
                Confirmar nova senha

                <input
                  type={mostrarSenhas ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  maxLength={72}
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(event.target.value)
                  }
                  className={`mt-2 ${campoSenha}`}
                />
              </label>

              {erroSenha && (
                <p role="alert" className="text-sm text-red-600">
                  {erroSenha}
                </p>
              )}

              {mensagemSenha && (
                <p
                  role="status"
                  className="text-sm text-emerald-600"
                >
                  {mensagemSenha}
                </p>
              )}

              <button
                type="submit"
                disabled={salvandoSenha}
                className="w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvandoSenha
                  ? "Salvando..."
                  : "Atualizar senha"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}