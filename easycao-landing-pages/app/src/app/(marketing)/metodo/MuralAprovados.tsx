import ApprovalCarousel from "../../../components/ApprovalCarousel";

export default function MuralAprovados() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          Prova social
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-2 text-center">
          Mural de aprovados
        </h2>
        <p className="text-black/60 text-center mb-10">
          Mais de 1000 pilotos ja foram aprovados com o Metodo Easycao
        </p>
        <ApprovalCarousel />
      </div>
    </section>
  );
}
