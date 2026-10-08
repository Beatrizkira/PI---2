"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StackedBarChart: React.FC = () => {
  const [filter, setFilter] = useState("Week");
  const [open, setOpen] = useState(false);

  const optionsList = ["Week", "Month", "Year", "6 Month"];
  const ref = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // chart data (you can later connect filter here)
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 436,
      stacked: true,
      toolbar: { show: false },
    },
    series: [
      { name: "PRODUCT A", data: [2, 5, 1, 7, 2, 4, 1, 4] },
      { name: "PRODUCT B", data: [1, 3, 2, 8, 3, 7, 3, 2] },
    ],
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    },
    yaxis: {
      opposite: true,
      min: 0,
      max: 10,
      tickAmount: 5,
      labels: { show: false },
    },
    legend: { show: false },
    grid: {
      show: false,
      padding: { left: -10, right: 0 },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { columnWidth: "18%" },
    },
    fill: { colors: ["#629D23", "#629D23"] },
    tooltip: { enabled: true },
  };

  return (
    <div className="col-xl-5 col-lg-12">
      <div className="apex-xhart-area-one">

        {/* TOP HEADER */}
        <div className="apex-chart-top-area-banner mb--20">
          <div className="left-area">
            <h1 className="title-top mb--10">Earnings</h1>
            <span>Top traffic channels metrics.</span>
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
                {optionsList.map((item) => (
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
                      color: filter === item ? "#629D23" : "#333",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLLIElement).style.background =
                        "#f5f6fa";
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

        {/* CHART */}
        <div id="stack-chart">
          <Chart
            options={options}
            series={options.series!}
            type="bar"
            height={options.chart?.height}
          />
        </div>

      </div>
    </div>
  );
};

export default StackedBarChart;