import HeaderOne from "@/components/header/HeaderOne";
import FooterOne from "@/components/footer/Footer";
import DetalhesPeca from "../detalhes_peca";

export default async function DetalhesPecaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="demo-one">
      <HeaderOne />
      <DetalhesPeca productId={id} />
      <FooterOne />
    </div>
  );
}
