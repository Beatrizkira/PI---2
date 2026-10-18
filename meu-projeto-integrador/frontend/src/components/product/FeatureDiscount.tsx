"use client"
import Link from 'next/link'
import React from 'react'

function FeatureDiscount() {
    return (
        <div>
            <>
                {/* rts category feature area start */}
                <div className="category-feature-area rts-section-gapTop">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="single-feature-card bg_image one">
                                    <div className="content-area">
                                        <Link href="/shop" className="rts-btn btn-primary">
                                            ES Empilhadeiras
                                        </Link>
                                        <h3 className="title">
                                            Acessórios de <br />
                                            <span>Melhor qualidade</span>
                                        </h3>
                                        <Link href="/shop" className="shop-now-goshop-btn">
                                            <span className="text">Compre agora</span>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="single-feature-card bg_image two">
                                    <div className="content-area">
                                        <Link href="/shop" className="rts-btn btn-primary">
                                            ES Empilhadeiras
                                        </Link>
                                        <h3 className="title">
                                            Motores das
                                            <span>Melhores marcas</span>
                                        </h3>
                                        <Link href="/shop" className="shop-now-goshop-btn">
                                            <span className="text">Compre agora</span>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="single-feature-card bg_image three">
                                    <div className="content-area">
                                        <a href="/shop" className="rts-btn btn-primary">
                                            ES Empilhadeiras
                                        </a>
                                        <h3 className="title">
                                            Filtros com
                                            <span>Alta Durabilidade</span>
                                        </h3>
                                        <Link href="/shop" className="shop-now-goshop-btn">
                                            <span className="text">Compre agora</span>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="single-feature-card bg_image four">
                                    <div className="content-area">
                                        <a href="/shop" className="rts-btn btn-primary">
                                            ES Empilhadeiras
                                        </a>
                                        <h3 className="title">
                                            Sistemas Elétricos
                                            <span>Eficientes e duráveis</span>
                                        </h3>
                                        <Link href="/shop" className="shop-now-goshop-btn">
                                            <span className="text">Compre agora</span>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                            <div className="plus-icon">
                                                <i className="fa-sharp fa-regular fa-plus" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts category feature area end */}
            </>

        </div>
    )
}

export default FeatureDiscount