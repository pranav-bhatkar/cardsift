-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('Premium', 'Travel', 'Cashback', 'Business', 'Lifestyle', 'Fuel');

-- CreateEnum
CREATE TYPE "RewardPeriod" AS ENUM ('monthly', 'quarterly', 'annually');

-- CreateEnum
CREATE TYPE "LoungeNetwork" AS ENUM ('Priority Pass', 'Dreamfolks', 'Visa', 'Mastercard', 'Diners Club');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('Salaried', 'Self-Employed');

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "annualFee" DOUBLE PRECISION NOT NULL,
    "joiningFee" DOUBLE PRECISION NOT NULL,
    "cardType" "CardType" NOT NULL,
    "benefits" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "feesId" TEXT NOT NULL,
    "rewardsId" TEXT NOT NULL,
    "redemptionId" TEXT NOT NULL,
    "travelBenefitsId" TEXT NOT NULL,
    "lifestyleBenefitsId" TEXT NOT NULL,
    "eligibilityCriteriaId" TEXT NOT NULL,
    "finePrintId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeWaiver" (
    "id" TEXT NOT NULL,
    "annualFeeIsWaiverable" BOOLEAN NOT NULL,
    "annualFeeSpendThreshold" DOUBLE PRECISION NOT NULL,
    "annualFeeDescription" TEXT NOT NULL,
    "joiningFeeIsWaiverable" BOOLEAN NOT NULL,
    "joiningFeeCondition" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,

    CONSTRAINT "FeeWaiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WelcomeBonus" (
    "id" TEXT NOT NULL,
    "bonusPoints" INTEGER,
    "bonusMiles" INTEGER,
    "cashback" DOUBLE PRECISION,
    "minSpend" DOUBLE PRECISION NOT NULL,
    "timeframeDays" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,

    CONSTRAINT "WelcomeBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "welcomeBonusId" TEXT NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fees" (
    "id" TEXT NOT NULL,
    "latePayment" TEXT NOT NULL,
    "overLimit" TEXT NOT NULL,
    "foreignTransactionPercentage" DOUBLE PRECISION NOT NULL,
    "aprPurchase" DOUBLE PRECISION NOT NULL,
    "aprCashAdvance" DOUBLE PRECISION NOT NULL,
    "interestFreePeriodDays" INTEGER NOT NULL,

    CONSTRAINT "Fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rewards" (
    "id" TEXT NOT NULL,
    "estimatedPointValueINR" DOUBLE PRECISION NOT NULL,
    "baseRatePointsPer100INR" DOUBLE PRECISION,
    "baseRateCashbackPercentage" DOUBLE PRECISION,
    "pointExpiry" TEXT NOT NULL,

    CONSTRAINT "Rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BonusCategory" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pointsPer100INR" DOUBLE PRECISION,
    "cashbackPercentage" DOUBLE PRECISION,
    "monthlyCap" DOUBLE PRECISION,
    "notes" TEXT,
    "rewardsId" TEXT NOT NULL,

    CONSTRAINT "BonusCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "spendThreshold" DOUBLE PRECISION NOT NULL,
    "reward" TEXT NOT NULL,
    "period" "RewardPeriod" NOT NULL,
    "rewardsId" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "cashEquivalent" BOOLEAN NOT NULL,
    "productCatalogue" BOOLEAN NOT NULL,
    "flightBooking" BOOLEAN NOT NULL,
    "hotelBooking" BOOLEAN NOT NULL,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirlinePartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transferRatio" TEXT NOT NULL,
    "redemptionId" TEXT NOT NULL,

    CONSTRAINT "AirlinePartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transferRatio" TEXT NOT NULL,
    "redemptionId" TEXT NOT NULL,

    CONSTRAINT "HotelPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelBenefits" (
    "id" TEXT NOT NULL,
    "loungeAccessDomestic" INTEGER NOT NULL,
    "loungeAccessInternational" INTEGER NOT NULL,
    "loungeAccessNetwork" "LoungeNetwork"[],
    "travelInsuranceHasInsurance" BOOLEAN NOT NULL,
    "travelInsuranceCoverageAmount" DOUBLE PRECISION NOT NULL,
    "travelInsuranceType" TEXT,
    "forexMarkup" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TravelBenefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifestyleBenefits" (
    "id" TEXT NOT NULL,
    "diningIsAvailable" BOOLEAN NOT NULL,
    "diningDescription" TEXT NOT NULL,
    "moviesIsAvailable" BOOLEAN NOT NULL,
    "moviesDescription" TEXT NOT NULL,
    "golfIsAvailable" BOOLEAN NOT NULL,
    "golfComplimentaryRoundsPerMonth" INTEGER NOT NULL,
    "golfDescription" TEXT NOT NULL,
    "conciergeIsAvailable" BOOLEAN NOT NULL,
    "conciergeDescription" TEXT NOT NULL,

    CONSTRAINT "LifestyleBenefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EligibilityCriteria" (
    "id" TEXT NOT NULL,
    "minIncome" DOUBLE PRECISION NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "employmentTypes" "EmploymentType"[],
    "minCreditScore" INTEGER NOT NULL,
    "existingRelationshipRequired" BOOLEAN NOT NULL,

    CONSTRAINT "EligibilityCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinePrint" (
    "id" TEXT NOT NULL,
    "capping" TEXT[],
    "exclusions" TEXT[],

    CONSTRAINT "FinePrint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_name_key" ON "CreditCard"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_feesId_key" ON "CreditCard"("feesId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_rewardsId_key" ON "CreditCard"("rewardsId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_redemptionId_key" ON "CreditCard"("redemptionId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_travelBenefitsId_key" ON "CreditCard"("travelBenefitsId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_lifestyleBenefitsId_key" ON "CreditCard"("lifestyleBenefitsId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_eligibilityCriteriaId_key" ON "CreditCard"("eligibilityCriteriaId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_finePrintId_key" ON "CreditCard"("finePrintId");

-- CreateIndex
CREATE UNIQUE INDEX "FeeWaiver_creditCardId_key" ON "FeeWaiver"("creditCardId");

-- CreateIndex
CREATE UNIQUE INDEX "WelcomeBonus_creditCardId_key" ON "WelcomeBonus"("creditCardId");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_feesId_fkey" FOREIGN KEY ("feesId") REFERENCES "Fees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_rewardsId_fkey" FOREIGN KEY ("rewardsId") REFERENCES "Rewards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "Redemption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_travelBenefitsId_fkey" FOREIGN KEY ("travelBenefitsId") REFERENCES "TravelBenefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_lifestyleBenefitsId_fkey" FOREIGN KEY ("lifestyleBenefitsId") REFERENCES "LifestyleBenefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_eligibilityCriteriaId_fkey" FOREIGN KEY ("eligibilityCriteriaId") REFERENCES "EligibilityCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_finePrintId_fkey" FOREIGN KEY ("finePrintId") REFERENCES "FinePrint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeWaiver" ADD CONSTRAINT "FeeWaiver_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WelcomeBonus" ADD CONSTRAINT "WelcomeBonus_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_welcomeBonusId_fkey" FOREIGN KEY ("welcomeBonusId") REFERENCES "WelcomeBonus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusCategory" ADD CONSTRAINT "BonusCategory_rewardsId_fkey" FOREIGN KEY ("rewardsId") REFERENCES "Rewards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_rewardsId_fkey" FOREIGN KEY ("rewardsId") REFERENCES "Rewards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirlinePartner" ADD CONSTRAINT "AirlinePartner_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "Redemption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelPartner" ADD CONSTRAINT "HotelPartner_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "Redemption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
