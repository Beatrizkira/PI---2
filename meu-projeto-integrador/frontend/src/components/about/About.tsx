import React from 'react';

function About() {
  return (
    <>
      {/* about area start */}
      <div className="rts-about-area rts-section-gap2">
        <div className="container-3">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="thumbnail-left">
                <img src="/assets/images/about/sobre-nos.jpg" alt="Empilhadeira em galpão de armazenagem" />              </div>
            </div>
            <div className="col-lg-8 pl--60 pl_md--10 pt_md--30 pl_sm--10 pt_sm--30">
              <div className="about-content-area-1">
                <h2 className="title">Nossa História</h2>
                <p className="disc">
                  Há sete anos, movida pela visão de entregar excelência e forte
                  compromisso com os clientes, Sidlania Souza Alves Barbosa deu
                  o primeiro passo para fundar a empresa e construir uma marca
                  de confiança no mercado. O que começou como um projeto
                  pautado em dedicação e trabalho árduo transformou-se
                  rapidamente em uma trajetória sólida de crescimento e
                  estabilidade. Nossa sede, localizada na Rua Laguna, 201, no
                  bairro Vila Menck, em Osasco – SP (CEP 06273-140), foi
                  cuidadosamente estabelecida para garantir proximidade,
                  agilidade e total eficiência no atendimento.
                </p>
                <p className="disc">
                  Ao longo dessa jornada de atuação, consolidamos nossa
                  presença na região mantendo vivos os pilares fundamentais
                  estabelecidos por nossa fundadora: transparência, inovação
                  constante e foco absoluto na qualidade. Cada etapa superada
                  nesses sete anos reflete nosso empenho genuíno em construir
                  relacionamentos duradouros, sempre priorizando a segurança e a
                  satisfação de quem escolhe os nossos serviços. Hoje, olhamos
                  para o futuro com a mesma energia do primeiro dia, prontos
                  para expandir nosso impacto e continuar escrevendo novos
                  capítulos de sucesso, autoridade e credibilidade.
                </p>
                <div className="check-main-wrapper">
                  <div className="single-check-area">Transparência</div>
                  <div className="single-check-area">Inovação constante</div>
                  <div className="single-check-area">Foco absoluto na qualidade</div>
                  <div className="single-check-area">
                    Rua Laguna, 201 – Vila Menck, Osasco – SP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* about area end */}
    </>
  );
}

export default About;