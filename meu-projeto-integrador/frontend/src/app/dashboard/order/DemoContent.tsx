"use client";

import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface DataRow {
  id: number;
  orderNo: string;
  customer: string;
  date: string;
  amount: string;
  category: string;
  status: string;
}

const OverviewTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // ✅ NICE SELECT STATE
  const [timeRange, setTimeRange] = useState("Week");
  const [open, setOpen] = useState(false);

  const options = ["Week", "Month", "Year", "6 Month"];
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

  const data: DataRow[] = [
    { id: 1, orderNo: "#87451", customer: "Esther Howard", date: "02/03/2022", amount: "$200", category: "Notebook", status: "Delivered" },
    { id: 2, orderNo: "#87452", customer: "Wade Warren", date: "02/03/2022", amount: "$220", category: "Notebook", status: "Delivered" },
    { id: 3, orderNo: "#87453", customer: "Jenny Wilson", date: "02/03/2022", amount: "$300", category: "Notebook", status: "Delivered" },
    { id: 4, orderNo: "#87454", customer: "Guy Hawkins", date: "02/03/2022", amount: "$400", category: "Notebook", status: "Delivered" },
  ];

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Order No",
      selector: (row) => row.orderNo,
      sortable: true,
      cell: (row) => <p style={{ color: "var(--color-primary)" }}>{row.orderNo}</p>,
    },
    {
      name: "Customer",
      selector: (row) => row.customer,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <div className="between-stock-table statrusts">
          <p>{row.status}</p>
          <img src="/assets/images-dashboard/grocery/20.png" />
          <div className="action-edit-deleate">
            <span>Edit</span>
            <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const handleRowSelected = useCallback((state: { selectedRows: DataRow[] }) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const filteredItems = data.filter(
    (item) =>
      item.customer.toLowerCase().includes(filterText.toLowerCase()) ||
      item.orderNo.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="body-root-inner">
      <div className="transection">

        {/* HEADER */}
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">Overview</h3>

          {/* ✅ CUSTOM NICE SELECT */}
          <div className="button-wrapper">
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
                {timeRange}
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
                        setTimeRange(item);
                        setOpen(false);
                      }}
                      style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        background:
                          timeRange === item ? "#eef2ff" : "transparent",
                        color: timeRange === item ? "#5e72e4" : "#333",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#f5f6fa")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          timeRange === item ? "#eef2ff" : "transparent")
                      }
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="product-top-filter-area-l">
          <div className="left-area-button-fiulter">
            {["All 250", "New Item 150", "Disabled 154"].map((filter) => (
              <div
                key={filter}
                className={`signle-product-single-button ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => handleFilterChange(filter)}
              >
                <span>{filter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="vendor-list-main-wrapper product-wrapper">
          <div className="card-body table-product-select">

            <div className="table-responsive">

              {/* SEARCH + LENGTH */}
              <div className="dataTables_length">
                <label>
                  Show{" "}
                  <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                    {[5, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>{" "}
                  entries
                </label>
              </div>

              <div className="dataTables_filter">
                <label>
                  Search:
                  <input value={filterText} onChange={handleFilter} />
                </label>
              </div>

              <DataTable
                columns={columns}
                data={filteredItems}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                pagination
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
              />

            </div>
          </div>
        </div>

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
  );
};

export default OverviewTable;