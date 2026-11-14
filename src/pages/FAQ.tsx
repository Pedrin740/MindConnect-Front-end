import { useState } from "react";

const questions = [
  ["O que é o Mind Connect?", "O Mind Connect é uma plataforma que facilita o acesso a informações sobre serviços de acolhimento, conteúdos educativos e recursos relacionados ao bem-estar e à saúde mental."],
  ["Como funciona?", "A plataforma permite consultar serviços de acolhimento, explorar conteúdos informativos e utilizar recursos voltados ao acompanhamento do bem-estar emocional."],
  ["Quais tipos de serviços posso encontrar?", "A plataforma reúne diferentes categorias de atendimento, como CAPS, UBS, Centros de Convivência e serviços de Atendimento Social."],
  ["Como encontrar serviços de acolhimento?", "Acesse a página Serviços e pesquise por município ou utilize os filtros de categoria para encontrar unidades de atendimento disponíveis na plataforma."],
  ["Como funciona a localização dos serviços?", "A página Serviços apresenta as unidades cadastradas e suas respectivas localizações no mapa, facilitando a identificação dos locais de atendimento."],
  ["Quais conteúdos estão disponíveis na plataforma?", "A página Conteúdos reúne materiais informativos relacionados à saúde mental, ao cuidado emocional e ao bem-estar."],
  ["Para que serve o Diário?", "O Diário permite registrar informações relacionadas ao seu bem-estar, possibilitando acompanhar seus registros pessoais ao longo do tempo."],
  ["O Mind Connect substitui acompanhamento profissional?", "Não. O Mind Connect possui caráter informativo e de orientação. A plataforma não substitui avaliações, diagnósticos ou acompanhamento realizado por profissionais de saúde."],
  ["Como tirar dúvidas sobre a plataforma?", "Você pode acessar a página Contato para enviar dúvidas, sugestões, feedbacks ou outras mensagens relacionadas ao Mind Connect."],
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleQuestion(index: number) {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">

        <section className="mb-7 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">
            Ajuda
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Perguntas frequentes
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Encontre respostas sobre o Mind Connect e seu
            funcionamento dentro da plataforma.
          </p>
        </section>

        <section className="space-y-3">
          {questions.map(([question, answer], index) => (
            <article
              key={index}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
                openIndex === index
                  ? "border-purple-200"
                  : "border-gray-100 hover:border-purple-100"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleQuestion(index)}
                aria-expanded={openIndex === index}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
              >
                <span className="text-sm font-semibold text-slate-800 sm:text-base">
                  {question}
                </span>

                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-all ${
                    openIndex === index
                      ? "rotate-45 bg-purple-100 text-purple-700"
                      : "bg-purple-50 text-purple-700"
                  }`}
                >
                  +
                </span>
              </button>

              {openIndex === index && (
                <div className="border-t border-gray-100 px-5 py-5 sm:px-6">
                  <p className="text-sm leading-7 text-slate-600">
                    {answer}
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/60 p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            Ainda tem dúvidas?
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Entre em contato com nossa equipe.
          </p>

          <a
            href="/contato"
            className="mt-4 inline-flex rounded-xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-800"
          >
            Fale conosco
          </a>
        </section>

      </div>
    </main>
  );
}
