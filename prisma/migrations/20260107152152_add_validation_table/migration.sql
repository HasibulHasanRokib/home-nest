-- CreateTable
CREATE TABLE "Validation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalInfoVerified" BOOLEAN NOT NULL DEFAULT false,
    "personalInfoRemarks" TEXT,
    "nidSmartCardVerified" BOOLEAN NOT NULL DEFAULT false,
    "nidSmartCardRemarks" TEXT,
    "passportVerified" BOOLEAN NOT NULL DEFAULT false,
    "passportRemarks" TEXT,
    "birthCertificateVerified" BOOLEAN NOT NULL DEFAULT false,
    "birthCertificateRemarks" TEXT,
    "presentAddressVerified" BOOLEAN NOT NULL DEFAULT false,
    "presentAddressRemarks" TEXT,
    "permanentAddressVerified" BOOLEAN NOT NULL DEFAULT false,
    "permanentAddressRemarks" TEXT,
    "facebookVerified" BOOLEAN NOT NULL DEFAULT false,
    "facebookRemarks" TEXT,
    "twitterVerified" BOOLEAN NOT NULL DEFAULT false,
    "twitterRemarks" TEXT,
    "linkedinVerified" BOOLEAN NOT NULL DEFAULT false,
    "linkedinRemarks" TEXT,
    "whatsappVerified" BOOLEAN NOT NULL DEFAULT false,
    "whatsappRemarks" TEXT,
    "declarationVerified" BOOLEAN NOT NULL DEFAULT false,
    "declarationRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Validation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Validation_userId_key" ON "Validation"("userId");

-- AddForeignKey
ALTER TABLE "Validation" ADD CONSTRAINT "Validation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
