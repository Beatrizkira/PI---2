import HeaderOne from "@/components/header/HeaderOne";
import FooterOne from "@/components/footer/Footer";
import Estoque from "./estoque";

export default function EstoquePage() {
  return (
    <div className="demo-one">
      <HeaderOne />
      <Estoque />
      <FooterOne />
    </div>
  );
}
