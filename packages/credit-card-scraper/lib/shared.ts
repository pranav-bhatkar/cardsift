import {
  PrismaClient,
  Prisma,
  CardType,
  LoungeNetwork,
  EmploymentType,
  RewardPeriod,
  CreditCard,
  FeeWaiver,
  WelcomeBonus,
  Voucher,
  Fees,
  Rewards,
  BonusCategory,
  Milestone,
  Redemption,
  AirlinePartner,
  HotelPartner,
  TravelBenefits,
  LifestyleBenefits,
  EligibilityCriteria,
  FinePrint,
} from "../../../src/generated/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer, { HTTPResponse } from "puppeteer";
import dotenv from "dotenv";
import axios from "axios";

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-05-20";
dotenv.config();
export const prisma = new PrismaClient();
export const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string,
);

export interface AICreditCardData {
  id: string;
  name: string;
  bank: string;
  image: string;
  annualFee: number;
  joiningFee: number;
  feeWaiver: {
    annualFee: {
      isWaiverable: boolean;
      spendThreshold: number;
      description: string;
    };
    joiningFee: {
      isWaiverable: boolean;
      condition: string;
    };
  } | null;
  cardType: CardType;
  benefits: string[];
  rating: number;
  description: string;
  welcomeBonus: {
    bonusPoints?: number;
    bonusMiles?: number;
    cashback?: number;
    vouchers?: { brand: string; value: number }[];
    minSpend: number;
    timeframeDays: number;
    description: string;
  } | null;
  fees: {
    latePayment: string;
    overLimit: string;
    foreignTransactionPercentage: number;
    apr: {
      purchase: number;
      cashAdvance: number;
    };
    interestFreePeriodDays: number;
  };
  rewards: {
    estimatedPointValueINR: number;
    baseRate: {
      pointsPer100INR?: number;
      cashbackPercentage?: number;
    };
    bonusCategories: {
      category: string;
      pointsPer100INR?: number;
      cashbackPercentage?: number;
      monthlyCap?: number;
      notes?: string;
    }[];
    milestones: {
      spendThreshold: number;
      reward: string;
      period: RewardPeriod;
    }[];
    pointExpiry: string;
  };
  redemption: {
    cashEquivalent: boolean;
    productCatalogue: boolean;
    flightBooking: boolean;
    hotelBooking: boolean;
    airlinePartners: { name: string; transferRatio: string }[];
    hotelPartners: { name: string; transferRatio: string }[];
  };
  travelBenefits: {
    loungeAccess: {
      domestic: number;
      international: number;
      network: (
        | "Priority Pass"
        | "Dreamfolks"
        | "Visa"
        | "Mastercard"
        | "Diners Club"
      )[];
    };
    travelInsurance: {
      hasInsurance: boolean;
      coverageAmount: number;
      type: string | null;
    };
    forexMarkup: number;
  };
  lifestyleBenefits: {
    dining: { isAvailable: boolean; description: string };
    movies: { isAvailable: boolean; description: string };
    golf: {
      isAvailable: boolean;
      complimentaryRoundsPerMonth: number;
      description: string;
    };
    concierge: { isAvailable: boolean; description: string };
  };
  eligibilityCriteria: {
    minIncome: number;
    minAge: number;
    maxAge: number;
    employmentTypes: ("Salaried" | "Self-Employed")[];
    minCreditScore: number;
    existingRelationshipRequired: boolean;
  };
  finePrint: {
    capping: string[];
    exclusions: string[];
  };
  lastUpdated: string;
}

export type ScrapeResult = {
  status: "ok" | "error";
  message?: string;
  text?: string;
  cardImageUrl?: string;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function findBankLogo(bankName: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  const placeholderLogo = "/placeholder-bank-logo.png";

  if (!apiKey || !searchEngineId) {
    console.warn(
      "Google Search credentials not found in .env. Skipping logo search.",
    );
    return placeholderLogo;
  }

  try {
    const query = `${bankName} logo official transparent background`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
      query,
    )}&searchType=image&imgSize=medium&num=1`;
    const response = await axios.get(url);
    const firstResult = response.data.items?.[0];
    if (firstResult?.link) {
      console.log(`Found logo for ${bankName} via Google Search.`);
      return firstResult.link;
    }
  } catch (error: any) {
    console.warn(
      `Google Image Search failed for "${bankName}": ${error.message}`,
    );
  }

  try {
    const domain =
      bankName
        .toLowerCase()
        .replace(/ bank| limited/g, "")
        .replace(/ /g, "") + ".com";
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    console.log(`Falling back to favicon for ${bankName} at ${domain}.`);
    return faviconUrl;
  } catch (error: any) {
    console.warn(`Favicon lookup failed for "${bankName}": ${error.message}`);
  }

  return placeholderLogo;
}

export async function scrapeWebsite(startUrl: string): Promise<ScrapeResult> {
  console.log(`Launching browser and navigating to ${startUrl}...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  let combinedText = "";

  try {
    const response: HTTPResponse | null = await page.goto(startUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    if (!response || !response.ok()) {
      return {
        status: "error",
        message: `Website down or unreachable. Status: ${
          response?.status() || "unknown"
        }`,
      };
    }

    combinedText = await page.evaluate(() => document.body.innerText);
    const lowerCaseText = combinedText.toLowerCase();

    if (
      lowerCaseText.includes("page not found") ||
      lowerCaseText.includes("404 error")
    ) {
      return { status: "error", message: "Page not found (404)." };
    }
    if (
      !lowerCaseText.includes("credit card") &&
      !lowerCaseText.includes("annual fee")
    ) {
      return {
        status: "error",
        message: "Page does not seem to be about a credit card.",
      };
    }

    const cardImageUrl = await page.evaluate(() => {
      const cardTitleElement = document.querySelector("h1");
      const cardTitle = cardTitleElement
        ? cardTitleElement.innerText.toLowerCase()
        : "";
      let bestImageSrc: string | undefined = undefined;
      let bestScore = 0;

      document.querySelectorAll("img").forEach((img) => {
        const alt = img.alt.toLowerCase();
        const src = img.src.toLowerCase();
        let score = 0;
        if (alt.includes("card") || src.includes("card")) score += 2;
        if (cardTitle && alt.includes(cardTitle)) score += 5;
        if (img.width > 200 && img.height > 100) score += 3;
        if (img.width < 50 || img.height < 50) score -= 5;

        if (score > bestScore) {
          bestScore = score;
          bestImageSrc = img.src;
        }
      });
      return bestImageSrc;
    });

    console.log("Successfully scraped the main page.");

    const keywords: string[] = [
      "fees",
      "charges",
      "rewards",
      "benefits",
      "terms",
    ];
    const discoveredLinks: string[] = await page.evaluate(
      (kws, baseUrl) => {
        const uniqueUrls = new Set<string>();
        document.querySelectorAll("a").forEach((link) => {
          const linkText = link.innerText.toLowerCase();
          const hasKeyword = kws.some((keyword) => linkText.includes(keyword));
          if (hasKeyword && link.href) {
            uniqueUrls.add(new URL(link.href, baseUrl).href);
          }
        });
        return Array.from(uniqueUrls);
      },
      keywords,
      startUrl,
    );

    const linksToVisit = discoveredLinks.slice(0, 4);
    for (const link of linksToVisit) {
      try {
        await page.goto(link, { waitUntil: "networkidle2", timeout: 45000 });
        const subPageText = await page.evaluate(() => document.body.innerText);
        combinedText += `\n\n--- NEW PAGE CONTENT ---\n\n${subPageText}`;
      } catch (error) {
        console.warn(
          `Could not scrape sub-page ${link}: ${(error as Error).message}`,
        );
      }
    }

    return { status: "ok", text: combinedText, cardImageUrl };
  } finally {
    await browser.close();
  }
}

async function getAiResponse(prompt: string): Promise<AICreditCardData> {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
  const MAX_RETRIES = 4;
  const INITIAL_BACKOFF_MS = 2000;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      console.log(
        `Sending text to Gemini for structuring (Attempt ${attempts + 1})...`,
      );
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      text = text.trim();
      if (text.startsWith("```json")) {
        text = text.substring(7, text.length - 3).trim();
      } else if (text.startsWith("```")) {
        text = text.substring(3, text.length - 3).trim();
      }

      const structuredData = JSON.parse(text);
      console.log("Successfully parsed structured data from AI response.");
      return structuredData as AICreditCardData;
    } catch (error: any) {
      if (error.status === 429 && attempts < MAX_RETRIES - 1) {
        attempts++;
        const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, attempts - 1);
        console.warn(
          `Rate limit hit. Retrying in ${backoffTime / 1000} seconds...`,
        );
        await delay(backoffTime);
      } else {
        console.error("Failed to get structured data from AI:", error);
        if (error.status === 429) {
          throw new Error(
            `Exceeded Gemini API rate limits after ${MAX_RETRIES} attempts.`,
          );
        }
        throw error;
      }
    }
  }
  throw new Error(
    `Failed to get structured data from AI after ${MAX_RETRIES} attempts.`,
  );
}

export async function getStructuredDataForAdd(
  rawText: string,
): Promise<AICreditCardData> {
  const prompt = `
You are an expert data extraction system. Analyze the following raw text scraped from a credit card webpage and convert it into a structured JSON object.
The JSON object MUST conform to the following schema. Do not add any extra keys. If a value is not found, use 0 for numbers, an empty string for strings, and an empty object or array where appropriate.

SCHEMA:
{
  "id": "string",
  "name": "string",
  "bank": "string",
  "image": "string",
  "annualFee": 0,
  "joiningFee": 0,
  "feeWaiver": {
    "annualFee": { "isWaiverable": false, "spendThreshold": 0, "description": "string" },
    "joiningFee": { "isWaiverable": false, "condition": "string" }
  } | null,
  "cardType": "Premium" | "Travel" | "Cashback" | "Business" | "Lifestyle" | "Fuel",
  "benefits": [],
  "rating": 0,
  "description": "string",
  "welcomeBonus": {
    "bonusPoints": 0, "bonusMiles": 0, "cashback": 0,
    "vouchers": [{ "brand": "string", "value": 0 }],
    "minSpend": 0, "timeframeDays": 0, "description": "string"
  } | null,
  "fees": {
    "latePayment": "string", "overLimit": "string", "foreignTransactionPercentage": 0,
    "apr": { "purchase": 0, "cashAdvance": 0 },
    "interestFreePeriodDays": 0
  },
  "rewards": {
    "estimatedPointValueINR": 0,
    "baseRate": { "pointsPer100INR": 0, "cashbackPercentage": 0 },
    "bonusCategories": [{ "category": "string", "pointsPer100INR": 0, "cashbackPercentage": 0, "monthlyCap": 0, "notes": "string" }],
    "milestones": [{ "spendThreshold": 0, "reward": "string", "period": "monthly" | "quarterly" | "annually" }],
    "pointExpiry": "string"
  },
  "redemption": {
    "cashEquivalent": false, "productCatalogue": false, "flightBooking": false, "hotelBooking": false,
    "airlinePartners": [{ "name": "string", "transferRatio": "string" }],
    "hotelPartners": [{ "name": "string", "transferRatio": "string" }]
  },
  "travelBenefits": {
    "loungeAccess": { "domestic": 0, "international": 0, "network": ["Priority Pass", "Dreamfolks", "Visa", "Mastercard", "Diners Club"] },
    "travelInsurance": { "hasInsurance": false, "coverageAmount": 0, "type": null },
    "forexMarkup": 0
  },
  "lifestyleBenefits": {
    "dining": { "isAvailable": false, "description": "string" },
    "movies": { "isAvailable": false, "description": "string" },
    "golf": { "isAvailable": false, "complimentaryRoundsPerMonth": 0, "description": "string" },
    "concierge": { "isAvailable": false, "description": "string" }
  },
  "eligibilityCriteria": {
    "minIncome": 0, "minAge": 0, "maxAge": 0,
    "employmentTypes": ["Salaried", "Self-Employed"],
    "minCreditScore": 0, "existingRelationshipRequired": false
  },
  "finePrint": { "capping": [], "exclusions": [] },
  "lastUpdated": "string"
}

Think step-by-step. First, identify the card's name and bank. Then, find the annual and joining fees. Then, detail the rewards and other benefits.
Finally, construct the JSON object. Return ONLY the valid JSON object and nothing else.

RAW TEXT:
---
${rawText}
`;
  return getAiResponse(prompt);
}

export async function getStructuredDataForUpdate(
  existingDataJson: string,
  scrapedText: string,
): Promise<AICreditCardData> {
  const prompt = `
You are an expert data update system. You will be given an existing JSON object representing a credit card's data, and new text scraped from its official webpage.
Your task is to intelligently merge the new information into the existing JSON data.
- Prioritize information from the "NEWLY SCRAPED TEXT".
- If a value has changed (e.g., annual fee), update it.
- If a value is present in the new text but not the old JSON, add it.
- If a value exists in the old JSON but is no longer mentioned in the new text, you can choose to keep it or remove it based on context (e.g., keep benefits, but remove a temporary offer).
- Ensure the final JSON object strictly conforms to the provided schema. Do not add extra keys.

EXISTING JSON DATA:
---
${existingDataJson}
---

NEWLY SCRAPED TEXT:
---
${scrapedText}
---

Return ONLY the single, complete, and updated valid JSON object and nothing else.
`;
  return getAiResponse(prompt);
}

export function transformForCreate(
  aiData: AICreditCardData,
  bankId: string,
  sourceUrl: string,
  cardImageUrl?: string,
): { data: Prisma.CreditCardCreateInput } {
  const mapStringToEnum = <T extends string>(
    value: string,
    enumObject: object,
  ): T => {
    const enumKey = value.replace(/ /g, "_");
    if (Object.values(enumObject).includes(enumKey)) {
      return enumKey as T;
    }
    return Object.values(enumObject)[0] as T;
  };

  const prismaData: Prisma.CreditCardCreateInput = {
    bank: { connect: { id: bankId } },
    name: aiData.name,
    image: cardImageUrl || aiData.image,
    sourceUrl: sourceUrl,
    annualFee: aiData.annualFee,
    joiningFee: aiData.joiningFee,
    cardType: aiData.cardType,
    benefits: aiData.benefits,
    rating: aiData.rating,
    description: aiData.description,
    fees: {
      create: {
        latePayment: aiData.fees.latePayment,
        overLimit: aiData.fees.overLimit,
        foreignTransactionPercentage: aiData.fees.foreignTransactionPercentage,
        interestFreePeriodDays: aiData.fees.interestFreePeriodDays,
        aprPurchase: aiData.fees.apr.purchase,
        aprCashAdvance: aiData.fees.apr.cashAdvance,
      },
    },
    rewards: {
      create: {
        estimatedPointValueINR: aiData.rewards.estimatedPointValueINR,
        baseRatePointsPer100INR: aiData.rewards.baseRate?.pointsPer100INR,
        baseRateCashbackPercentage: aiData.rewards.baseRate?.cashbackPercentage,
        pointExpiry: aiData.rewards.pointExpiry,
        bonusCategories: { create: aiData.rewards.bonusCategories },
        milestones: { create: aiData.rewards.milestones },
      },
    },
    redemption: {
      create: {
        ...aiData.redemption,
        airlinePartners: { create: aiData.redemption.airlinePartners },
        hotelPartners: { create: aiData.redemption.hotelPartners },
      },
    },
    travelBenefits: {
      create: {
        loungeAccessDomestic: aiData.travelBenefits.loungeAccess.domestic,
        loungeAccessInternational:
          aiData.travelBenefits.loungeAccess.international,
        loungeAccessNetwork: aiData.travelBenefits.loungeAccess.network.map(
          (n) => mapStringToEnum<LoungeNetwork>(n, LoungeNetwork),
        ),
        travelInsuranceHasInsurance:
          aiData.travelBenefits.travelInsurance.hasInsurance,
        travelInsuranceCoverageAmount:
          aiData.travelBenefits.travelInsurance.coverageAmount,
        travelInsuranceType: aiData.travelBenefits.travelInsurance.type,
        forexMarkup: aiData.travelBenefits.forexMarkup,
      },
    },
    lifestyleBenefits: {
      create: {
        diningIsAvailable: aiData.lifestyleBenefits.dining.isAvailable,
        diningDescription: aiData.lifestyleBenefits.dining.description,
        moviesIsAvailable: aiData.lifestyleBenefits.movies.isAvailable,
        moviesDescription: aiData.lifestyleBenefits.movies.description,
        golfIsAvailable: aiData.lifestyleBenefits.golf.isAvailable,
        golfComplimentaryRoundsPerMonth:
          aiData.lifestyleBenefits.golf.complimentaryRoundsPerMonth,
        golfDescription: aiData.lifestyleBenefits.golf.description,
        conciergeIsAvailable: aiData.lifestyleBenefits.concierge.isAvailable,
        conciergeDescription: aiData.lifestyleBenefits.concierge.description,
      },
    },
    eligibilityCriteria: {
      create: {
        ...aiData.eligibilityCriteria,
        employmentTypes: aiData.eligibilityCriteria.employmentTypes.map((e) =>
          mapStringToEnum<EmploymentType>(e, EmploymentType),
        ),
      },
    },
    finePrint: {
      create: aiData.finePrint,
    },
  };

  if (aiData.feeWaiver) {
    prismaData.feeWaiver = {
      create: {
        annualFeeIsWaiverable: aiData.feeWaiver.annualFee.isWaiverable,
        annualFeeSpendThreshold: aiData.feeWaiver.annualFee.spendThreshold,
        annualFeeDescription: aiData.feeWaiver.annualFee.description,
        joiningFeeIsWaiverable: aiData.feeWaiver.joiningFee.isWaiverable,
        joiningFeeCondition: aiData.feeWaiver.joiningFee.condition,
      },
    };
  }

  if (aiData.welcomeBonus) {
    prismaData.welcomeBonus = {
      create: {
        ...aiData.welcomeBonus,
        vouchers: { create: aiData.welcomeBonus.vouchers },
      },
    };
  }

  return { data: prismaData };
}

export type FullCreditCard = CreditCard & {
  feeWaiver: FeeWaiver | null;
  welcomeBonus:
    | (WelcomeBonus & {
        vouchers: Voucher[];
      })
    | null;
  fees: Fees;
  rewards: Rewards & {
    bonusCategories: BonusCategory[];
    milestones: Milestone[];
  };
  redemption: Redemption & {
    airlinePartners: AirlinePartner[];
    hotelPartners: HotelPartner[];
  };
  travelBenefits: TravelBenefits;
  lifestyleBenefits: LifestyleBenefits;
  eligibilityCriteria: EligibilityCriteria;
  finePrint: FinePrint;
};

export function prismaCardToAiData(card: FullCreditCard): AICreditCardData {
  return {
    id: card.id,
    name: card.name,
    bank: "",
    image: card.image,
    annualFee: card.annualFee,
    joiningFee: card.joiningFee,
    cardType: card.cardType,
    benefits: card.benefits,
    rating: card.rating,
    description: card.description,
    lastUpdated: card.lastUpdated.toISOString(),
    feeWaiver: card.feeWaiver
      ? {
          annualFee: {
            isWaiverable: card.feeWaiver.annualFeeIsWaiverable,
            spendThreshold: card.feeWaiver.annualFeeSpendThreshold,
            description: card.feeWaiver.annualFeeDescription,
          },
          joiningFee: {
            isWaiverable: card.feeWaiver.joiningFeeIsWaiverable,
            condition: card.feeWaiver.joiningFeeCondition,
          },
        }
      : null,
    welcomeBonus: card.welcomeBonus
      ? {
          description: card.welcomeBonus.description,
          minSpend: card.welcomeBonus.minSpend,
          timeframeDays: card.welcomeBonus.timeframeDays,
          bonusPoints: card.welcomeBonus.bonusPoints ?? undefined,
          bonusMiles: card.welcomeBonus.bonusMiles ?? undefined,
          cashback: card.welcomeBonus.cashback ?? undefined,
          vouchers: card.welcomeBonus.vouchers,
        }
      : null,
    fees: {
      latePayment: card.fees.latePayment,
      overLimit: card.fees.overLimit,
      foreignTransactionPercentage: card.fees.foreignTransactionPercentage,
      interestFreePeriodDays: card.fees.interestFreePeriodDays,
      apr: {
        purchase: card.fees.aprPurchase,
        cashAdvance: card.fees.aprCashAdvance,
      },
    },
    rewards: {
      estimatedPointValueINR: card.rewards.estimatedPointValueINR,
      pointExpiry: card.rewards.pointExpiry,
      baseRate: {
        pointsPer100INR: card.rewards.baseRatePointsPer100INR ?? undefined,
        cashbackPercentage:
          card.rewards.baseRateCashbackPercentage ?? undefined,
      },
      bonusCategories: card.rewards.bonusCategories.map(
        (cat: BonusCategory) => ({
          ...cat,
          pointsPer100INR: cat.pointsPer100INR ?? undefined,
          cashbackPercentage: cat.cashbackPercentage ?? undefined,
          monthlyCap: cat.monthlyCap ?? undefined,
          notes: cat.notes ?? undefined,
        }),
      ),
      milestones: card.rewards.milestones,
    },
    redemption: {
      ...card.redemption,
      airlinePartners: card.redemption.airlinePartners,
      hotelPartners: card.redemption.hotelPartners,
    },
    travelBenefits: {
      forexMarkup: card.travelBenefits.forexMarkup,
      loungeAccess: {
        domestic: card.travelBenefits.loungeAccessDomestic,
        international: card.travelBenefits.loungeAccessInternational,
        network: card.travelBenefits.loungeAccessNetwork.map((n) =>
          n.replace(/_/g, " "),
        ) as any,
      },
      travelInsurance: {
        hasInsurance: card.travelBenefits.travelInsuranceHasInsurance,
        coverageAmount: card.travelBenefits.travelInsuranceCoverageAmount,
        type: card.travelBenefits.travelInsuranceType,
      },
    },
    lifestyleBenefits: {
      dining: {
        isAvailable: card.lifestyleBenefits.diningIsAvailable,
        description: card.lifestyleBenefits.diningDescription,
      },
      movies: {
        isAvailable: card.lifestyleBenefits.moviesIsAvailable,
        description: card.lifestyleBenefits.moviesDescription,
      },
      golf: {
        isAvailable: card.lifestyleBenefits.golfIsAvailable,
        complimentaryRoundsPerMonth:
          card.lifestyleBenefits.golfComplimentaryRoundsPerMonth,
        description: card.lifestyleBenefits.golfDescription,
      },
      concierge: {
        isAvailable: card.lifestyleBenefits.conciergeIsAvailable,
        description: card.lifestyleBenefits.conciergeDescription,
      },
    },
    eligibilityCriteria: {
      ...card.eligibilityCriteria,
      employmentTypes: card.eligibilityCriteria.employmentTypes.map((e) =>
        e.replace(/_/g, " "),
      ) as any,
    },
    finePrint: card.finePrint,
  };
}

// ... (All code from the top of the file down to transformForUpdate is the same)

export function transformForUpdate(
  aiData: AICreditCardData,
  cardImageUrl?: string,
): Prisma.CreditCardUpdateInput {
  const mapStringToEnum = <T extends string>(
    value: string,
    enumObject: object,
  ): T => {
    const enumKey = value.replace(/ /g, "_");
    if (Object.values(enumObject).includes(enumKey)) {
      return enumKey as T;
    }
    return Object.values(enumObject)[0] as T;
  };

  const updateData: Prisma.CreditCardUpdateInput = {
    name: aiData.name,
    image: cardImageUrl || aiData.image,
    annualFee: aiData.annualFee,
    joiningFee: aiData.joiningFee,
    cardType: aiData.cardType,
    benefits: aiData.benefits,
    rating: aiData.rating,
    description: aiData.description,
    fees: {
      update: {
        latePayment: aiData.fees.latePayment,
        overLimit: aiData.fees.overLimit,
        foreignTransactionPercentage: aiData.fees.foreignTransactionPercentage,
        interestFreePeriodDays: aiData.fees.interestFreePeriodDays,
        aprPurchase: aiData.fees.apr.purchase,
        aprCashAdvance: aiData.fees.apr.cashAdvance,
      },
    },
    rewards: {
      update: {
        estimatedPointValueINR: aiData.rewards.estimatedPointValueINR,
        baseRatePointsPer100INR: aiData.rewards.baseRate?.pointsPer100INR,
        baseRateCashbackPercentage: aiData.rewards.baseRate?.cashbackPercentage,
        pointExpiry: aiData.rewards.pointExpiry,
        bonusCategories: {
          deleteMany: {},
          create: aiData.rewards.bonusCategories.map((cat) => {
            return {
              category: cat.category,
              pointsPer100INR: cat.pointsPer100INR,
              cashbackPercentage: cat.cashbackPercentage,
              monthlyCap: cat.monthlyCap,
              notes: cat.notes,
            };
          }),
        },
        milestones: {
          deleteMany: {},
          create: aiData.rewards.milestones.map((m) => {
            return {
              period: m.period,
              reward: m.reward,
              spendThreshold: m.spendThreshold,
            };
          }),
        },
      },
    },
    redemption: {
      update: {
        cashEquivalent: aiData.redemption.cashEquivalent,
        productCatalogue: aiData.redemption.productCatalogue,
        flightBooking: aiData.redemption.flightBooking,
        hotelBooking: aiData.redemption.hotelBooking,
        airlinePartners: {
          deleteMany: {},
          create: aiData.redemption.airlinePartners.map((p) => {
            return {
              name: p.name,
              transferRatio: p.transferRatio,
            };
          }),
        },
        hotelPartners: {
          deleteMany: {},
          create: aiData.redemption.hotelPartners.map((p) => {
            return {
              name: p.name,
              transferRatio: p.transferRatio,
            };
          }),
        },
      },
    },
    travelBenefits: {
      update: {
        loungeAccessDomestic: aiData.travelBenefits.loungeAccess.domestic,
        loungeAccessInternational:
          aiData.travelBenefits.loungeAccess.international,
        loungeAccessNetwork: aiData.travelBenefits.loungeAccess.network.map(
          (n) => mapStringToEnum<LoungeNetwork>(n, LoungeNetwork),
        ),
        travelInsuranceHasInsurance:
          aiData.travelBenefits.travelInsurance.hasInsurance,
        travelInsuranceCoverageAmount:
          aiData.travelBenefits.travelInsurance.coverageAmount,
        travelInsuranceType: aiData.travelBenefits.travelInsurance.type,
        forexMarkup: aiData.travelBenefits.forexMarkup,
      },
    },
    lifestyleBenefits: {
      update: {
        diningIsAvailable: aiData.lifestyleBenefits.dining.isAvailable,
        diningDescription: aiData.lifestyleBenefits.dining.description,
        moviesIsAvailable: aiData.lifestyleBenefits.movies.isAvailable,
        moviesDescription: aiData.lifestyleBenefits.movies.description,
        golfIsAvailable: aiData.lifestyleBenefits.golf.isAvailable,
        golfComplimentaryRoundsPerMonth:
          aiData.lifestyleBenefits.golf.complimentaryRoundsPerMonth,
        golfDescription: aiData.lifestyleBenefits.golf.description,
        conciergeIsAvailable: aiData.lifestyleBenefits.concierge.isAvailable,
        conciergeDescription: aiData.lifestyleBenefits.concierge.description,
      },
    },
    eligibilityCriteria: {
      update: {
        minIncome: aiData.eligibilityCriteria.minIncome,
        minAge: aiData.eligibilityCriteria.minAge,
        maxAge: aiData.eligibilityCriteria.maxAge,
        minCreditScore: aiData.eligibilityCriteria.minCreditScore,
        existingRelationshipRequired:
          aiData.eligibilityCriteria.existingRelationshipRequired,
        employmentTypes: aiData.eligibilityCriteria.employmentTypes.map((e) =>
          mapStringToEnum<EmploymentType>(e, EmploymentType),
        ),
      },
    },
    finePrint: {
      update: {
        capping: aiData.finePrint.capping,
        exclusions: aiData.finePrint.exclusions,
      },
    },
  };

  if (aiData.feeWaiver) {
    const feeWaiverData = {
      annualFeeIsWaiverable: aiData.feeWaiver.annualFee.isWaiverable,
      annualFeeSpendThreshold: aiData.feeWaiver.annualFee.spendThreshold,
      annualFeeDescription: aiData.feeWaiver.annualFee.description,
      joiningFeeIsWaiverable: aiData.feeWaiver.joiningFee.isWaiverable,
      joiningFeeCondition: aiData.feeWaiver.joiningFee.condition,
    };
    updateData.feeWaiver = {
      upsert: { create: feeWaiverData, update: feeWaiverData },
    };
  }

  if (aiData.welcomeBonus) {
    const { vouchers, ...bonusRest } = aiData.welcomeBonus;
    const createData = {
      ...bonusRest,
      vouchers: {
        create:
          vouchers?.map((v) => {
            const { id, welcomeBonusId, ...rest } = v as any;
            return rest;
          }) || [],
      },
    };
    const updatePayload = {
      ...bonusRest,
      vouchers: {
        deleteMany: {},
        create:
          vouchers?.map((v) => {
            const { id, welcomeBonusId, ...rest } = v as any;
            return rest;
          }) || [],
      },
    };
    updateData.welcomeBonus = {
      upsert: { create: createData, update: updatePayload },
    };
  }

  return updateData;
}
