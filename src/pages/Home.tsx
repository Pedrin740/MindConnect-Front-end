import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  HeartHandshake,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("busca", search.trim());
    }

    if (category) {
      params.set("categoria", category);
    }

    navigate(`/servicos?${params.toString()}`);
  }

  return (
    <main className="overflow-hidden bg-white">

      {/* Apresentação principal */}
      <section className="relative isolate">
        <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -bottom-20 -left-32 -z-10 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:gap-10 md:py-24 lg:px-8 lg:py-28">

          {/* Texto de apresentação */}
          <div className="animate-[fadeIn_0.8s_ease-out]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles size={16} />
              Cuidado, acolhimento e conexão
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Sua saúde mental merece{" "}
              <span className="text-violet-700">
                atenção e cuidado.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
              O Mind Connect conecta você a serviços de acolhimento,
              conteúdos educativos e recursos que ajudam a cuidar
              do seu bem-estar emocional.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/servicos")}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-violet-700 px-7 py-4 font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-800 hover:shadow-xl"
              >
                Encontrar acolhimento
                <ArrowRight size={19} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/sobre")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-7 py-4 font-semibold text-violet-700 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-50"
              >
                Conheça o projeto
              </button>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
              <Heart size={17} className="text-teal-500" />
              <span>Um espaço de informação, cuidado e acolhimento.</span>
            </div>
          </div>

          {/* Ilustração principal */}
          <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-8">

            <div className="absolute h-72 w-72 rounded-full bg-violet-100 sm:h-96 sm:w-96" />

            <div className="absolute h-60 w-60 rounded-full border border-violet-200 sm:h-80 sm:w-80" />

            <div className="relative flex h-64 w-64 items-center justify-center rounded-[3rem] bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400 shadow-2xl shadow-violet-200 sm:h-80 sm:w-80">

              <div className="absolute inset-4 rounded-[2.5rem] border border-white/20" />

              <div className="flex flex-col items-center gap-5 text-white">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-md sm:h-36 sm:w-36">
                  <HeartHandshake
                    size={76}
                    strokeWidth={1.3}
                    className="sm:hidden"
                  />
                  <HeartHandshake
                    size={100}
                    strokeWidth={1.3}
                    className="hidden sm:block"
                  />
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold tracking-wide sm:text-2xl">
                    Mind Connect
                  </p>
                  <p className="mt-1 text-sm text-violet-100">
                    Conectando pessoas ao cuidado
                  </p>
                </div>
              </div>

              <div className="absolute -right-5 top-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl sm:-right-7 sm:h-16 sm:w-16">
                <Heart className="text-teal-500" size={29} />
              </div>

              <div className="absolute -bottom-5 -left-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl sm:-bottom-7 sm:-left-7 sm:h-20 sm:w-20">
                <Sparkles className="text-violet-600" size={32} />
              </div>
            </div>

            <div className="absolute -left-1 top-10 h-5 w-5 rounded-full bg-teal-400 sm:left-0" />
            <div className="absolute -right-2 bottom-12 h-4 w-4 rounded-full bg-violet-300 sm:right-2" />
          </div>
        </div>
      </section>

      {/* Busca rápida de serviços */}
      <section className="relative bg-gradient-to-b from-violet-50/80 to-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">

          <div className="mb-9 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-teal-600">
              Serviços de acolhimento
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Encontre atendimento perto de você
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Pesquise serviços de acolhimento e encontre unidades
              que podem oferecer apoio e orientação.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="rounded-3xl border border-violet-100 bg-white p-4 shadow-xl shadow-violet-100/60 sm:p-6"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">

              <div>
                <label
                  htmlFor="service-search"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Pesquisar serviço ou município
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition-colors focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                  <MapPin size={20} className="shrink-0 text-violet-500" />

                  <input
                    id="service-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Digite um município ou serviço..."
                    className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service-category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Categoria
                </label>

                <select
                  id="service-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Todas as categorias</option>
                  <option value="1">CAPS</option>
                  <option value="2">UBS</option>
                  <option value="3">Centro de Convivência</option>
                  <option value="4">Atendimento Social</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 font-semibold text-white transition-all duration-300 hover:bg-violet-800 md:w-auto"
                >
                  <Search size={19} />
                  Pesquisar
                </button>
              </div>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Consulte unidades de acolhimento disponíveis na plataforma.
          </p>
        </div>
      </section>

    </main>
  );
}

export default Home;