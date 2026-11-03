-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "nome" TEXT,
    "sobrenome" TEXT,
    "nomeExibicao" TEXT,
    "tipoPerfil" TEXT NOT NULL DEFAULT 'cliente',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "precoBase" DOUBLE PRECISION NOT NULL,
    "precoDesconto" DOUBLE PRECISION,
    "quantidadeEstoque" INTEGER NOT NULL DEFAULT 0,
    "urlImagem" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
