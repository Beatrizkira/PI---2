"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import products from "@/data/Product.json";
import { formatBRL, parseBRL } from "@/utils/currency";
import styles from "./detalhes_peca.module.css";

const STORAGE_KEY = "es-empilhadeiras-product-details";
const MAX_IMAGE_SIZE = 1024 * 1024;

type CatalogProduct = (typeof products)[number];
type ProductDetails = {
  title: string;
  category: string;
  price: string;
  description: string;
  tags: string;
  image: string;
};
type SavedDetails = Record<number, ProductDetails>;

function isProductDetails(value: unknown): value is ProductDetails {
  if (typeof value !== "object" || value === null) return false;
  const details = value as Record<string, unknown>;
  return ["title", "category", "price", "description", "tags", "image"].every(
    (key) => typeof details[key] === "string",
  );
}

function getDefaultDetails(product: CatalogProduct): ProductDetails {
  return {
    title: product.title,
    category: product.category,
    price: product.price,
    description: product.descripTion,
    tags: product.category,
    image: `/assets/images/grocery/${product.image}`,
  };
}

export default function DetalhesPeca({ productId }: { productId?: string }) {
  const product = products.find((item) => String(item.id) === productId);
  const [details, setDetails] = useState<ProductDetails | null>(
    product ? getDefaultDetails(product) : null,
  );
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!product) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed: unknown = JSON.parse(saved);
      if (typeof parsed !== "object" || parsed === null) {
        setFeedback("Os dados salvos desta peça estão inválidos.");
        return;
      }

      const savedDetails = (parsed as Record<string, unknown>)[String(product.id)];
      if (savedDetails === undefined) return;
      if (!isProductDetails(savedDetails)) {
        setFeedback("Os dados salvos desta peça estão inválidos.");
        return;
      }
      setDetails(savedDetails);
    } catch {
      setFeedback("Não foi possível carregar os dados salvos desta peça.");
    }
  }, [product]);

  const updateField = (field: keyof ProductDetails, value: string) => {
    setDetails((current) =>
      current ? { ...current, [field]: value } : current,
    );
    setFeedback("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback("Selecione um arquivo de imagem.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFeedback("A imagem deve ter no máximo 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("image", reader.result);
      } else {
        setFeedback("Não foi possível carregar a imagem selecionada.");
      }
    };
    reader.onerror = () =>
      setFeedback("Não foi possível carregar a imagem selecionada.");
    reader.readAsDataURL(file);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product || !details) return;

    try {
      parseBRL(details.price);
    } catch {
      setFeedback("Informe um preço válido, por exemplo: 125,90.");
      return;
    }

    if (!details.title.trim() || !details.category.trim()) {
      setFeedback("Preencha o nome e a categoria da peça.");
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : {};
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        setFeedback("Os dados salvos de produtos estão inválidos.");
        return;
      }

      const updatedDetails: SavedDetails = {
        ...(parsed as SavedDetails),
        [product.id]: details,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDetails));
      setFeedback("Detalhes da peça salvos com sucesso.");
    } catch {
      setFeedback(
        "Não foi possível salvar. Verifique o espaço disponível no navegador.",
      );
    }
  };

  if (!product || !details) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1>Peça não encontrada</h1>
            <p>Não encontramos uma peça correspondente a este endereço.</p>
            <Link href="/estoque">Voltar ao estoque</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/estoque">Estoque</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Detalhes da peça</span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          <form className={styles.card} onSubmit={handleSave}>
            <header className={styles.heading}>
              <div>
                <p className={styles.eyebrow}>ESTOQUE / PEÇAS</p>
                <h1>Editar peça</h1>
                <p>Atualize as informações e a imagem do produto.</p>
              </div>
              <span className={styles.sku}>
                SKU {String(product.id).padStart(4, "0")}
              </span>
            </header>

            <div className={styles.formGrid}>
              <div className={styles.imageColumn}>
                <span className={styles.label}>Imagem da peça</span>
                <div className={styles.imagePreview}>
                  <img src={details.image} alt={`Imagem de ${details.title}`} />
                </div>
                <label className={styles.uploadButton}>
                  <i className="fa-regular fa-image" aria-hidden="true" />
                  Selecionar imagem
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                  />
                </label>
                <span className={styles.helpText}>Imagem de até 1 MB.</span>
              </div>

              <div className={styles.fields}>
                <label className={styles.field}>
                  <span className={styles.label}>Nome da peça</span>
                  <input
                    required
                    value={details.title}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </label>

                <div className={styles.twoColumns}>
                  <label className={styles.field}>
                    <span className={styles.label}>Categoria</span>
                    <input
                      required
                      value={details.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>Preço</span>
                    <div className={styles.priceInput}>
                      <span>R$</span>
                      <input
                        inputMode="decimal"
                        value={details.price}
                        onChange={(event) =>
                          updateField("price", event.target.value)
                        }
                        aria-describedby="price-preview"
                      />
                    </div>
                    <span className={styles.helpText} id="price-preview">
                      {(() => {
                        try {
                          return formatBRL(details.price);
                        } catch {
                          return "Digite um preço válido.";
                        }
                      })()}
                    </span>
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.label}>Descrição</span>
                  <textarea
                    rows={5}
                    value={details.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Tags</span>
                  <input
                    placeholder="Separe as tags por vírgula"
                    value={details.tags}
                    onChange={(event) => updateField("tags", event.target.value)}
                  />
                </label>
              </div>
            </div>

            <footer className={styles.footer}>
              <p role="status" aria-live="polite">
                {feedback}
              </p>
              <div className={styles.actions}>
                <Link className={styles.cancelButton} href="/estoque">
                  Cancelar
                </Link>
                <button className={styles.saveButton} type="submit">
                  Salvar alterações
                </button>
              </div>
            </footer>
            <p className={styles.storageNote}>
              As alterações são salvas neste navegador.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}