'use client';
import React, { useState, useRef, useEffect } from "react";

function MyComponent() {
  const [filter1, setFilter1] = useState("Week");
  const [filter2, setFilter2] = useState("Week");

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  const options = ["Week", "Month", "Year", "6 Month"];

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref1.current && !ref1.current.contains(event.target as Node)) {
        setOpen1(false);
      }
      if (ref2.current && !ref2.current.contains(event.target as Node)) {
        setOpen2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="row g-5 mt--10">

        {/* ================= LEFT SIDE ================= */}
        <div className="col-xl-6 col-lg-12">
          <div className="best-shop-seller-top-scroll">
            <div className="top-product-area-start">

              <div className="between-area-top">
                <div className="left-area">
                  <h4 className="title">Orders</h4>
                </div>

                {/* NICE SELECT 1 */}
                <div
                  className="single-select"
                  ref={ref1}
                  style={{ position: "relative", width: "160px" }}
                >
                  <div
                    onClick={() => setOpen1(!open1)}
                    className="nice-select-box"
                  >
                    {filter1}
                    <span>▼</span>
                  </div>

                  {open1 && (
                    <ul className="nice-select-dropdown">
                      {options.map((item) => (
                        <li
                          key={item}
                          onClick={() => {
                            setFilter1(item);
                            setOpen1(false);
                          }}
                          className={filter1 === item ? "active" : ""}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* LIST */}
              {[
                { img: "08.jpg", price: "$99.00", date: "5 June 2025" },
                { img: "09.jpg", price: "$86.00", date: "5 June 2024" },
                { img: "10.jpg", price: "$69.00", date: "5 Aug 2024" },
                { img: "11.jpg", price: "$49.00", date: "5 June 2023" },
                { img: "12.jpg", price: "$86.00", date: "5 June 2025" },
                { img: "13.jpg", price: "$88.00", date: "5 June 2024" },
              ].map((item, i) => (
                <div key={i} className="product-top-area-single bottom">
                  <div className="image-area">
                    <a href="#" className="thumbnail">
                      <img src={`/assets/images-dashboard/grocery/${item.img}`} alt="grocery" />
                    </a>
                    <div className="information">
                      <p>Quaker Oats Healthy Meal...</p>
                      <span>500 Items</span>
                    </div>
                  </div>
                  <div className="coupon-code">
                    <p>{item.price}</p>
                  </div>
                  <div className="indec mr--0">
                    <p>{item.date}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="col-xl-6 col-lg-12">
          <div className="best-shop-seller-top-scroll">
            <div className="top-product-area-start">

              <div className="between-area-top">
                <div className="left-area">
                  <h4 className="title">Best Shop Sellers</h4>
                </div>

                {/* NICE SELECT 2 */}
                <div
                  className="single-select"
                  ref={ref2}
                  style={{ position: "relative", width: "160px" }}
                >
                  <div
                    onClick={() => setOpen2(!open2)}
                    className="nice-select-box"
                  >
                    {filter2}
                    <span>▼</span>
                  </div>

                  {open2 && (
                    <ul className="nice-select-dropdown">
                      {options.map((item) => (
                        <li
                          key={item}
                          onClick={() => {
                            setFilter2(item);
                            setOpen2(false);
                          }}
                          className={filter2 === item ? "active" : ""}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* LIST */}
              {[
                { name: "Robert", img: "01.png", price: "$2,000" },
                { name: "Mark Henri", img: "03.png", price: "$1,000" },
                { name: "Krisob Kadri", img: "04.png", price: "$1,999" },
                { name: "Koriana Joo", img: "05.png", price: "$1,25" },
                { name: "Marlee", img: "06.png", price: "$5,653" },
                { name: "John Brush", img: "01.png", price: "$2,600" },
                { name: "John Brush", img: "01.png", price: "$2,600" },
              ].map((item, i) => (
                <div key={i} className="product-top-area-single bottom">
                  <div className="image-area">
                    <a href="#" className="thumbnail">
                      <img src={`/assets/images-dashboard/grocery/${item.img}`} alt="grocery" />
                    </a>
                    <div className="information">
                      <p className="mb--5">{item.name}</p>
                      <span>75 Purchases</span>
                    </div>
                  </div>
                  <div className="coupon-code justify-content-center">
                    <p>Food, Grocery</p>
                  </div>
                  <div className="coupon-code justify-content-center">
                    <p>{item.price}</p>
                  </div>
                  <div className="indec mr--0">
                    <img src="/assets/images-dashboard/grocery/02.png" alt="ekomart" />
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>

      {/* ===== STYLE ===== */}
      <style jsx>{`
        .nice-select-box {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nice-select-dropdown {
          position: absolute;
          top: 110%;
          left: 0;
          width: 100%;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-top: 5px;
          list-style: none;
          padding: 5px 0;
          z-index: 999;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }

        .nice-select-dropdown li {
          padding: 10px 12px;
          cursor: pointer;
        }

        .nice-select-dropdown li:hover {
          background: #f5f6fa;
        }

        .nice-select-dropdown li.active {
          background: #eef2ff;
          color: #5e72e4;
        }
      `}</style>
    </div>
  );
}

export default MyComponent;