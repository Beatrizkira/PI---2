import React from 'react'

function FooterOne() {
    return (
        <div><>
            {/* rts footer one area start */}
            <div className="rts-footer-area pt--80 bg_light-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="footer-main-content-wrapper pb--70 pb_sm--30">
                                {/* single footer area wrapper */}
                                <div className="single-footer-wized">
                                    <h3 className="footer-title">Sobre a Empresa</h3>
                                    <div className="call-area">
                                        <div className="icon">
                                            <i className="fa-solid fa-phone-rotary" />
                                        </div>
                                        <div className="info">
                                            <span>Tem alguma dúvida? Ligue 24/7</span>
                                            <a href="#" className="number">
                                                +11 9999 6666
                                            </a>
                                        </div>
                                    </div>
                                    <div className="opening-hour">
                                        <div className="single">
                                            <p>
                                                Segunda - Sexta: <span>8:00am - 6:00pm</span>
                                            </p>
                                        </div>
                                        <div className="single">
                                            <p>
                                                Sábado: <span>8:00am - 6:00pm</span>
                                            </p>
                                        </div>
                                        <div className="single">
                                            <p>
                                                Domingo: <span>Fechado</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="single-footer-wized">
                                    <h3 className="footer-title">Nossas Lojas</h3>
                                    <div className="footer-nav">
                                        <ul>
                                            <li>
                                                <a href="#">Informações de Entrega</a>
                                            </li>
                                            <li>
                                                <a href="#">Política de Privacidade</a>
                                            </li>
                                            <li>
                                                <a href="#">Termos &amp; Condições</a>
                                            </li>
                                            <li>
                                                <a href="#">Centro de Suporte</a>
                                            </li>
                                            <li>
                                                <a href="#">Carreiras</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="single-footer-wized">
                                    <h3 className="footer-title">Shop Categorias</h3>
                                    <div className="footer-nav">
                                        <ul>
                                            <li>
                                                <a href="#">Nos contate</a>
                                            </li>
                                            <li>
                                                <a href="#">Informação</a>
                                            </li>
                                            <li>
                                                <a href="#">Sobre nós</a>
                                            </li>
                                            <li>
                                                <a href="#">Carreiras</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="single-footer-wized">
                                    <h3 className="footer-title">Links Úteis</h3>
                                    <div className="footer-nav">
                                        <ul>
                                            <li>
                                                <a href="#">Cancelamento &amp; Devoluções</a>
                                            </li>
                                            <li>
                                                <a href="#">Reportar Problemas</a>
                                            </li>
                                            <li>
                                                <a href="#">Pagamento</a>
                                            </li>
                                            <li>
                                                <a href="#">Envio</a>
                                            </li>
                                            <li>
                                                <a href="#">FAQ</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="single-footer-wized">
                                    <h3 className="footer-title">Nossa Newsletter</h3>
                                    <p className="disc-news-letter">
                                        Inscreva-se na lista de e-mails para receber atualizações sobre <br /> os
                                        novos produtos e outras ofertas
                                    </p>
                                    <form className="footersubscribe-form" action="#">
                                        <input
                                            type="email"
                                            placeholder="Your email address"
                                            required
                                        />
                                        <button className="rts-btn btn-primary">Subscribe</button>
                                    </form>
                                    <p className="dsic">
                                        Eu gostaria de receber comunicações de marketing da ES Empilhadeiras.
                                    </p>
                                </div>

                            </div>
                            <div className="social-and-payment-area-wrapper">
                                <div className="social-one-wrapper">
                                    <span>Nos Siga:</span>
                                    <ul>
                                        <li>
                                            <a href="#">
                                                <i className="fa-brands fa-facebook-f" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa-brands fa-twitter" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa-brands fa-youtube" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa-brands fa-whatsapp" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i className="fa-brands fa-instagram" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="payment-access">
                                    <span>Formas de Pagamento:</span>
                                    <img src="assets/images/payment/01.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* rts copyright-area start */}
            <div className="rts-copyright-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="copyright-between-1">
                                <p className="disc">
                                    Copyright 2026 <a href="#">©ES Empilhadeiras</a>. Todos os direitos reservados. Desenvolvido por <a href="#">ES Empilhadeiras</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts copyright-area end */}
        </>
        </div>
    )
}

export default FooterOne
