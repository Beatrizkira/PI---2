"use client";

import React from "react";
import CountUp from "react-countup";

type Counter = {
  end?: number;
  suffix?: string;
  text?: string;
  label: string;
};

const counters: Counter[] = [
  { end: 1, suffix: "K", label: "Clientes <br /> atendidos" },
  { end: 1, suffix: "K+", label: "Vendas <br /> realizadas" },
  { text: "Osasco", label: "Nossa sede <br /> em SP" },
  { end: 7, suffix: "+", label: "Anos de <br /> mercado" },
];

const CounterArea = () => {
  return (
    <div className="rts-counter-area">
      <div className="container-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="counter-area-main-wrapper">
              {counters.map((item, index) => (
                <div className="single-counter-area" key={index}>
                  <h2 className="title">
                    {item.text ? (
                      item.text
                    ) : (
                      <>
                        <CountUp end={item.end ?? 0} duration={2.5} enableScrollSpy scrollSpyDelay={500} />
                        {item.suffix}
                      </>
                    )}
                  </h2>
                  <p dangerouslySetInnerHTML={{ __html: item.label }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterArea;