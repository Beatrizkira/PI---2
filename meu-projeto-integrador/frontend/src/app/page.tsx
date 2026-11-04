import BannerOne from "@/components/banner/BannerOne";
import FeatureOne from "@/components/feature/FeatureOne";
import HeaderOne from "@/components/header/HeaderOne";
import FeatureDiscount from "@/components/product/FeatureDiscount";
import HomeProducts from "@/components/product/HomeProducts";
import FooterOne from "@/components/footer/Footer";
import { CartProvider } from "@/components/header/CartContext";
import { WishlistProvider } from "@/components/header/WishlistContext";
import { ToastContainer, toast } from 'react-toastify';


export default function Home() {
  return (
    <WishlistProvider>
      <CartProvider>
        <div className="demo-one">

        <ToastContainer position="top-right" autoClose={3000} />
          <HeaderOne />
          <BannerOne />
          <FeatureOne />
          <HomeProducts />
          <FeatureDiscount />
          <FooterOne />
        </div>
      </CartProvider>
      </WishlistProvider>
  );
}
