"use client"
import Link from 'next/link';
import { useState } from 'react';
import { useWishlist } from "@/components/header/WishlistContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatBRL, parseBRL } from '@/utils/currency';

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

    const { addToWishlist } = useWishlist();

    // Add to wishlist
    const handleWishlist = () => {
        addToWishlist({
            id: Date.now(),
            image: `/assets/images/grocery/${ProductImage}`,
            title: ProductTitle ?? 'Default Product Title',
            price: parseBRL(Price ?? '0'),
            quantity: 1,
        });

        toast('Successfully Add To Wishlist !');
    };

    return (
        <>
            <Link href={`/shop/${Slug}`} className="thumbnail-preview">
                <div className="badge">
                </div>
                <img src={`/assets/images/grocery/${ProductImage}`} alt="grocery" />
            </Link>

            <div className="body-content">
                <Link href={`/shop/${Slug}`}>
                    <h4 className="title">{ProductTitle ?? 'How to growing your business'}</h4>
                </Link>

                <span className="availability">1 peça</span>

                <div className="price-area">
                    <span className="current">{formatBRL(Price ?? '0')}</span>

                </div>

                <div className="cart-counter-action">
                    <Link href={`/shop/${Slug}`} className="rts-btn consult-part-button">
                        Consultar Peça
                    </Link>
                </div>

                <ToastContainer />
            </div>
        </>
    );
};

export default BlogGridMain;
