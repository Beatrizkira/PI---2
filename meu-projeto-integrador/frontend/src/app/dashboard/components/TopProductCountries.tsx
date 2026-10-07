"use client";

import React, { useState, useRef, useEffect } from "react";

function MyComponent() {
  const [filter, setFilter] = useState("Week");
  const [open, setOpen] = useState(false);

  const options = ["Week", "Month", "Year", "6 Month"];
  const ref = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>

      <div className="row mt--10 g-5">

        {/* LEFT SIDE - TOP PRODUCTS */}
        <div className="col-xl-8 col-lg-12">
          <div className="top-product-wrapper-scroll">
            <div className="top-product-area-start">

              <div className="between-area-top">
                <div className="left-area">
                  <h4 className="title">Top Products</h4>
                  <span>Top Products List</span>
                </div>
              </div>

             <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/grocery/08.jpg" alt="grocery" />
                  </a>
                  <div className="information">
                    <p>Quaker Oats Healthy Meal...</p>
                    <span>500 Items</span>
                  </div>
                </div>
                <div className="coupon-code flex-direction-column">
                  <p>Coupon Code</p>
                  <span className="d-block">2415</span>
                </div>
                <div className="logo">
                  <img src="/assets/images-dashboard/brand/01.png" alt="ekomart" />
                </div>
                <div className="indec">
                  <div className="left">
                    <p>5.29%</p>
                    <span>$79.00</span>
                  </div>
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/grocery/09.jpg" alt="grocery" />
                  </a>
                  <div className="information">
                    <p>Quaker Oats Healthy Meal...</p>
                    <span>500 Items</span>
                  </div>
                </div>
                <div className="coupon-code flex-direction-column">
                  <p>Coupon Code</p>
                  <span className="d-block">2415</span>
                </div>
                <div className="logo">
                  <img src="/assets/images-dashboard/brand/08.png" alt="ekomart" />
                </div>
                <div className="indec">
                  <div className="left">
                    <p>5.29%</p>
                    <span>$79.00</span>
                  </div>
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/grocery/10.jpg" alt="grocery" />
                  </a>
                  <div className="information">
                    <p>Quaker Oats Healthy Meal...</p>
                    <span>500 Items</span>
                  </div>
                </div>
                <div className="coupon-code flex-direction-column">
                  <p>Coupon Code</p>
                  <span className="d-block">2415</span>
                </div>
                <div className="logo">
                  <img src="/assets/images-dashboard/brand/01.png" alt="ekomart" />
                </div>
                <div className="indec">
                  <div className="left">
                    <p>5.29%</p>
                    <span>$79.00</span>
                  </div>
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/grocery/11.jpg" alt="grocery" />
                  </a>
                  <div className="information">
                    <p>Quaker Oats Healthy Meal...</p>
                    <span>500 Items</span>
                  </div>
                </div>
                <div className="coupon-code flex-direction-column">
                  <p>Coupon Code</p>
                  <span className="d-block">2415</span>
                </div>
                <div className="logo">
                  <img src="/assets/images-dashboard/brand/09.png" alt="ekomart" />
                </div>
                <div className="indec">
                  <div className="left">
                    <p>5.29%</p>
                    <span>$79.00</span>
                  </div>
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/grocery/11.jpg" alt="grocery" />
                  </a>
                  <div className="information">
                    <p>Quaker Oats Healthy Meal...</p>
                    <span>500 Items</span>
                  </div>
                </div>
                <div className="coupon-code flex-direction-column">
                  <p>Coupon Code</p>
                  <span className="d-block">2415</span>
                </div>
                <div className="logo">
                  <img src="/assets/images-dashboard/brand/10.png" alt="ekomart" />
                </div>
                <div className="indec">
                  <div className="left">
                    <p>5.29%</p>
                    <span>$79.00</span>
                  </div>
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE - TOP COUNTRIES */}
        <div className="col-xl-4 col-lg-12">
          <div className="rop-product-right">
            <div className="top-product-area-start">

              <div className="between-area-top">
                <div className="left-area">
                  <h4 className="title">Top Countries Sales</h4>
                  <span>Top Products List</span>
                </div>

                {/* NICE SELECT CUSTOM */}
                <div
                  className="single-select"
                  ref={ref}
                  style={{ position: "relative", width: "160px" }}
                >
                  {/* SELECT BOX */}
                  <div
                    onClick={() => setOpen(!open)}
                    style={{
                      padding: "10px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      userSelect: "none",
                    }}
                  >
                    {filter}
                    <span style={{ fontSize: "12px" }}>▼</span>
                  </div>

                  {/* DROPDOWN */}
                  {open && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "110%",
                        left: 0,
                        width: "100%",
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        marginTop: "5px",
                        listStyle: "none",
                        padding: "5px 0",
                        zIndex: 999,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      }}
                    >
                      {options.map((item) => (
                        <li
                          key={item}
                          onClick={() => {
                            setFilter(item);
                            setOpen(false);
                          }}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            background:
                              filter === item ? "#eef2ff" : "transparent",
                            color: filter === item ? "#5e72e4" : "#333",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#f5f6fa")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background =
                              filter === item ? "#eef2ff" : "transparent")
                          }
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/02.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">USA</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/02.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">Fracnh</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/03.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">India</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/04.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">italy</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/05.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">japan</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/06.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">Koria</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/07.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">Indor</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>
              <div className="product-top-area-single">
                <div className="image-area">
                  <a href="#" className="thumbnail">
                    <img src="/assets/images-dashboard/brand/05.png" alt="grocery" />
                  </a>
                  <div className="information">
                    <p className="mb--0">Vutan</p>
                  </div>
                </div>
                <div className="coupon-code">
                  <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
                </div>
                <div className="coupon-code">
                  <p>6,546</p>
                </div>
                <div className="indec mr--0">
                  <p>04 Jul 2024</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default MyComponent;