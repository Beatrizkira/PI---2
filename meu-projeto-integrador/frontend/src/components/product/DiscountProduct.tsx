"use client"
import React from 'react';
import DiscountProductMain from "@/components/product-main/DiscountProductMain";
import Product from '@/data/Product.json';
interface PostType {
    category?: string;
    slug: string;
    image: string;
    title?: string;
    author?: string;
    publishedDate?: string;
    price?: string;
}

function DiscountProduct() {


    const postIndicesSection1 = [1, 5, 6, 4, 7, 8];

    // Helper function to get posts from indices
    const getPostsByIndices = (indices: number[]): PostType[] =>
        indices.map(index => Product[index]).filter(Boolean);

    const postsSection1 = getPostsByIndices(postIndicesSection1);


    return (
        <div>
            {/* rts grocery feature area start */}
            <div className="rts-grocery-feature-area rts-section-gapBottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="title-area-between">
                                <h2 className="title-left">Ofertas imperdíveis</h2>
                                <div className="countdown">
                                    <div className="countDown">7/05/2025 10:20:00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-with-discount">
                                <div className="row g-4">
                                    {postsSection1.map((post: PostType, index: number) => (
                                        <div key={index} className="col-xl-6 col-lg-6">
                                            <div className="single-shopping-card-one discount-offer">
                                                <DiscountProductMain
                                                    Slug={post.slug}
                                                    ProductImage={post.image}
                                                    ProductTitle={post.title}
                                                    Price={post.price}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts grocery feature area end */}
        </div>
    )
}

export default DiscountProduct