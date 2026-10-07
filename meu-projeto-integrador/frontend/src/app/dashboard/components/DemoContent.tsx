"use client";

import React, { useState, useRef, useEffect } from "react";
import ApexChartOne from "./ApexChartOne";
import ApexChartTwo from "./ApexChartTwo";
import TopProductCountries from "./TopProductCountries";
import OtherBestSeller from "./OtherBestSeller";

function DemoContent() {
    const [filter, setFilter] = useState("30 Days");
    const [open, setOpen] = useState(false);

    const options = ["30 Days", "60 Days", "10 Week", "6 Month"];
    const ref = useRef<HTMLDivElement>(null);

    // close on outside click
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
            <div className="body-root-inner">

                {/* TOP HEADER */}
                <div className="transection">
                    <div className="title-right-actioin-btn-wrapper-product-list">
                        <h3 className="title">Overview</h3>

                        <div className="button-wrapper">

                            {/* NICE SELECT CUSTOM */}
                            <div className="single-select" ref={ref} style={{ position: "relative", width: "160px" }}>

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
                                                    background: filter === item ? "#eef2ff" : "transparent",
                                                    color: filter === item ? "#5e72e4" : "#333",
                                                }}
                                                onMouseOver={(e) => {
                                                    (e.currentTarget as HTMLLIElement).style.background = "#f5f6fa";
                                                }}
                                                onMouseOut={(e) => {
                                                    (e.currentTarget as HTMLLIElement).style.background =
                                                        filter === item ? "#eef2ff" : "transparent";
                                                }}
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                        </div>
                    </div>
                </div>

                {/* OVERVIEW CARDS */}
                <div className="row g-5">
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="single-over-fiew-card">
                            <span className="top-main">Revenue</span>
                            <div className="bottom">
                                <h2 className="title">$1280</h2>
                                <div className="right-primary">
                                    <div className="increase">
                                        <i className="fa-light fa-arrow-up" />
                                        <span>50.8%</span>
                                    </div>
                                    <img src="/assets/images-dashboard/avatar/04.png" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="single-over-fiew-card">
                            <span className="top-main">Revenue</span>
                            <div className="bottom">
                                <h2 className="title">158</h2>
                                <div className="right-primary">
                                    <div className="increase">
                                        <i className="fa-light fa-arrow-up" />
                                        <span>50.8%</span>
                                    </div>
                                    <img src="/assets/images-dashboard/avatar/05.png" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="single-over-fiew-card">
                            <span className="top-main">Revenue</span>
                            <div className="bottom">
                                <h2 className="title">358</h2>
                                <div className="right-primary">
                                    <div className="increase">
                                        <i className="fa-light fa-arrow-up" />
                                        <span>50.8%</span>
                                    </div>
                                    <img src="/assets/images-dashboard/avatar/06.png" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="single-over-fiew-card">
                            <span className="top-main">Revenue</span>
                            <div className="bottom">
                                <h2 className="title">$89k</h2>
                                <div className="right-primary">
                                    <div className="increase">
                                        <i className="fa-light fa-arrow-up" />
                                        <span>50.8%</span>
                                    </div>
                                    <img src="/assets/images-dashboard/avatar/07.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="row mt--10 g-5">
                    <ApexChartOne />
                    <ApexChartTwo />
                    <TopProductCountries />
                    <OtherBestSeller />
                </div>

                {/* FOOTER */}
                <div className="footer-copyright">
                    <div className="left">
                        <p>Copyright © 2026 All Right Reserved.</p>
                    </div>

                    <ul>
                        <li><a href="#">Terms</a></li>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Help</a></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default DemoContent;
