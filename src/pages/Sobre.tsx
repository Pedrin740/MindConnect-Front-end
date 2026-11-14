export default function Sobre() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Sobre o Mind Connect
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-gray-600">
            O Mind Connect é uma plataforma desenvolvida para facilitar
            o acesso a informações sobre serviços de acolhimento,
            conteúdos informativos e recursos relacionados ao
            bem-estar e à saúde mental.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              Acolhimento
            </h2>
            <p className="leading-relaxed text-gray-600">
              Facilitar a localização de serviços de acolhimento e
              atendimento disponíveis para a população.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              Informação
            </h2>
            <p className="leading-relaxed text-gray-600">
              Reunir conteúdos informativos para ampliar o acesso
              ao conhecimento sobre saúde mental.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              Conexão
            </h2>
            <p className="leading-relaxed text-gray-600">
              Aproximar usuários dos recursos e serviços que podem
              contribuir para seu bem-estar.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-7 shadow-md">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              Acessibilidade
            </h2>
            <p className="leading-relaxed text-gray-600">
              Organizar informações de maneira simples e acessível,
              facilitando a navegação pela plataforma.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}