import {
  BookHeart,
  CalendarDays,
  Heart,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

function Diario() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <BookHeart size={17} />
            Autoconhecimento e cuidado
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Meu diário de bem-estar
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-violet-100 sm:text-lg">
            Um espaço pessoal para acompanhar seus sentimentos,
            registrar suas experiências e refletir sobre sua
            jornada de bem-estar emocional.
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Apresentação */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Heart size={24} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Acompanhe seu bem-estar
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Registre como você está se sentindo e observe
              suas emoções ao longo do tempo.
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <LockKeyhole size={24} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Um espaço pessoal
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Seus registros são pessoais e destinados ao
              acompanhamento da sua própria jornada.
            </p>
          </div>
        </div>

        {/* Histórico */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={21}
                  className="text-violet-600"
                />

                <h2 className="text-xl font-bold text-slate-900">
                  Histórico de registros
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Acompanhe os registros realizados no seu diário.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
              <Sparkles size={15} />
              Seu espaço de reflexão
            </span>
          </div>

          {/* Estado inicial */}
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <BookHeart size={32} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Seu diário está começando!
            </h3>

            <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
              Quando você realizar seus primeiros registros de
              bem-estar, eles aparecerão aqui para que possa
              acompanhar sua evolução ao longo do tempo.
            </p>
          </div>
        </div>

        {/* Orientação */}
        <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-6">
          <h3 className="font-bold text-violet-900">
            Um lembrete importante
          </h3>

          <p className="mt-2 text-sm leading-7 text-violet-800">
            Não existe uma maneira certa de se sentir. Reserve
            um momento para reconhecer suas emoções sem julgamentos.
            O diário é uma ferramenta de reflexão e não substitui
            o acompanhamento de profissionais de saúde.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Diario;