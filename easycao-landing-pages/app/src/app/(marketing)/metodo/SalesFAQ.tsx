import FAQAccordion from "../../../components/content/FAQAccordion";

const salesFaqs = [
  {
    question: "Para quem é o Método Easycao?",
    answer: "Para pilotos que precisam ser aprovados na prova ICAO de proficiência em inglês. Funciona para todos os níveis — de quem está começando a estudar até quem quer subir de Level 4 para 5 ou 6.",
  },
  {
    question: "Funciona para quem nunca fez a prova?",
    answer: "Sim! O método foi criado para preparar você do zero. Os módulos são progressivos e cobrem tudo que você precisa saber, desde vocabulário básico de aviação até simulados completos.",
  },
  {
    question: "É para quem já reprovou?",
    answer: "Especialmente. Se você já reprovou, o método vai identificar exatamente quais descritores precisam de atenção e direcionar sua preparação para corrigir os pontos fracos.",
  },
  {
    question: "Sou iniciante em inglês. Consigo acompanhar?",
    answer: "Sim. O Módulo Zero foi criado para quem está começando do absoluto zero. As aulas são progressivas e você vai evoluir no seu ritmo, com suporte da comunidade e do professor.",
  },
  {
    question: "Quanto tempo tenho de acesso?",
    answer: "A matrícula tem duração de um ano, com acesso completo a todo o conteúdo do método e as atualizações durante todo esse período",
  },
  {
    question: "Posso parcelar?",
    answer: "Sim! Parcelamos em até 12x de R$305,82 no cartão de crédito.",
  },
  {
    question: "Como funciona a garantia?",
    answer: "Garantia incondicional de 7 dias. Se você não gostar por qualquer motivo, devolvemos 100% do seu dinheiro. Sem perguntas. Basta solicitar direto na Hotmart.",
  },
  {
    question: "Preciso de nível básico de inglês?",
    answer: "Não. Nós ensinamos tudo do zero e a maior parte dos nossos alunos começou do zero. O método foi feito para isso.",
  },
  {
    question: "Tem suporte para dúvidas?",
    answer: "Sim! Você tem acesso à comunidade no WhatsApp com suporte em tempo real.",
  },
  {
    question: "Quando começam as aulas?",
    answer: "Acesso imediato. Assim que o pagamento é confirmado, você recebe acesso à plataforma e pode começar a estudar na mesma hora.",
  },
  {
    question: "É diferente de outros cursos de inglês? E de outros preparatórios ICAO?",
    answer: "Completamente. O Método de ensino foi desenvolvido com base em neurosciência e segue o caminho didático mais intuitivo, respeitando o processo natural de aprendizagem do idioma, com direcionamento prático para fazer a prova ICAO com segurança e excelência.",
  },
  {
    question: "Por onde acesso o curso?",
    answer: "O curso é acessado pela plataforma Hotmart. Assim que a matrícula é confirmada, você recebe um e-mail com o link de acesso. Pode assistir no computador, celular, tablet ou TV — e as aulas ficam disponíveis para download e acesso offline. A comunidade você acessa por Whatsapp, as aulas ao vivo pelo Zoom e os simulador pelo aplicativo próprio da Easycao.",
  },
];

export default function SalesFAQ() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          Perguntas frequentes
        </h2>
        <FAQAccordion faqs={salesFaqs} />
      </div>
    </section>
  );
}
