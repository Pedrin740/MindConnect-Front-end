import { Link } from "react-router-dom";
import { HeartHandshake, BookOpen, Users, Accessibility, MapPinned, NotebookPen, ArrowRight, Sparkles, ShieldCheck, Heart, Lightbulb } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Sobre() {
  const { theme } = useTheme();

  const temaEscuro = theme === "escuro";
  const temaIntermediario = theme === "intermediario";

  const estilos = {
    pagina: temaEscuro
      ? "bg-slate-950 text-slate-100"
      : temaIntermediario
        ? "bg-slate-200 text-slate-900"
        : "bg-gray-50 text-slate-900",

    superficie: temaEscuro
      ? "border-slate-700 bg-slate-900"
      : temaIntermediario
        ? "border-slate-300 bg-slate-100"
        : "border-gray-100 bg-white",

    titulo: temaEscuro ? "text-white" : "text-slate-900",

    descricao: temaEscuro
      ? "text-slate-300"
      : temaIntermediario
        ? "text-slate-700"
        : "text-slate-600",

    card: temaEscuro
      ? "border-slate-700 bg-slate-900 hover:border-violet-700"
      : temaIntermediario
        ? "border-slate-300 bg-white hover:border-violet-300"
        : "border-gray-100 bg-white hover:border-violet-200",

    textoCard: temaEscuro
      ? "text-slate-300"
      : "text-slate-600",

    fundoIcone: temaEscuro
      ? "bg-violet-950 text-violet-300"
      : "bg-violet-50 text-violet-700",

    fundoSecundario: temaEscuro
      ? "bg-slate-900"
      : temaIntermediario
        ? "bg-slate-100"
        : "bg-white",

    borda: temaEscuro
      ? "border-slate-700"
      : temaIntermediario
        ? "border-slate-300"
        : "border-gray-200",
  };

  const pilares = [
    {
      titulo: "Acolhimento",
      descricao:
        "Facilitar a localização de serviços de acolhimento e atendimento disponíveis para a população.",
      icon: HeartHandshake,
      cor: "violet",
    },
    {
      titulo: "Informação",
      descricao:
        "Reunir conteúdos informativos para ampliar o acesso ao conhecimento sobre saúde mental.",
      icon: BookOpen,
      cor: "teal",
    },
    {
      titulo: "Conexão",
      descricao:
        "Aproximar usuários dos recursos e serviços que podem contribuir para seu bem-estar.",
      icon: Users,
      cor: "violet",
    },
    {
      titulo: "Acessibilidade",
      descricao:
        "Organizar informações de maneira simples e acessível, facilitando a navegação pela plataforma.",
      icon: Accessibility,
      cor: "teal",
    },
  ];

  const funcionalidades = [
    {
      titulo: "Serviços de acolhimento",
      descricao:
        "Encontre serviços de atendimento e acolhimento na cidade de São Paulo, utilizando filtros e visualização em mapa.",
      icon: MapPinned,
      link: "/servicos",
      acao: "Encontrar serviços",
      cor: "violet",
    },
    {
      titulo: "Conteúdos informativos",
      descricao:
        "Explore materiais sobre ansiedade, estresse, autocuidado, sono, depressão, prevenção e busca de ajuda.",
      icon: BookOpen,
      link: "/conteudos",
      acao: "Explorar conteúdos",
      cor: "teal",
    },
    {
      titulo: "Diário de bem-estar",
      descricao:
        "Registre sentimentos e experiências para acompanhar sua própria jornada de bem-estar emocional.",
      icon: NotebookPen,
      link: "/diario",
      acao: "Acessar diário",
      cor: "violet",
    },
  ];

  return (
    <main className={`min-h-screen transition-colors duration-300 ${estilos.pagina}`}>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-800 via-violet-700 to-purple-500 px-6 py-20 text-white sm:py-28">
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 -z-10 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <Sparkles size={17} />
              Conheça o Mind Connect
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Conectando pessoas ao{" "}
              <span className="text-teal-200">
                cuidado
              </span>{" "}
              e à informação.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-violet-100 sm:text-lg">
              Uma plataforma desenvolvida para facilitar o acesso
              a informações sobre saúde mental, serviços de
              acolhimento e recursos que podem contribuir para
              o bem-estar emocional.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-violet-800 shadow-lg transition-all hover:-translate-y-1 hover:bg-violet-50"
              >
                Encontrar acolhimento
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/conteudos"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-semibold text-white transition-all hover:bg-white/20"
              >
                Conhecer conteúdos
              </Link>
            </div>
          </div>

          {/* Símbolo da plataforma */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-8">
            <div className="absolute h-72 w-72 rounded-full bg-purple-400/30 blur-2xl sm:h-80 sm:w-80" />

            <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-[3rem] border border-white/30 bg-white/15 shadow-2xl shadow-purple-950/30 backdrop-blur-xl sm:h-80 sm:w-80">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white/15 sm:h-44 sm:w-44">
                <HeartHandshake
                  size={105}
                  strokeWidth={1.4}
                  className="text-white"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
                Mind Connect
              </h2>

              <p className="mt-2 text-center text-sm text-violet-100">
                Conectando pessoas ao cuidado
              </p>

              <div className="absolute -right-5 top-10 rounded-2xl bg-slate-900 p-4 shadow-xl">
                <Heart
                  size={27}
                  className="text-teal-400"
                />
              </div>

              <div className="absolute -bottom-5 -left-5 rounded-2xl bg-slate-900 p-4 shadow-xl">
                <Sparkles
                  size={27}
                  className="text-violet-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
              Nossa plataforma
            </span>

            <h2 className={`mt-4 text-3xl font-bold sm:text-4xl ${estilos.titulo}`}>
              Mais informação, mais acesso e mais acolhimento.
            </h2>

            <p className={`mt-6 text-base leading-8 sm:text-lg ${estilos.descricao}`}>
              O Mind Connect surgiu com o propósito de reunir
              informações e recursos relacionados à saúde mental
              em um único ambiente digital. A plataforma busca
              tornar mais simples a descoberta de serviços de
              acolhimento e o acesso a conteúdos informativos,
              contribuindo para que as pessoas encontrem
              orientações e recursos importantes para sua jornada.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <article className={`rounded-2xl border p-6 shadow-sm transition-colors ${estilos.superficie}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${estilos.fundoIcone}`}>
                <HeartHandshake size={25} />
              </div>

              <h3 className={`mt-5 text-lg font-bold ${estilos.titulo}`}>
                Cuidado
              </h3>

              <p className={`mt-2 text-sm leading-7 ${estilos.descricao}`}>
                Incentivar o acesso a recursos de acolhimento
                e orientação.
              </p>
            </article>

            <article className={`rounded-2xl border p-6 shadow-sm transition-colors ${estilos.superficie}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700`}>
                <Lightbulb size={25} />
              </div>

              <h3 className={`mt-5 text-lg font-bold ${estilos.titulo}`}>
                Conhecimento
              </h3>

              <p className={`mt-2 text-sm leading-7 ${estilos.descricao}`}>
                Reunir informações para ampliar a compreensão
                sobre saúde mental.
              </p>
            </article>

            <article className={`rounded-2xl border p-6 shadow-sm transition-colors ${estilos.superficie}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700`}>
                <ShieldCheck size={25} />
              </div>

              <h3 className={`mt-5 text-lg font-bold ${estilos.titulo}`}>
                Acesso
              </h3>

              <p className={`mt-2 text-sm leading-7 ${estilos.descricao}`}>
                Facilitar a navegação e a descoberta dos
                recursos disponíveis.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className={`border-y px-6 py-20 sm:py-24 ${estilos.borda} ${estilos.fundoSecundario}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              O que oferecemos
            </span>

            <h2 className={`mt-4 text-3xl font-bold sm:text-4xl ${estilos.titulo}`}>
              Recursos para apoiar sua jornada
            </h2>

            <p className={`mt-5 leading-7 ${estilos.descricao}`}>
              Conheça as principais funcionalidades disponíveis
              na plataforma e descubra como elas podem ajudar
              você a encontrar informações e recursos de apoio.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {funcionalidades.map((item) => {
              const Icone = item.icon;

              return (
                <article
                  key={item.titulo}
                  className={`group flex flex-col rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${estilos.card}`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      item.cor === "violet"
                        ? estilos.fundoIcone
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    <Icone size={29} />
                  </div>

                  <h3 className={`mt-6 text-xl font-bold ${estilos.titulo}`}>
                    {item.titulo}
                  </h3>

                  <p className={`mt-3 flex-1 text-sm leading-7 ${estilos.textoCard}`}>
                    {item.descricao}
                  </p>

                  <Link
                    to={item.link}
                    className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-600 transition-all hover:gap-3 hover:text-violet-700"
                  >
                    {item.acao}
                    <ArrowRight size={17} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
              Nossa identidade
            </span>

            <h2 className={`mt-4 text-3xl font-bold sm:text-4xl ${estilos.titulo}`}>
              Os pilares do Mind Connect
            </h2>

            <p className={`mt-5 leading-7 ${estilos.descricao}`}>
              Nossa proposta está fundamentada em quatro pilares
              que orientam a experiência e os objetivos da plataforma.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {pilares.map((pilar, index) => {
              const Icone = pilar.icon;

              return (
                <article
                  key={pilar.titulo}
                  className={`flex gap-5 rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${estilos.card}`}
                >
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    pilar.cor === "violet"
                      ? estilos.fundoIcone
                      : "bg-teal-50 text-teal-700"
                  }`}>
                    <Icone size={29} />
                  </div>

                  <div>
                    <span className="text-xs font-bold tracking-widest text-violet-500">
                      0{index + 1}
                    </span>

                    <h3 className={`mt-1 text-xl font-bold ${estilos.titulo}`}>
                      {pilar.titulo}
                    </h3>

                    <p className={`mt-3 text-sm leading-7 ${estilos.textoCard}`}>
                      {pilar.descricao}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ENCERRAMENTO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-violet-800 via-violet-700 to-purple-600 px-6 py-20 text-center text-white sm:py-24">
        <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="mx-auto max-w-3xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <HeartHandshake size={36} />
          </div>

          <h2 className="mt-7 text-3xl font-bold sm:text-4xl">
            Informação e acolhimento começam com uma conexão.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-violet-100">
            Explore os recursos do Mind Connect e conheça
            as possibilidades disponíveis para encontrar
            informações e serviços de acolhimento.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-violet-800 shadow-lg transition-all hover:-translate-y-1 hover:bg-violet-50"
            >
              Encontrar serviços
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/20"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
