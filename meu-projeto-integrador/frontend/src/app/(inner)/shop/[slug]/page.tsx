"use client";

import { useState } from 'react';
import HeaderOne from "@/components/header/HeaderOne";
import ShortService from "@/components/service/ShortService";
import RelatedProduct from "@/components/product/RelatedProduct";
import FooterOne from "@/components/footer/Footer";
import Product from "@/data/Product.json";
import { useParams } from 'next/navigation';
import { formatBRL, parseBRL } from '@/utils/currency';

import { useCart } from "@/components/header/CartContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompareElements: React.FC = () => {
  const { slug } = useParams(); // Get the slug from URL parameters
  const blogPost = Product.find(post => post.slug === slug);

  if (!blogPost) {
    return <div>Post not found Man!</div>;
  }

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: Date.now(),
      image: `/assets/images/grocery/${blogPost.bannerImg}`,
      title: blogPost.title ?? 'Default Product Title',
      price: parseBRL(blogPost.price ?? '0'),
      quantity: 1,
      active: true,
    });
    setAdded(true);
    toast('Successfully Added To Cart!');
    setTimeout(() => setAdded(false), 5000);
  };

  const [activeTab, setActiveTab] = useState<string>('tab1');
  type ModalType = 'one' | 'two' | 'three' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const handleClose = () => setActiveModal(null);

  const [activeImage, setActiveImage] = useState(`/assets/images/grocery/${blogPost.bannerImg}`);
  const thumbnails = [
    {
      id: 'one',
      src: `/assets/images/grocery/${blogPost.bannerImg}`,
      alt: blogPost.title,
    },
  
  ];

  return (
    <div>
      <HeaderOne />
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <a href="/">Home</a>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="#">Detalhes do Produto</a>
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

      <div className="rts-chop-details-area rts-section-gap bg_light-1">
        <div className="container">
          <div className="shopdetails-style-1-wrapper">
            <div className="row g-5">
              <div className="col-xl-8 col-lg-8 col-md-12">
                <div className="product-details-popup-wrapper in-shopdetails">
                  <div className="rts-product-details-section rts-product-details-section2 product-details-popup-section">
                    <div className="product-details-popup">
                      <div className="details-product-area">
                        <div className="product-thumb-area">
                          <div className="cursor" />
                          <div className="thumb-wrapper one filterd-items figure">
                            <div className="product-thumb">
                              <img src={activeImage} alt={blogPost.title} />
                            </div>
                          </div>
                          <div className="product-thumb-filter-group">
                            {thumbnails.map((thumb) => (
                              <div
                                key={thumb.id}
                                className={`thumb-filter filter-btn ${activeImage === thumb.src ? 'active' : ''}`}
                                onClick={() => setActiveImage(thumb.src)}
                                style={{ cursor: 'pointer' }}
                              >
                                <img src={thumb.src} alt={thumb.alt} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="contents">
                          <div className="product-status">
                            <span className="product-catagory">Filtros</span>
                            <div className="rating-stars-group">
                              <div className="rating-star"><i className="fas fa-star" /></div>
                              <div className="rating-star"><i className="fas fa-star" /></div>
                              <div className="rating-star"><i className="fas fa-star-half-alt" /></div>
                              <span>10 Reviews</span>
                            </div>
                          </div>
                          <h2 className="product-title">{blogPost.title}</h2>
                          <p className="mt--20 mb--20">
                            Filtro de ar externo para empilhadeiras a combustão
                          </p>
                          <span className="product-price mb--15 d-block" style={{ color: "#DC2626", fontWeight: 600 }}>
                            {formatBRL(blogPost.price ?? '0')}
                          </span>

                          <div className="product-bottom-action">
                            <a
                              href="#"
                              className="rts-btn btn-primary radious-sm with-icon"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAdd();
                              }}
                            >
                              <div className="btn-text">Consultar Peça</div>
                            </a>
                          </div>

                          <div className="product-uniques">
                            <span className="sku product-unipue mb--10"><strong>SKU:</strong> BO1D0MX8SJ</span>
                            <span className="catagorys product-unipue mb--10"><strong>Categories:</strong>  Filtros</span>
                            <span className="tags product-unipue mb--10"><strong>Tags:</strong> Filtros</span>
                            <span className="tags product-unipue mb--10"><strong>LIFE:</strong> 6 Meses</span>
                            <span className="tags product-unipue mb--10"><strong>Type:</strong> Original</span>
                          </div>

                          <div className="share-option-shop-details">
                            <div className="single-share-option"><div className="icon"><i className="fa-regular fa-heart" /></div><span>Add Lista de Desejos</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product-discription-tab-shop mt--50">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setActiveTab('tab1')}
                        className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`}>
                       Detalhes do Produto
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setActiveTab('tab2')}
                        className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}>
                        Informação Adicional
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    {activeTab === 'tab1' &&
                      <div>
                        <div className="single-tab-content-shop-details">
                          <p className="disc">
                            O filtro de ar externo (ou primário) é a primeira barreira de proteção do sistema 
                            de admissão de ar do motor da empilhadeira. Sua principal função é reter poeira, 
                            fuligem, terra e detritos suspensos no ar do ambiente operacional, garantindo a 
                            entrada de ar limpo na câmara de combustão, aumentando a vida útil do motor e 
                            evitando o desgaste prematuro dos pistões e cilindros.
                          </p>
                          <div className="details-row-2">
                            <div className="right">
                            </div>
                          </div>
                        </div>




                      </div>}
                    {activeTab === 'tab2' &&
                      <div>
                        <div className="single-tab-content-shop-details">
                          <div className="table-responsive table-shop-details-pd">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Peso</th>
                                  <th>550g</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Tipo: </td>
                                  <td>Filtro de ar primário (externo)</td>
                                </tr>
                                <tr>
                                  <td>Medidas:</td>
                                  <td>86 x 127 x 313 mm</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="cansellation mt--20">
                            <span> Devolução/ Cancelamento:</span>Não serão aceitas alterações em pedidos que já 
                            tenham sido entregues ao cliente. Caso seja constatado algum problema com a qualidade
                             ou a quantidade dos produtos, o cliente poderá devolver ou cancelar o pedido no 
                             momento da entrega, na presença do entregador.
                          </p>
                          <p className="note">
                            <span>Nota:</span> O tempo de entrega do produto pode variar devido à disponibilidade
                             do produto em estoque.
                          </p>
                        </div>
                      </div>}

                    {activeTab === 'tab3' &&
                      <div>
                        <div className="single-tab-content-shop-details">
                          <div className="product-details-review-product-style">
                            <div className="average-stars-area-left">
                              <div className="top-stars-wrapper">
                                <h4 className="review">5.0</h4>
                                <div className="rating-disc">
                                  <span>Average Rating</span>
                                  <div className="stars">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <span>(1 Reviews &amp; 0 Ratings)</span>
                                  </div>
                                </div>
                              </div>
                              <div className="average-stars-area">
                                <h4 className="average">66.7%</h4>
                                <span>Recommended (2 of 3)</span>
                              </div>
                              <div className="review-charts-details">
                                <div className="single-review">
                                  <div className="stars">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                  </div>
                                  <div className="single-progress-area-incard">
                                    <div className="progress">
                                      <div
                                        className="progress-bar wow fadeInLeft"
                                        role="progressbar"
                                        style={{ width: "80%" }}
                                        aria-valuenow={25}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      />
                                    </div>
                                  </div>
                                  <span className="pac">100%</span>
                                </div>
                                <div className="single-review">
                                  <div className="stars">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-regular fa-star" />
                                  </div>
                                  <div className="single-progress-area-incard">
                                    <div className="progress">
                                      <div
                                        className="progress-bar wow fadeInLeft"
                                        role="progressbar"
                                        style={{ width: "80%" }}
                                        aria-valuenow={25}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      />
                                    </div>
                                  </div>
                                  <span className="pac">80%</span>
                                </div>
                                <div className="single-review">
                                  <div className="stars">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-regular fa-star" />
                                    <i className="fa-regular fa-star" />
                                  </div>
                                  <div className="single-progress-area-incard">
                                    <div className="progress">
                                      <div
                                        className="progress-bar wow fadeInLeft"
                                        role="progressbar"
                                        style={{ width: "60%" }}
                                        aria-valuenow={25}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      />
                                    </div>
                                  </div>
                                  <span className="pac">60%</span>
                                </div>
                                <div className="single-review">
                                  <div className="stars">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-regular fa-star" />
                                    <i className="fa-regular fa-star" />
                                    <i className="fa-regular fa-star" />
                                  </div>
                                  <div className="single-progress-area-incard">
                                    <div className="progress">
                                      <div
                                        className="progress-bar wow fadeInLeft"
                                        role="progressbar"
                                        style={{ width: "80%" }}
                                        aria-valuenow={25}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      />
                                    </div>
                                  </div>
                                  <span className="pac">40%</span>
                                </div>
                                <div className="single-review">
                                  <div className="stars">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-regular fa-star" />
                                    <i className="fa-regular fa-star" />
                                    <i className="fa-regular fa-star" />
                                    <i className="fa-regular fa-star" />
                                  </div>
                                  <div className="single-progress-area-incard">
                                    <div className="progress">
                                      <div
                                        className="progress-bar wow fadeInLeft"
                                        role="progressbar"
                                        style={{ width: "80%" }}
                                        aria-valuenow={25}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                      />
                                    </div>
                                  </div>
                                  <span className="pac">30%</span>
                                </div>
                              </div>
                            </div>
                            <div className="submit-review-area">
                              <form action="#" className="submit-review-area">
                                <h5 className="title">Submit Your Review</h5>
                                <div className="your-rating">
                                  <span>Your Rating Of This Product :</span>
                                  <div className="stars">
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                    <i className="fa-solid fa-star" />
                                  </div>
                                </div>
                                <div className="half-input-wrapper">
                                  <div className="half-input">
                                    <input type="text" placeholder="Your Name*" />
                                  </div>
                                  <div className="half-input">
                                    <input type="text" placeholder="Your Email *" />
                                  </div>
                                </div>
                                <textarea
                                  name="#"
                                  id="#"
                                  placeholder="Write Your Review"
                                  defaultValue={""}
                                />
                                <button className="rts-btn btn-primary">
                                  SUBMIT REVIEW
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>}

                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-12 offset-xl-1  rts-sticky-column-item">
                <div className="theiaStickySidebar">
                  <div className="shop-sight-sticky-sidevbar mb--20">
                    <h6 className="title">Ofertas disponíveis</h6>
                    <div className="single-offer-area">
                      <div className="icon"><img src="/assets/images/shop/01.svg" alt="icon" /></div>
                      <div className="details"><p>10% de desconto imediato no PIX
                        Ganhe 10% de desconto no valor total ao finalizar a compra das suas peças via PIX.</p></div>
                    </div>
                    <div className="single-offer-area">
                      <div className="icon"><img src="/assets/images/shop/02.svg" alt="icon" /></div>
                      <div className="details"><p>5% de desconto no Boleto Bancário
                       Obtenha 5% de desconto em pagamentos à vista no boleto para qualquer pedido de peças.</p></div>
                    </div>
                    <div className="single-offer-area">
                      <div className="icon"><img src="/assets/images/shop/03.svg" alt="icon" /></div>
                      <div className="details"><p>Frete Grátis para todo o Brasil
                         Envio gratuito em compras via PIX ou Boleto para pedidos acima de R$ 1.000.</p></div>
                    </div>
                  </div>
                  <div className="our-payment-method">
                    <h5 className="title">Melhores formas de pagamento</h5>
                    <img src="/assets/images/shop/03.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProduct />
      <ShortService />
      <FooterOne />
      <ToastContainer />
    </div>
  );
};

export default CompareElements;
