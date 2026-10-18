"use client"
import Link from 'next/link';
import { useState } from 'react';
import { formatBRL } from '@/utils/currency';
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
    const handleClose = () => setActiveModal(null);


    return (
        <>

            <Link href={`/shop/${Slug}`} className="thumbnail">
                <img src={`/assets/images/grocery/${ProductImage}`} alt="product" />
            </Link>
            <div className="body-content">
                <div className="top">
                    <div className="stars-area">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                    </div>
                    <Link href={`/shop/${Slug}`}>
                        <h4 className="title">
                            {ProductTitle ? ProductTitle : 'How to growing your business'}
                        </h4>
                    </Link>
                    <div className="price-area">
                        <span className="current">{formatBRL(Price ?? '0')}</span>
                        <div className="previous">{formatBRL(36)}</div>
                    </div>
                </div>
            </div>

        </>

    );
};

export default BlogGridMain;
