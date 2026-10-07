"use client"
import React from 'react';
import Link from "next/link";
function NavItem() {
    return (
        <div>
            <nav>
                <ul className="parent-nav">
                    <li className="parent has-dropdown">
                        <Link className="nav-link" href="/">
                            Home
                        </Link>
                    </li>
                    <li className="parent">
                        <Link href="/about">Sobre Nós</Link>
                    </li>
                    <li className="parent with-megamenu">
                        <Link href="/shop">Produtos</Link>
                    </li>

                    <li className="parents">
                        <Link target='_blank' href="/dashboard">
                            Dashboard
                            <span className="badge">New</span>
                        </Link>
                    </li>
                    <li className="parent">
                        <Link href="/contact">Contato</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default NavItem;
