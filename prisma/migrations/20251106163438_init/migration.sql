-- CreateTable
CREATE TABLE "Weather" (
    "id" SERIAL NOT NULL,
    "cidade" TEXT NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "umidade" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Weather_pkey" PRIMARY KEY ("id")
);
