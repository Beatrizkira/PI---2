import Link from 'next/link';
import React from 'react';

function AboutBanner() {
  return (
    <>
      {/* rts banner area about */}
      <div className="about-banner-area-bg rts-section-gap bg_iamge">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content-about-area">
                <h1 className="title">Conheça a ES Empilhadeiras</h1>
                <p className="disc">
                  Há sete anos oferecendo peças para empilhadeiras com
                  transparência, inovação e foco absoluto na qualidade, em
                  Osasco – SP.
                </p>
                <Link href="/contact" className="rts-btn btn-primary">
                  Fale Conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* rts banner area about end */}
    </>
  );
}

export default AboutBanner;