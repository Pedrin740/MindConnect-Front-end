
const integrantes = [
  {
    nome: "Pedro Felipe de Castro Rosa",
    rm: "569049",
    imagem: "/images/pedro-felipe.jpeg",
    github: "https://github.com/Pedrin740",
    linkedin:
      "https://www.linkedin.com/in/pedro-felipe-castro-rosa/",
  },
  {
    nome: "Victor Ferreira Gomes",
    rm: "569273",
    imagem: "/images/victor.jpeg",
    github: "https://github.com/Victor180422",
    linkedin:
      "https://www.linkedin.com/in/victor-ferreira-gomes-63b2463b5/",
  },
  {
    nome: "Rafaela Donadio Figueiredo Tavares",
    rm: "572797",
    imagem: "/images/rafaela.jpeg",
    github: "https://github.com/mrafahdft",
    linkedin:
      "https://www.linkedin.com/in/rafaela-donadio-9ab70841b/",
  },
  {
    nome: "Pedro Henrique Cavalcante De Souza",
    rm: "570464",
    imagem: "/images/pedro-henrique.jpeg",
    github: "https://github.com/pedrostack-01",
    linkedin:
      "https://www.linkedin.com/in/pedro-henrique-cardoso-cavalcante-de-souza-6282333b3/",
  },
  {
    nome: "Guilherme Joel de Camargo",
    rm: "570403",
    imagem: "/images/guilherme.jpeg",
    github: "https://github.com/guilhermejcam",
    linkedin:
      "https://www.linkedin.com/in/guilherme-camargo-a06410410/",
  },
];

export function Integrantes() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <section className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple-700">
            InovaTech
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            Integrantes
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Conheça a equipe responsável pelo desenvolvimento
            da plataforma Mind Connect.
          </p>
        </section>

        <section className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {integrantes.map((integrante, index) => (
            <article
              key={integrante.rm}
              className={`flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-1 lg:col-span-2 ${
                index === 3
                  ? "lg:col-start-2"
                  : index === 4
                    ? "lg:col-start-4"
                    : ""
              }`}
            >
              <img
                src={integrante.imagem}
                alt={`Foto de ${integrante.nome}`}
                className="mx-auto h-32 w-32 shrink-0 rounded-full border-4 border-purple-100 object-cover"
              />

              <h2 className="mt-5 flex min-h-14 items-center justify-center text-lg font-bold text-gray-900">
                {integrante.nome}
              </h2>

              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  RM: {integrante.rm}
                </p>

                <p className="text-sm text-gray-500">
                  Turma: 1TDSPK
                </p>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                <a
                  href={integrante.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-purple-200 px-3 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50"
                >
                  GitHub
                </a>

                <a
                  href={integrante.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-teal-200 px-3 py-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
                >
                  LinkedIn
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
