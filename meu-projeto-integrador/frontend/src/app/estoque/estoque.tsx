"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import products from "@/data/Product.json";
import { formatBRL, parseBRL } from "@/utils/currency";
import styles from "./estoque.module.css";

const STORAGE_KEY = "es-empilhadeiras-stock";
const DEFAULT_STOCK = [12, 8, 24, 6, 15, 4, 9, 18, 7, 11, 5, 14, 3];
const LOW_STOCK_LIMIT = 5;
const PRODUCT_DETAILS_KEY = "es-empilhadeiras-product-details";

type StockValues = Record<number, string>;
type ProductDetail = {
  title: string;
  category: string;
  price: string;
  image: string;
};

const initialStock: StockValues = Object.fromEntries(
  products.map((product, index) => [
    product.id,
    String(DEFAULT_STOCK[index % DEFAULT_STOCK.length]),
  ]),
);

function isStockRecord(value: unknown): value is Record<string, number> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every(
      (quantity) =>
        typeof quantity === "number" &&
        Number.isInteger(quantity) &&
        quantity >= 0,
    )
  );
}

export default function Estoque() {
  const [stock, setStock] = useState<StockValues>(initialStock);
  const [productDetails, setProductDetails] = useState<
    Record<number, ProductDetail>
  >({});
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try {
      const savedStock = localStorage.getItem(STORAGE_KEY);
      if (!savedStock) return;

      const parsedStock: unknown = JSON.parse(savedStock);
      if (!isStockRecord(parsedStock)) {
        setFeedback("Os dados salvos de estoque estão inválidos. Confira as quantidades antes de salvar.");
        return;
      }

      setStock((currentStock) => {
        const updatedStock = { ...currentStock };
        products.forEach((product) => {
          const savedQuantity = parsedStock[String(product.id)];
          if (savedQuantity !== undefined) {
            updatedStock[product.id] = String(savedQuantity);
          }
        });
        return updatedStock;
      });
    } catch {
      setFeedback("Não foi possível carregar o estoque salvo neste navegador.");
    }
  }, []);

  useEffect(() => {
    try {
      const savedDetails = localStorage.getItem(PRODUCT_DETAILS_KEY);
      if (!savedDetails) return;

      const parsedDetails: unknown = JSON.parse(savedDetails);
      if (typeof parsedDetails !== "object" || parsedDetails === null) {
        setFeedback("Os dados salvos dos produtos estão inválidos.");
        return;
      }

      const validDetails: Record<number, ProductDetail> = {};
      Object.entries(parsedDetails).forEach(([id, value]) => {
        if (
          typeof value === "object" &&
          value !== null &&
          "title" in value &&
          typeof value.title === "string" &&
          "category" in value &&
          typeof value.category === "string" &&
          "price" in value &&
          typeof value.price === "string" &&
          "image" in value &&
          typeof value.image === "string"
        ) {
          validDetails[Number(id)] = value;
        }
      });
      setProductDetails(validDetails);
    } catch {
      setFeedback("Não foi possível carregar os detalhes salvos dos produtos.");
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedSearch) return products;

    return products.filter((product) => {
      const details = productDetails[product.id];
      return `${details?.title ?? product.title} ${details?.category ?? product.category} ${product.id}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedSearch);
    });
  }, [productDetails, search]);

  const totalUnits = products.reduce(
    (total, product) => total + (Number(stock[product.id]) || 0),
    0,
  );
  const lowStockCount = products.filter(
    (product) => Number(stock[product.id]) <= LOW_STOCK_LIMIT,
  ).length;

  const handleSave = () => {
    const hasInvalidQuantity = products.some(
      (product) => !/^\d+$/.test(stock[product.id] ?? ""),
    );

    if (hasInvalidQuantity) {
      setFeedback("Informe uma quantidade inteira igual ou maior que zero para cada produto.");
      return;
    }

    const stockToSave = Object.fromEntries(
      products.map((product) => [product.id, Number(stock[product.id])]),
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stockToSave));
      setFeedback("Estoque atualizado com sucesso.");
    } catch {
      setFeedback("Não foi possível salvar o estoque. Verifique o espaço disponível no navegador.");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Estoque</span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>GESTÃO DE PRODUTOS</p>
              <h1>Estoque</h1>
              <p className={styles.description}>
                Consulte e atualize a quantidade disponível de cada produto.
              </p>
            </div>
            <label className={styles.search}>
              <span className={styles.srOnly}>Buscar produto</span>
              <i className="fa-regular fa-magnifying-glass" aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar produto..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.summary} aria-label="Resumo do estoque">
            <div className={styles.summaryCard}>
              <span>Produtos cadastrados</span>
              <strong>{products.length}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Unidades em estoque</span>
              <strong>{totalUnits}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Estoque baixo</span>
              <strong className={lowStockCount > 0 ? styles.warning : undefined}>
                {lowStockCount}
              </strong>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Em estoque</th>
                    <th scope="col">Valor em estoque</th>
                    <th scope="col">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const details = productDetails[product.id];
                    const title = details?.title ?? product.title;
                    const category = details?.category ?? product.category;
                    const price = parseBRL(details?.price ?? product.price);
                    const quantity = Number(stock[product.id]) || 0;

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className={styles.product}>
                            <img
                              className={styles.productImage}
                              src={details?.image ?? `/assets/images/grocery/${product.image}`}
                              alt=""
                            />
                            <div>
                              <Link
                                className={styles.productName}
                                href={`/estoque/detalhes_peca?id=${product.id}`}
                              >
                                {title}
                              </Link>
                              <span className={styles.productMeta}>
                                {category} · SKU {String(product.id).padStart(4, "0")}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.money}>{formatBRL(price)}</td>
                        <td>
                          <div className={styles.quantityCell}>
                            <input
                              aria-label={`Quantidade em estoque: ${title}`}
                              type="number"
                              min="0"
                              step="1"
                              value={stock[product.id] ?? ""}
                              aria-invalid={!/^\d+$/.test(stock[product.id] ?? "")}
                              onChange={(event) =>
                                setStock((currentStock) => ({
                                  ...currentStock,
                                  [product.id]: event.target.value,
                                }))
                              }
                            />
                            {quantity <= LOW_STOCK_LIMIT && (
                              <span className={styles.lowStock}>Baixo</span>
                            )}
                          </div>
                        </td>
                        <td className={styles.money}>
                          {formatBRL(price * quantity)}
                        </td>
                        <td>
                          <Link
                            className={styles.detailsButton}
                            href={`/estoque/detalhes_peca?id=${product.id}`}
                          >
                            Detalhes da peça
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td className={styles.emptyState} colSpan={5}>
                        Nenhum produto encontrado para “{search}”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.tableFooter}>
              <p role="status" aria-live="polite">
                {feedback}
              </p>
              <button className={styles.saveButton} onClick={handleSave}>
                Salvar alterações
              </button>
            </div>
          </div>
          <p className={styles.storageNote}>
            As alterações são salvas neste navegador.
          </p>
        </div>
      </section>
    </main>
  );
}
