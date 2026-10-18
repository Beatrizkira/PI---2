"use client"
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { formatBRL, parseBRL } from '@/utils/currency';
import { useWishlist } from "@/components/header/WishlistContext";

interface BlogGridMainProps {
    Slug: string;
    ProductImage: string;
    ProductTitle?: string;
    Price?: string;
}

const BlogGridMain: React.FC<BlogGridMainProps> = ({
    Slug,
    ProductImage,
    ProductTitle,
    Price,
}) => {


    type ModalType = 'one' | 'two' | 'three' | null;
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const { addToWishlist } = useWishlist();
    const handleWishlist = () => {
        addToWishlist({
            id: Date.now(),
            image: `/assets/images/grocery/${ProductImage}`,
            title: ProductTitle ?? 'Default Product Title',
            price: parseBRL(Price ?? '0'),
            quantity: 1,
        });
    };




    return (
        <>
            {/* iamge and sction area start */}
            <div className="image-and-action-area-wrapper">
                <Link href={`/shop/${Slug}`} className="thumbnail-preview">
                    <div className="badge">
                    </div>
                    <img src={`/assets/images/grocery/${ProductImage}`} alt="grocery" />
                </Link>
                <div className="action-share-option">
                    <span
                        className="single-action openuptip message-show-action"
                        data-flow="up"
                        title="Add To Wishlist"
                        onClick={handleWishlist}
                    >
                        <i className="fa-light fa-heart" />
                    </span>
                    <span
                        className="single-action openuptip"
                        data-flow="up"
                        title="Compare"
                        onClick={() => setActiveModal('one')}
                    >
                        <i className="fa-solid fa-arrows-retweet" />
                    </span>
                    <span
                        className="single-action openuptip cta-quickview product-details-popup-btn"
                        data-flow="up"
                        title="Quick View" onClick={() => setActiveModal('two')}
                    >
                        <i className="fa-regular fa-eye" />
                    </span>
                </div>
            </div>
            {/* iamge and sction area start */}
            <div className="body-content">
                <Link href={`/shop/${Slug}`}>
                    <h4 className="title">
                        {ProductTitle ? ProductTitle : 'How to growing your business'}
                    </h4>
                </Link>
                <span className="availability">500g Pack</span>
                <div className="price-area">
                    <span className="current">{formatBRL(Price ?? '0')}</span>
                    <div className="previous">{formatBRL(36)}</div>
                </div>
                <div className="cart-counter-action">
                    <Link href={`/shop/${Slug}`} className="rts-btn consult-part-button">
                        Consultar Peça
                    </Link>
                </div>
            </div>

        </>
    );
};

export default BlogGridMain;