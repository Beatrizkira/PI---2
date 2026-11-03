"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, Product } from "@/lib/api";
import { formatBRL, parseBRL } from "@/utils/currency";
import styles from "./estoque.module.css";

const LOW_STOCK_LIMIT = 5;

export default function Estoque() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    api.products().then(({ products: items }) => {
      setProducts(items);
      setStock(Object.fromEntries(items.map((product) => [product.id, String(product.stock)])));
    }).catch((error) => setFeedback(error instanceof Error ? error.message : "Não foi possível carregar o estoque."));
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return term ? products.filter((product) => `${product.title} ${product.category} ${product.id}`.toLocaleLowerCase("pt-BR").includes(term)) : products;
  }, [products, search]);

  const totalUnits = products.reduce((total, product) => total + (Number(stock[product.id]) || 0), 0);
  const lowStockCount = products.filter((product) => Number(stock[product.id]) <= LOW_STOCK_LIMIT).length;

  async function saveStock() {
    const invalid = products.some((product) => !/^\d+$/.test(stock[product.id] ?? ""));
    if (invalid) { setFeedback("Informe uma quantidade inteira igual ou maior que zero para cada produto."); return; }
    try {
      await Promise.all(products.map((product) => api.updateStock(product.id, Number(stock[product.id]))));
      setProducts((current) => current.map((product) => ({ ...product, stock: Number(stock[product.id]) })));
      setFeedback("Estoque atualizado com sucesso.");
    } catch (error) { setFeedback(error instanceof Error ? error.message : "Não foi possível salvar o estoque."); }
  }

  async function removeProduct(product: Product) {
    if (!window.confirm(`Remover "${product.title}" do estoque?`)) return;
    try {
      await api.deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setStock((current) => {
        const updated = { ...current };
        delete updated[product.id];
        return updated;
      });
      setFeedback("Produto removido com sucesso.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível remover o produto.");
    }
  }

  return <main className={styles.page}><div className={styles.breadcrumb}><div className={styles.container}><Link href="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Estoque</span></div></div><section className={styles.section}><div className={styles.container}><div className={styles.heading}><div><p className={styles.eyebrow}>GESTÃO DE PRODUTOS</p><h1>Estoque</h1><p className={styles.description}>Consulte e atualize a quantidade disponível de cada produto.</p></div><div><Link className={styles.saveButton} href="/estoque/detalhes_peca?new=1">Adicionar produto</Link><label className={styles.search}><span className={styles.srOnly}>Buscar produto</span><i className="fa-regular fa-magnifying-glass" aria-hidden="true" /><input type="search" placeholder="Buscar produto..." value={search} onChange={(event) => setSearch(event.target.value)} /></label></div></div><div className={styles.summary} aria-label="Resumo do estoque"><div className={styles.summaryCard}><span>Produtos cadastrados</span><strong>{products.length}</strong></div><div className={styles.summaryCard}><span>Unidades em estoque</span><strong>{totalUnits}</strong></div><div className={styles.summaryCard}><span>Estoque baixo</span><strong className={lowStockCount > 0 ? styles.warning : undefined}>{lowStockCount}</strong></div></div><div className={styles.tableCard}><div className={styles.tableScroll}><table className={styles.table}><thead><tr><th>Produto</th><th>Preço</th><th>Em estoque</th><th>Valor em estoque</th><th>Detalhes</th><th>Remover</th></tr></thead><tbody>{filteredProducts.map((product) => { const quantity = Number(stock[product.id]) || 0; let price = 0; try { price = parseBRL(product.price); } catch { /* API data is validated by the backend. */ } return <tr key={product.id}><td><div className={styles.product}><img className={styles.productImage} src={product.image || "/assets/images/logo/fav.png"} alt="" /><div><Link className={styles.productName} href={`/estoque/detalhes_peca?id=${product.id}`}>{product.title}</Link><span className={styles.productMeta}>{product.category} · SKU {product.sku}</span></div></div></td><td className={styles.money}>{formatBRL(price)}</td><td><div className={styles.quantityCell}><input aria-label={`Quantidade em estoque: ${product.title}`} type="number" min="0" step="1" value={stock[product.id] ?? ""} onChange={(event) => setStock({ ...stock, [product.id]: event.target.value })} />{quantity <= LOW_STOCK_LIMIT && <span className={styles.lowStock}>Baixo</span>}</div></td><td className={styles.money}>{formatBRL(price * quantity)}</td><td><Link className={styles.detailsButton} href={`/estoque/detalhes_peca?id=${product.id}`}>Detalhes da peça</Link></td><td><button type="button" aria-label={`Remover ${product.title}`} title="Remover produto" onClick={() => removeProduct(product)} style={{ color: "#c62828", background: "transparent", border: 0, cursor: "pointer", fontSize: "1.25rem", fontWeight: 700 }}>✕</button></td></tr>})}{filteredProducts.length === 0 && <tr><td className={styles.emptyState} colSpan={6}>Nenhum produto encontrado.</td></tr>}</tbody></table></div><div className={styles.tableFooter}><p role="status" aria-live="polite">{feedback}</p><button className={styles.saveButton} onClick={saveStock}>Salvar alterações</button></div></div><p className={styles.storageNote}>Os dados são salvos no banco de dados.</p></div></section></main>;
}
