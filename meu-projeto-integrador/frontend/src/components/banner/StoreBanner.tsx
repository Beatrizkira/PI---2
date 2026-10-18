import Link from 'next/link';
import React from 'react';

function StoreBanner() {
  return (
    <div className="about-banner-area-bg rts-section-gap bg_iamge">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="inner-content-about-area">
              <h1 className="title">Loja</h1>
              <p className="disc">
                Descubra produtos e ofertas exclusivas pensadas para facilitar a
                sua rotina e entregar qualidade em cada escolha.
              </p>
              <Link href="/shop" className="rts-btn btn-primary">
                Ver produtos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreBanner;
