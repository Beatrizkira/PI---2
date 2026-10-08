"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  icon: string;
  children?: { title: string; href: string }[];
  href?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "/assets/images-dashboard/icons/01.svg",
    href: "/dashboard",
  },
  {
    title: "Pedidos",
    icon: "/assets/images-dashboard/icons/09.svg",
    children: [
      { title: "Pedidos", href: "/dashboard/order" },
      { title: "Detalhes do Pedido", href: "/dashboard/order-details" },
    ],
  },
  {
    title: "Produto",
    icon: "/assets/images-dashboard/icons/02.svg",
    children: [
      { title: "Lista de Produtos", href: "/dashboard/product-list" },
      { title: "Adicionar Produto", href: "/dashboard/add-product" },
    ],
  },
  {
    title: "Transações",
    icon: "/assets/images-dashboard/icons/06.svg",
    href: "/dashboard/transaction",
  },
  {
    title: "Avaliações",
    icon: "/assets/images-dashboard/icons/07.svg",
    href: "/dashboard/review",
  },
  {
    title: "Pagamentos",
    icon: "/assets/images-dashboard/icons/17.svg",
    href: "/dashboard/payment",
  },
  {
    title: "Perfil do Usuário",
    icon: "/assets/images-dashboard/icons/05.svg",
    children: [
      { title: "Configurações do Perfil", href: "/dashboard/profile-setting" },
      { title: "Log In", href: "/dashboard/log-in" },
      { title: "Registro", href: "/dashboard/registration" },
    ],
  },
];

const SidebarMenu = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // 0 significa Dashboard aberta por padrão.
  const pathname = usePathname();

  useEffect(() => {
    // Encontra o índice do item de menu que possui um filho correspondente ao caminho atual
    const activeIndex = menuItems.findIndex((item) => {
      return item.children?.some((child) => {
        return pathname === child.href || (child.title === "Main Demo" && pathname === "/index");
      });
    });

    if (activeIndex !== -1) {
      setOpenIndex(activeIndex);
    }
  }, [pathname]);

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <ul className="rts-side-nav-area-left menu-active-parent">
      {menuItems.map((item, index) => {
        const hasSubmenu = !!item.children?.length;
        const isOpen = openIndex === index;

        return (
          <li className="single-menu-item" key={index}>
            {hasSubmenu ? (
              <Link
                href="#"
                className={`with-plus ${isOpen ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle(index);
                }}
              >
                <img src={item.icon} alt="icon" className="icon" />
                <p>{item.title}</p>
              </Link>
            ) : (
              <Link href={item.href || "#"}>
                <img src={item.icon} alt="icon" className="icon" />
                <p>{item.title}</p>
              </Link>
            )}

            {hasSubmenu && (
              <ul className={`submenu mm-collapse parent-nav ${isOpen ? "mm-show" : ""}`}>
                {item.children!.map((sub, subIndex) => {
                  const isActive = pathname === sub.href || (sub.title === "Main Demo" && pathname === "/index");
                  return (
                    <li key={subIndex}>
                      <Link
                        href={sub.href}
                        className={`mobile-menu-link ${isActive ? "active" : ""}`}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarMenu;
