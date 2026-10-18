"use client"
import React from 'react';
import { formatBRL } from '@/utils/currency';

interface BlogGridMainProps {
  Slug: string;
  ProductImage: string;
  ProductTitle?: string;
  Price?: string;
}

const ShopMainList: React.FC<BlogGridMainProps> = ({
  Slug,
  ProductImage,
  ProductTitle,
  Price,
}) => {

  return (
    <>
      <div className="single-shopping-card-one discount-offer">
        <a href={`/shop/${Slug}`} className="thumbnail-preview">
          <div className="badge">
            <i className="fa-solid fa-bookmark" />
          </div>
          <img src={`/assets/images/grocery/${ProductImage}`} alt="grocery" />
        </a>

        <div className="body-content">
          <div className="title-area-left">
            <a href={`/shop/${Slug}`}>
              <h4 className="title">{ProductTitle ?? 'How to growing your business'}</h4>
            </a>

            <span className="availability">Toyota</span>

            <div className="price-area">
              <span className="current">{formatBRL(Price ?? '0')}</span>
              <div className="previous">{formatBRL(36)}</div>
            </div>

            <div className="cart-counter-action">
              <a href={`/shop/${Slug}`} className="rts-btn consult-part-button">
                Consultar Peça
              </a>
            </div>
          </div>

          <div className="natural-value">
            <h6 className="title">Nutritional Values</h6>

            <div className="single"><span>Energy(kcal):</span><span>211</span></div>
            <div className="single"><span>Protein(g):</span><span>211</span></div>
            <div className="single"><span>magnetiam(kcal):</span><span>211</span></div>
            <div className="single"><span>Calory(kcal):</span><span>211</span></div>
            <div className="single"><span>Vitamine(kcal):</span><span>211</span></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopMainList;
