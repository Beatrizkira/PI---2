"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import ShopMain from "@/app/(inner)/shop/ShopMain";
import { api, Product } from "@/lib/api";
import { parseBRL } from "@/utils/currency";

const BEST_SELLING_CATEGORIES = [
  { label: "Filtros", category: "Filtros" },
  { label: "Sistema Elétrico", category: "Sistema Elétrico e Controles" },
  { label: "Direção e Suspensão", category: "Direção e Suspensão" },
  { label: "Transmissão", category: "Transmissão" },
];

function sameCategory(product: Product, category: string) {
  return product.category.trim().toLocaleLowerCase("pt-BR") === category.toLocaleLowerCase("pt-BR");
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="single-shopping-card-one">
      <ShopMain
        Slug={product.slug}
        ProductImage={product.image ?? ""}
        ProductTitle={product.title}
        Price={product.price}
      />
    </div>
  );
}

export default function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    api.publicProducts()
      .then(({ products: loadedProducts }) => {
        if (!cancelled) setProducts(loadedProducts);
      })
      .catch((error) => console.error("Home product listing failed:", error));

    return () => {
      cancelled = true;
    };
  }, []);

  const motorProducts = useMemo(
    () => products.filter((product) => sameCategory(product, "Motor e Componentes")),
    [products],
  );

  const offers = useMemo(
    () => [...products].sort((a, b) => parseBRL(a.price) - parseBRL(b.price)).slice(0, 8),
    [products],
  );

  const bestSellingProducts = useMemo(() => {
    return Object.fromEntries(
      BEST_SELLING_CATEGORIES.map(({ label, category }) => [
        label,
        products
          .filter((product) => sameCategory(product, category))
          .sort(() => Math.random() - 0.5)
          .slice(0, 12),
      ]),
    ) as Record<string, Product[]>;
  }, [products]);

  const [activeCategory, setActiveCategory] = useState(BEST_SELLING_CATEGORIES[0].label);
  const newest = products.slice(0, 8);

  return (
    <>
      <section className="rts-grocery-feature-area rts-section-gapBottom">
        <div className="container">
          <div className="title-area-between">
            <h2 className="title-left">Motor e Componentes</h2>
            <div className="next-prev-swiper-wrapper">
              <div className="swiper-button-prev"><i className="fa-regular fa-chevron-left" /></div>
              <div className="swiper-button-next"><i className="fa-regular fa-chevron-right" /></div>
            </div>
          </div>
        </div>
        <div className="container">
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={motorProducts.length > 1}
            navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
            className="mySwiper-category-1"
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 30 },
              320: { slidesPerView: 2, spaceBetween: 30 },
              480: { slidesPerView: 3, spaceBetween: 30 },
              640: { slidesPerView: 3, spaceBetween: 30 },
              840: { slidesPerView: 4, spaceBetween: 30 },
              1140: { slidesPerView: 6, spaceBetween: 30 },
            }}
          >
            {motorProducts.map((product) => (
              <SwiperSlide key={product.id}><ProductCard product={product} /></SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="rts-grocery-feature-area rts-section-gapBottom">
        <div className="container">
          <div className="title-area-between"><h2 className="title-left">Ofertas imperdíveis</h2></div>
          <div className="product-with-discount">
            <div className="row g-4">
              {offers.map((product) => (
                <div key={product.id} className="col-xl-3 col-lg-3 col-md-6"><ProductCard product={product} /></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="weekly-best-selling-area rts-section-gap bg_light-1">
        <div className="container">
          <div className="title-area-between">
            <h2 className="title-left">Peças e Acessórios Mais Vendidos</h2>
            <ul className="nav nav-tabs best-selling-grocery" role="tablist">
              {BEST_SELLING_CATEGORIES.map(({ label }) => (
                <li className="nav-item" role="presentation" key={label}>
                  <button
                    onClick={() => setActiveCategory(label)}
                    className={`nav-link ${activeCategory === label ? "active" : ""}`}
                    type="button"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="row g-4">
            {(bestSellingProducts[activeCategory] ?? []).map((product) => (
              <div key={product.id} className="col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="top-tranding-product rts-section-gap">
        <div className="container">
          <div className="title-area-between"><h2 className="title-left mb--10">Novidades em peças</h2></div>
          <div className="row g-4">
            {newest.map((product) => (
              <div key={product.id} className="col-xl-3 col-md-6 col-sm-12 col-12">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
