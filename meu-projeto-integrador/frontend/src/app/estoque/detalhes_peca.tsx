"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { api, Product } from "@/lib/api";
import { formatBRL, parseBRL } from "@/utils/currency";
import styles from "./detalhes_peca.module.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
type ProductForm = Omit<Product, "id" | "sku" | "slug">;
const emptyProduct: ProductForm = { title: "", category: "", price: "", description: "", tags: "", image: "", stock: 0 };

export default function DetalhesPeca({ productId, isNew = false }: { productId?: string; isNew?: boolean }) {
  const [details, setDetails] = useState<ProductForm | null>(isNew ? emptyProduct : null);
  const [sku, setSku] = useState("");
  const [feedback, setFeedback] = useState("");
  const id = productId ? Number(productId) : null;

  useEffect(() => {
    if (isNew || !id) return;
    api.product(id).then(({ product }) => { setDetails({ title: product.title, category: product.category, price: product.price, description: product.description, tags: product.tags, image: product.image || "", stock: product.stock }); setSku(product.sku); }).catch((error) => setFeedback(error instanceof Error ? error.message : "Não foi possível carregar a peça."));
  }, [id, isNew]);

  function updateField(field: keyof ProductForm, value: string | number) {
    setDetails((current) => current ? { ...current, [field]: value } : current);
    setFeedback("");
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE) {
      setFeedback(file.type.startsWith("image/") ? "A imagem deve ter no máximo 1 MB." : "Selecione um arquivo de imagem.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? updateField("image", reader.result) : setFeedback("Não foi possível carregar a imagem.");
    reader.onerror = () => setFeedback("Não foi possível carregar a imagem.");
    reader.readAsDataURL(file);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!details) return;
    try { parseBRL(details.price); } catch { setFeedback("Informe um preço válido, por exemplo: 125,90."); return; }
    if (!details.title.trim() || !details.category.trim()) { setFeedback("Preencha o nome e a categoria da peça."); return; }
    try {
      const result = isNew ? await api.createProduct(details) : await api.updateProduct(id as number, details);
      setSku(result.product.sku);
      setFeedback("Detalhes da peça salvos com sucesso.");
      if (isNew) window.history.replaceState(null, "", `/estoque/detalhes_peca?id=${result.product.id}`);
    } catch (error) { setFeedback(error instanceof Error ? error.message : "Não foi possível salvar a peça."); }
  }

  if (!details) return <main className={styles.page}><div className={styles.container}><div className={styles.notFound}><h1>Peça não encontrada</h1><p>{feedback || "Não encontramos uma peça correspondente a este endereço."}</p><Link href="/estoque">Voltar ao estoque</Link></div></div></main>;
  return <main className={styles.page}><div className={styles.breadcrumb}><div className={styles.container}><Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/estoque">Estoque</Link><span aria-hidden="true">›</span><span aria-current="page">{isNew ? "Adicionar peça" : "Detalhes da peça"}</span></div></div><section className={styles.section}><div className={styles.container}><form className={styles.card} onSubmit={handleSave}><header className={styles.heading}><div><p className={styles.eyebrow}>ESTOQUE / PEÇAS</p><h1>{isNew ? "Adicionar peça" : "Editar peça"}</h1><p>Atualize as informações e a imagem do produto.</p></div>{sku && <span className={styles.sku}>SKU {sku}</span>}</header><div className={styles.formGrid}><div className={styles.imageColumn}><span className={styles.label}>Imagem da peça</span><div className={styles.imagePreview}>{details.image ? <img src={details.image} alt={`Imagem de ${details.title}`} /> : <span>Sem imagem</span>}</div><label className={styles.uploadButton}><i className="fa-regular fa-image" aria-hidden="true" />Selecionar imagem<input accept="image/*" type="file" onChange={handleImageChange} /></label><span className={styles.helpText}>Imagem de até 5 MB.</span></div><div className={styles.fields}><label className={styles.field}><span className={styles.label}>Nome da peça</span><input required value={details.title} onChange={(event) => updateField("title", event.target.value)} /></label><div className={styles.twoColumns}><label className={styles.field}><span className={styles.label}>Categoria</span><input required value={details.category} onChange={(event) => updateField("category", event.target.value)} /></label><label className={styles.field}><span className={styles.label}>Preço</span><div className={styles.priceInput}><span>R$</span><input inputMode="decimal" value={details.price} onChange={(event) => updateField("price", event.target.value)} /></div><span className={styles.helpText}>{(() => { try { return formatBRL(details.price); } catch { return "Digite um preço válido."; } })()}</span></label></div><label className={styles.field}><span className={styles.label}>Descrição</span><textarea rows={5} value={details.description} onChange={(event) => updateField("description", event.target.value)} /></label><label className={styles.field}><span className={styles.label}>Tags</span><input placeholder="Separe as tags por vírgula" value={details.tags} onChange={(event) => updateField("tags", event.target.value)} /></label><label className={styles.field}><span className={styles.label}>Estoque</span><input type="number" min="0" step="1" value={details.stock} onChange={(event) => updateField("stock", Number(event.target.value))} /></label></div></div><footer className={styles.footer}><p role="status" aria-live="polite">{feedback}</p><div className={styles.actions}><Link className={styles.cancelButton} href="/estoque">Cancelar</Link><button className={styles.saveButton} type="submit">Salvar alterações</button></div></footer><p className={styles.storageNote}>Os dados são salvos no banco de dados.</p></form></div></section></main>;
}
