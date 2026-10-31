"use client";

import Link from "next/link";
import React, { useState, MouseEvent } from "react";

type MenuItem = {
    label: string;
    submenu: string[] | null;
};

function CategoryMenu() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleMenu = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const menuItems: MenuItem[] = [
        {
            label: "Motor e Componentes",
            submenu: ["Motor", "Componentes"],
        },
        {
            label: "Transmissão",
            submenu: ["Transmissão", "Componentes"],
        },
        {
            label: "Filtros",
            submenu: null,
        },
        {
            label: "Sistema de Combustível",
            submenu: ["Sistema de Combustível", "Componentes"],
        },
        {
            label: "Acessórios e Acabamento",
            submenu: null,
        },
        {
            label: "Direção e Suspensão",
            submenu: null,
        },
        {
            label: "Sistema de Freios",
            submenu: ["Breakfast", "Dinner", "Pumking"],
        },
        {
            label: "Sistema Elétrico / Controles",
            submenu: null,
        },
        {
            label: "Outros",
            submenu: null,
        },
    ];

    return (
        <div>
            <ul className="category-sub-menu" id="category-active-four">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href="#"
                            className="menu-item"
                            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                                e.preventDefault();
                                if (item.submenu) toggleMenu(index);
                            }}
                        >
                            <span>{item.label}</span>
                            {item.submenu && (
                                <i
                                    className={`fa-regular ${openIndex === index ? "fa-minus" : "fa-plus"
                                        }`}
                                />
                            )}
                        </Link>

                        {item.submenu && (
                            <ul
                                className={`submenu mm-collapse ${openIndex === index ? "mm-show" : ""
                                    }`}
                            >
                                {item.submenu.map((subItem, subIdx) => (
                                    <li key={subIdx}>
                                        <Link className="mobile-menu-link" href="/shop">
                                            {subItem}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryMenu;