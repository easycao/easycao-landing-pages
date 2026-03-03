import FAQAccordion from "../../../components/content/FAQAccordion";

const salesFaqs = [
  {
    question: "Para quem e o Metodo Easycao?",
    answer: "Para pilotos (PPL, CPL, ATPL) que precisam ser aprovados na prova ICAO de proficiencia em ingles. Funciona para todos os niveis — de quem esta comecando a estudar ate quem quer subir de Level 4 para 5.",
  },
  {
    question: "Funciona para quem nunca fez a prova?",
    answer: "Sim! O metodo foi criado para preparar voce do zero. Os modulos sao progressivos e cobrem tudo que voce precisa saber, desde vocabulario basico de aviacao ate simulados completos.",
  },
  {
    question: "E para quem ja reprovou?",
    answer: "Especialmente. Se voce ja reprovou, o metodo vai identificar exatamente quais descritores precisam de atencao e direcionar sua preparacao para corrigir os pontos fracos.",
  },
  {
    question: "Quanto tempo tenho de acesso?",
    answer: "Acesso vitalicio ao conteudo do metodo. Voce pode assistir e reassistir quantas vezes quiser, no seu ritmo. Atualizacoes futuras tambem estao incluidas.",
  },
  {
    question: "Posso parcelar?",
    answer: "Sim! Parcelamos em ate 12x no cartao de credito. Tambem aceitamos PIX com desconto de 15%.",
  },
  {
    question: "Tem desconto no PIX?",
    answer: "Sim! Pagamento via PIX tem desconto de 15% sobre o valor a vista. E a opcao mais economica.",
  },
  {
    question: "Como funciona a garantia?",
    answer: "Garantia incondicional de 30 dias. Se voce nao gostar por qualquer motivo, devolvemos 100% do seu dinheiro. Sem perguntas. Basta solicitar pelo suporte.",
  },
  {
    question: "Preciso de nivel basico de ingles?",
    answer: "Um nivel basico de ingles ajuda, mas nao e obrigatorio. O metodo comeca do fundamento e vai progredindo. Se voce consegue entender instrucoes simples em ingles, ja pode comecar.",
  },
  {
    question: "Tem suporte para duvidas?",
    answer: "Sim! Voce tem acesso a comunidade no WhatsApp com suporte do professor Diogo e da equipe. Duvidas sao respondidas diariamente.",
  },
  {
    question: "Quando comecam as aulas?",
    answer: "Acesso imediato. Assim que o pagamento e confirmado, voce recebe acesso a plataforma e pode comecar a estudar na mesma hora.",
  },
  {
    question: "E diferente de outros cursos de ingles?",
    answer: "Completamente. O Metodo Easycao nao e um curso de ingles geral. Foi criado especificamente para a prova ICAO, por um examinador credenciado, focando nos 6 descritores que sao avaliados. E pratica oral, nao gramatica.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer: "Sim! A plataforma funciona em qualquer dispositivo — celular, tablet ou computador. E o app simulador esta disponivel para iOS e Android.",
  },
];

export default function SalesFAQ() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          Perguntas frequentes sobre o Metodo
        </h2>
        <FAQAccordion faqs={salesFaqs} />
      </div>
    </section>
  );
}
