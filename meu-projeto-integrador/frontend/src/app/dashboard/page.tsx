// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import SideLeft from "./components/SideLeft";
import Header from "./components/Header";
import DemoContent from "./components/DemoContent";

export default function Home() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    useEffect(() => {
        // add body class on mount
        document.body.classList.add("ekomart-dashboard-body");

        // cleanup on unmount
        return () => {
            document.body.classList.remove("ekomart-dashboard-body");
        };
    }, []);

    return (
        <div className="ekomart_dashboard">
            <SideLeft collapsed={sidebarCollapsed} />
            <div className={`right-area-body-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <Header onToggleSidebar={toggleSidebar} />
                <DemoContent />
            </div>
        </div>
    );
}