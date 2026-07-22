-- CreateTable
CREATE TABLE "MarketCapSnapshot" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "MarketCapSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketCapSnapshot_date_key" ON "MarketCapSnapshot"("date");

-- CreateIndex
CREATE INDEX "MarketCapSnapshot_date_idx" ON "MarketCapSnapshot"("date");
