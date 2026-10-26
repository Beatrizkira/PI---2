import HeaderOne from "@/components/header/HeaderOne";
import ShortService from "@/components/service/ShortService";
import FooterOne from "@/components/footer/Footer";

export default function Home() {
    return (
        <div className="demo-one">
            <HeaderOne />

            <>
                {/* rts contact main wrapper */}
                <div className="rts-contact-main-wrapper-banner bg_image">
                    <div className="container">
                        <div className="row">
                            <div className="co-lg-12">
                                <div className="contact-banner-content">
                                    <h1 className="title">Tire suas dúvidas conosco</h1>
                                    <p className="disc">
                                        Tem alguma dúvida sobre nossos serviços ou produtos? Envie sua pergunta
                                        abaixo e nossa equipe responderá o mais breve possível.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts contact main wrapper end */}

                <div className="rts-map-contact-area rts-section-gap2">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="contact-left-area-main-wrapper">
                                    <h2 className="title">Você pode nos fazer perguntas!</h2>
                                    <p className="disc">
                                        Entre em contato conosco para tirar suas dúvidas e dar sua opinião,
                                        ou resolva seus problemas mais rapidamente através de nossos
                                        escritórios de atendimento.
                                    </p>
                                    <div className="location-single-card">
                                        <div className="icon">
                                            <i className="fa-light fa-location-dot" />
                                        </div>
                                        <div className="information">
                                            <h3 className="title">Vila Menck, Osasco - SP </h3>
                                            <p>R. Laguna, 201 - Vila Menck, Osasco - SP, 06273-140, Brasil.</p>
                                            <a href="#" className="number">
                                                +55 (11) 98661-4269
                                            </a>
                                            <a href="#" className="email">
                                                se.manuempilhadeira@hotmail.com
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-8 pl--50 pl_sm--5 pl_md--5">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.0769201493813!2d-46.769080824790926!3d-23.493738759111114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cefebe08e45f43%3A0x247ec5ac8a99634c!2sR.%20Laguna%2C%20201%20-%20Vila%20Menck%2C%20Osasco%20-%20SP%2C%2006273-140!5e0!3m2!1spt-BR!2sbr!4v1791934391710!5m2!1spt-BR!2sbr"
                                    width={600}
                                    height={540}
                                    style={{ border: 0 }}
                                    allowFullScreen={true} // Fixed here: Set to true or omitted if not needed
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts contact-form area start */}
                <div className="rts-contact-form-area rts-section-gapBottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="bg_light-1 contact-form-wrapper-bg">
                                    <div className="row">
                                        <div className="col-lg-7 pr--30 pr_md--10 pr_sm--5">
                                            <div className="contact-form-wrapper-1">
                                                <h3 className="title mb--50">
                                                    Preencha o formulário se tiver alguma dúvida.
                                                </h3>
                                                <form action="#" className="contact-form-1">
                                                    <div className="contact-form-wrapper--half-area">
                                                        <div className="single">
                                                            <input type="text" placeholder="Nome" />
                                                        </div>
                                                        <div className="single">
                                                            <input type="text" placeholder="Email" />
                                                        </div>
                                                    </div>
                                                    <div className="single-select">
                                                        <select>
                                                            <option data-display="Subject*">Todas categorias</option>
                                                            <option value={1}>Alguma opção</option>
                                                            <option value={2}>Outra opção</option>
                                                        </select>
                                                    </div>
                                                    <textarea
                                                        name="message"
                                                        placeholder="Escreva sua mensagem aqui"
                                                        defaultValue={""}
                                                    />
                                                    <button className="rts-btn btn-primary mt--20">
                                                        Enviar mensagem
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="col-lg-5 mt_md--30 mt_sm--30">
                                            <div className="thumbnail-area">
                                                <img src="assets/images/contact/contato.jpg" alt="contact_form" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts contact-form area end */}
            </>

            <ShortService />
            <FooterOne />
        </div>
    );
}
