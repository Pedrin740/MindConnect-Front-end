import { useState } from "react";
import { Mail, MessageCircle, HeartHandshake, Send, Sparkles, CheckCircle2, AlertCircle, LoaderCircle } from "lucide-react";
import { ApiError } from "../services/api";
import { enviarContato } from "../services/contatoService";

type FormularioContato = {
  nome: string;
  email: string;
  motivo: string;
  mensagem: string;
};

const formularioInicial: FormularioContato = {
  nome: "",
  email: "",
  motivo: "",
  mensagem: "",
};

// Exige domínio com pelo menos dois caracteres antes da extensão.
const EMAIL_VALIDO =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@(?:[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])(?:\.[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])*\.[A-Za-z]{2,63}$/;

export default function Contato() {
  const [formulario, setFormulario] =
    useState<FormularioContato>(formularioInicial);

  const [mensagemStatus, setMensagemStatus] = useState("");
  const [tipoStatus, setTipoStatus] = useState<"sucesso" | "erro" | "">("");
  const [enviando, setEnviando] = useState(false);

  function atualizarCampo(
    campo: keyof FormularioContato,
    valor: string
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));

    setMensagemStatus("");
    setTipoStatus("");
  }

  function limparFormulario() {
    if (enviando) return;

    setFormulario(formularioInicial);
    setMensagemStatus("");
    setTipoStatus("");
  }

  async function enviarFormulario(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (enviando) return;

    const email = formulario.email.trim();

    if (!EMAIL_VALIDO.test(email)) {
      setTipoStatus("erro");
      setMensagemStatus(
        "Informe um endereço de e-mail válido. Exemplo: usuario@gmail.com."
      );
      return;
    }

    setEnviando(true);
    setMensagemStatus("");
    setTipoStatus("");

    try {
      await enviarContato({
        nome: formulario.nome.trim(),
        email,
        motivo: formulario.motivo,
        mensagem: formulario.mensagem.trim(),
      });

      setFormulario(formularioInicial);
      setTipoStatus("sucesso");
      setMensagemStatus(
        "Sua mensagem foi enviada com sucesso! Agradecemos por entrar em contato com o Mind Connect."
      );
    } catch (erro) {
      setTipoStatus("erro");

      if (erro instanceof ApiError) {
        setMensagemStatus(erro.message);
      } else {
        setMensagemStatus(
          "Não foi possível enviar sua mensagem. Tente novamente em alguns instantes."
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9 lg:p-10">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
              <Sparkles size={16} />
              Fale conosco
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Contato
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              Envie sua dúvida, sugestão ou feedback sobre o
              Mind Connect. Sua participação é importante para
              aprimorarmos a plataforma.
            </p>
          </div>

          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Área ilustrativa */}
            <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-teal-50 p-8">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-violet-100/70 blur-2xl" />

              <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-teal-100/70 blur-2xl" />

              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-400 shadow-xl shadow-violet-200">
                <HeartHandshake
                  size={88}
                  strokeWidth={1.5}
                  className="text-white"
                />
              </div>

              <div className="relative mt-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Estamos aqui para ajudar
                </h2>

                <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">
                  Compartilhe suas dúvidas e sugestões. Queremos
                  tornar o acesso à informação e ao acolhimento
                  cada vez melhor.
                </p>
              </div>

              <div className="relative mt-8 grid w-full max-w-sm grid-cols-2 gap-4">
                <div className="flex flex-col items-center rounded-xl border border-violet-100 bg-white/80 p-4 text-center">
                  <MessageCircle
                    size={25}
                    className="text-violet-700"
                  />
                  <span className="mt-2 text-sm font-semibold text-slate-700">
                    Dúvidas
                  </span>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-teal-100 bg-white/80 p-4 text-center">
                  <Mail size={25} className="text-teal-600" />
                  <span className="mt-2 text-sm font-semibold text-slate-700">
                    Sugestões
                  </span>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form
              onSubmit={enviarFormulario}
              className="flex flex-col gap-5"
            >
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Nome
                </label>

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  autoComplete="name"
                  value={formulario.nome}
                  disabled={enviando}
                  onChange={(event) =>
                    atualizarCampo("nome", event.target.value)
                  }
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={150}
                  autoComplete="email"
                  value={formulario.email}
                  disabled={enviando}
                  onChange={(event) =>
                    atualizarCampo("email", event.target.value)
                  }
                  placeholder="Seu e-mail"
                  title="Informe um e-mail válido, como usuario@gmail.com."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="motivo"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Motivo
                </label>

                <select
                  id="motivo"
                  name="motivo"
                  required
                  value={formulario.motivo}
                  disabled={enviando}
                  onChange={(event) =>
                    atualizarCampo("motivo", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="" disabled>
                    Selecione o motivo
                  </option>
                  <option value="Duvida">Dúvida</option>
                  <option value="Sugestao">Sugestão</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Problema">Relatar um problema</option>
                  <option value="Parceria">Parceria</option>
                  <option value="Outro">Outro assunto</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="mensagem"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Mensagem
                </label>

                <textarea
                  id="mensagem"
                  name="mensagem"
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  value={formulario.mensagem}
                  disabled={enviando}
                  onChange={(event) =>
                    atualizarCampo("mensagem", event.target.value)
                  }
                  placeholder="Digite sua mensagem"
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {formulario.mensagem.length}/1000 caracteres
                </p>
              </div>

              {mensagemStatus && (
                <div
                  role={tipoStatus === "erro" ? "alert" : "status"}
                  className={`flex items-start gap-2 rounded-xl border p-4 text-sm leading-6 ${
                    tipoStatus === "sucesso"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {tipoStatus === "sucesso" ? (
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0"
                    />
                  ) : (
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0"
                    />
                  )}

                  <span>{mensagemStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={enviando}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white shadow-md shadow-violet-100 transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enviando ? (
                    <>
                      Enviando...
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                    </>
                  ) : (
                    <>
                      Enviar
                      <Send size={17} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={limparFormulario}
                  disabled={enviando}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
