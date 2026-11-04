"use client";
import HeaderOne from "@/components/header/HeaderOne";
import { formatBRL, parseBRL } from '@/utils/currency';
import { useEffect, useState, Suspense } from 'react';
import ShopMain from "./ShopMain";
import ShopMainList from "./ShopMainList";
import { api, Product } from '@/lib/api';
import FooterOne from "@/components/footer/Footer";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";

interface PostType {
  category?: string;
  slug: string;
  image: string | null;
  title?: string;
  author?: string;
  publishedDate?: string;
  price?: string;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [activeTab, setActiveTab] = useState<string>('tab1');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const allCategories = Array.from(new Set(products.map((product) => product.category.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const allBrands = ["Baoli", "Clark", "GM", "Goodsense", "Gurgel", "Hangcha", "Heli", "Hyundai", "Hyster", "JAC", "Komatsu", "Kubota", "Linde", "Liugong", "Loking", "Mazda", "Mitsubishi", "Nissan", "Shangli", "Still", "Tailift", "TCM", "Toyota", "Utilev", "Wanfeg", "Wecan", "Xinchai", "Yale", "Yanmar", "YTO", "Yunnei", "Zoomlion"];

  useEffect(() => {
    let cancelled = false;
    api.publicProducts()
      .then(({ products: loadedProducts }) => {
        if (!cancelled) setProducts(loadedProducts);
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setMinPrice(val);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setMaxPrice(val);
  };

  const filteredProducts: Product[] = products
    .filter(product => {
      const productPrice = parseBRL(product.price);
      if (productPrice < minPrice || productPrice > maxPrice) {
        return false;
      }

      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.some((category) => product.category.trim().toLocaleLowerCase("pt-BR") === category.toLocaleLowerCase("pt-BR"));
      const searchableText = `${product.title} ${product.category} ${product.tags}`.toLowerCase();
      const matchesBrand = selectedBrands.length === 0 ||
        selectedBrands.some((brand) => product.brand.trim().toLocaleLowerCase("pt-BR") === brand.toLocaleLowerCase("pt-BR") || searchableText.includes(brand.toLowerCase()));
      const matchesSearch = !searchQuery || searchableText.includes(searchQuery);
      return matchesCategory && matchesBrand && matchesSearch;
    });

  const handlePriceFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="shop-page">
      {isLoading ? (
        <div className="text-center py-20"><p>A carregar produtos...</p></div>
      ) : loadError ? (
        <div className="text-center py-20"><p>{loadError}</p></div>
      ) : null}

      {/* Navegação / Breadcrumb */}
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <Link href="/">Início</Link>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="#">Produtos</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-seperator bg_light-1">
        <div className="container">
          <hr className="section-seperator" />
        </div>
      </div>

      <div className="shop-grid-sidebar-area rts-section-gap">
        <div className="container">
          <div className="row g-0">
            {/* Barra Lateral */}
            <div className="col-xl-3 col-lg-12 pr--70 pr_lg--10 pr_sm--10 pr_md--5 rts-sticky-column-item">
              <div className="sidebar-filter-main theiaStickySidebar">
                {/* Filtro de Preço */}
                <div className="single-filter-box">
                  <h5 className="title">Filtrar por Preço</h5>
                  <div className="filterbox-body">
                    <form
                      action="#"
                      className="price-input-area"
                      onSubmit={handlePriceFilterSubmit}
                    >
                      <div className="half-input-wrapper">
                        <div className="single">
                          <label htmlFor="min">Preço Mín.</label>
                          <input
                            id="min"
                            type="number"
                            value={minPrice}
                            min={0}
                            onChange={handleMinPriceChange}
                          />
                        </div>
                        <div className="single">
                          <label htmlFor="max">Preço Máx.</label>
                          <input
                            id="max"
                            type="number"
                            value={maxPrice}
                            min={0}
                            onChange={handleMaxPriceChange}
                          />
                        </div>
                      </div>
                      <input
                        type="range"
                        className="range"
                        min={0}
                        max={1000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                      />
                      <div className="filter-value-min-max">
                        <span>
                          Preço: {formatBRL(minPrice)} — {formatBRL(maxPrice)}
                        </span>
                        <button type="submit" className="rts-btn btn-primary">
                          Filtrar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Categorias */}
                <div className="single-filter-box">
                  <h5 className="title">Categorias de Produtos</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper ">
                      {allCategories.map((cat, i) => (
                        <div className="single-category" key={i}>
                          <input
                            id={`cat${i + 1}`}
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          <label htmlFor={`cat${i + 1}`}>{cat}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Marcas */}
                <div className="single-filter-box">
                  <h5 className="title">Selecionar Marcas</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper">
                      {allBrands.map((brand, i) => (
                        <div className="single-category" key={i}>
                          <input
                            id={`brand${i + 1}`}
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                          />
                          <label htmlFor={`brand${i + 1}`}>{brand}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="col-xl-9 col-lg-12">
              <div className="filter-select-area">
                <div className="top-filter">
                  <span>Exibindo {filteredProducts.length} resultados</span>
                  <div className="right-end">
                    <span>Ordenar: Mais Recentes</span>
                    <div className="button-tab-area">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            onClick={() => setActiveTab('tab1')}
                            className={`nav-link single-button ${activeTab === 'tab1' ? 'active' : ''}`}
                          >
                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                              <rect x="0.5" y="0.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                              <rect x="0.5" y="9.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                              <rect x="9.5" y="0.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                              <rect x="9.5" y="9.5" width={6} height={6} rx="1.5" stroke="#2C3B28" />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualização em Grade ou Lista */}
              <div className="tab-content" id="myTabContent">
                <div className="product-area-wrapper-shopgrid-list mt--20 tab-pane fade show active">
                  {activeTab === 'tab1' && (
                    <div className="row g-4">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((post) => (
                          <div key={post.id} className="col-lg-20 col-lg-4 col-md-6 col-sm-6 col-12">
                            <div className="single-shopping-card-one">
                              <ShopMain
                                Slug={post.slug}
                                ProductImage={post.image ?? ''}
                                ProductTitle={post.title}
                                Price={post.price}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h2>Nenhum produto encontrado</h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <HeaderOne />
      <Suspense fallback={
        <div className="text-center py-20">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">A carregar...</span>
          </div>
          <p className="mt-3">A carregar produtos...</p>
        </div>
      }>
        <ShopContent />
      </Suspense>
      <FooterOne />
    </>
  );
}
