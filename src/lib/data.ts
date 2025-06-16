export interface CreditCard {
  id: string;
  name: string;
  bank: {
    id: string;
    image: string;
    name: string;
    description: string | null;
    createdAt: Date;
    lastUpdated: Date;
    website: string | null;
  };
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
  cardType:
    | "Premium"
    | "Travel"
    | "Cashback"
    | "Business"
    | "Lifestyle"
    | "Fuel";
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
      period: "monthly" | "quarterly" | "annually";
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
  // NEWLY ADDED AND POPULATED
  lifestyleBenefits: {
    dining: {
      isAvailable: boolean;
      description: string;
    };
    movies: {
      isAvailable: boolean;
      description: string;
    };
    golf: {
      isAvailable: boolean;
      complimentaryRoundsPerMonth: number;
      description: string;
    };
    concierge: {
      isAvailable: boolean;
      description: string;
    };
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

// export const creditCards: CreditCard[] = [
//   {
//     id: "ZNTH-APX-001",
//     name: "Apex Reserve Card",
//     bank: "Zenith Bank",
//     image: "https://example.com/images/apex-reserve.png",
//     annualFee: 12500,
//     joiningFee: 12500,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: true,
//         spendThreshold: 1000000,
//         description:
//           "On spending over ₹10,00,000 in the preceding card anniversary year.",
//       },
//       joiningFee: { isWaiverable: false, condition: "Not applicable." },
//     },
//     cardType: "Premium",
//     benefits: [
//       "Unlimited Lounge Access",
//       "Low Forex Markup",
//       "Complimentary Golf Games",
//     ],
//     rating: 4.9,
//     description:
//       "An ultra-premium, invitation-only card for the discerning high-net-worth individual, offering unparalleled travel and lifestyle benefits.",
//     welcomeBonus: {
//       bonusPoints: 12500,
//       minSpend: 0,
//       timeframeDays: 0,
//       description:
//         "12,500 bonus reward points credited after payment of joining fee.",
//     },
//     fees: {
//       latePayment: "2% of outstanding, min ₹500, max ₹1200",
//       overLimit: "2.5% of overlimit amount, min ₹600",
//       foreignTransactionPercentage: 2,
//       apr: { purchase: 23.88, cashAdvance: 30 },
//       interestFreePeriodDays: 50,
//     },
//     rewards: {
//       estimatedPointValueINR: 1,
//       baseRate: { pointsPer100INR: 3.33 },
//       bonusCategories: [
//         {
//           category: "Travel & Hotel Bookings via Portal",
//           pointsPer100INR: 6.66,
//         },
//       ],
//       milestones: [
//         {
//           spendThreshold: 1500000,
//           reward: "Complimentary business class ticket voucher",
//           period: "annually",
//         },
//       ],
//       pointExpiry: "Never",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: true,
//       flightBooking: true,
//       hotelBooking: true,
//       airlinePartners: [
//         { name: "Vistara", transferRatio: "1:1" },
//         { name: "British Airways", transferRatio: "1:1" },
//       ],
//       hotelPartners: [{ name: "Marriott Bonvoy", transferRatio: "1:1" }],
//     },
//     travelBenefits: {
//       loungeAccess: {
//         domestic: -1,
//         international: -1,
//         network: ["Priority Pass"],
//       },
//       travelInsurance: {
//         hasInsurance: true,
//         coverageAmount: 20000000,
//         type: "Air Accident, Lost Baggage, Trip Cancellation",
//       },
//       forexMarkup: 2,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description:
//           "Complimentary EazyDiner Prime membership for up to 40% off at partner restaurants.",
//       },
//       movies: {
//         isAvailable: true,
//         description:
//           "Buy one get one free on movie tickets, up to ₹750 per ticket, 4 times a month.",
//       },
//       golf: {
//         isAvailable: true,
//         complimentaryRoundsPerMonth: 4,
//         description:
//           "4 complimentary golf rounds or lessons per month at select courses worldwide.",
//       },
//       concierge: {
//         isAvailable: true,
//         description:
//           "24/7 Global Concierge for travel, dining, and event bookings.",
//       },
//     },
//     eligibilityCriteria: {
//       minIncome: 3600000,
//       minAge: 25,
//       maxAge: 65,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 780,
//       existingRelationshipRequired: true,
//     },
//     finePrint: {
//       capping: [],
//       exclusions: ["Fuel transactions", "Wallet loads", "EMI transactions"],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "SBI-CB-002",
//     name: "Momentum Cashback Card",
//     bank: "State Bank of India",
//     image: "https://example.com/images/momentum-cashback.png",
//     annualFee: 999,
//     joiningFee: 999,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: true,
//         spendThreshold: 200000,
//         description: "On spending over ₹2,00,000 in a year.",
//       },
//       joiningFee: { isWaiverable: false, condition: "Not applicable." },
//     },
//     cardType: "Cashback",
//     benefits: ["5% cashback on all online spends", "1% cashback offline"],
//     rating: 4.7,
//     description:
//       "A straightforward, powerful cashback card that rewards every online purchase without any merchant restrictions.",
//     welcomeBonus: null,
//     fees: {
//       latePayment: "As per outstanding balance, from ₹400 to ₹1300",
//       overLimit: "2.5% of overlimit amount, min ₹600",
//       foreignTransactionPercentage: 3.5,
//       apr: { purchase: 42, cashAdvance: 42 },
//       interestFreePeriodDays: 50,
//     },
//     rewards: {
//       estimatedPointValueINR: 1,
//       baseRate: { cashbackPercentage: 1 },
//       bonusCategories: [
//         {
//           category: "All Online Spends",
//           cashbackPercentage: 5,
//           monthlyCap: 5000,
//           notes: "Cashback is calculated per statement cycle.",
//         },
//       ],
//       milestones: [],
//       pointExpiry: "N/A",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: false,
//       flightBooking: false,
//       hotelBooking: false,
//       airlinePartners: [],
//       hotelPartners: [],
//     },
//     travelBenefits: {
//       loungeAccess: { domestic: 4, international: 0, network: [] },
//       travelInsurance: {
//         hasInsurance: false,
//         coverageAmount: 0,
//         type: null,
//       },
//       forexMarkup: 3.5,
//     },
//     lifestyleBenefits: {
//       dining: { isAvailable: false, description: "Not available." },
//       movies: { isAvailable: false, description: "Not available." },
//       golf: {
//         isAvailable: false,
//         complimentaryRoundsPerMonth: 0,
//         description: "Not available.",
//       },
//       concierge: { isAvailable: false, description: "Not available." },
//     },
//     eligibilityCriteria: {
//       minIncome: 600000,
//       minAge: 21,
//       maxAge: 60,
//       employmentTypes: ["Salaried"],
//       minCreditScore: 750,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: ["Online cashback capped at ₹5000 per statement cycle."],
//       exclusions: ["Rent payments", "Wallet loads", "EMI transactions"],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "ICICI-AMZ-003",
//     name: "E-Shop Platinum Card",
//     bank: "ICICI Bank",
//     image: "https://example.com/images/eshop-platinum.png",
//     annualFee: 0,
//     joiningFee: 0,
//     feeWaiver: null,
//     cardType: "Lifestyle",
//     benefits: ["Lifetime Free", "Up to 5% back on Amazon"],
//     rating: 4.5,
//     description:
//       "The perfect card for avid online shoppers, offering lifetime free membership and direct cashback on Amazon.",
//     welcomeBonus: {
//       cashback: 500,
//       minSpend: 0,
//       timeframeDays: 0,
//       description: "₹500 Amazon Pay balance on card approval.",
//     },
//     fees: {
//       latePayment: "Varies based on outstanding amount",
//       overLimit: "2.5% of overlimit amount, min ₹500",
//       foreignTransactionPercentage: 3.5,
//       apr: { purchase: 43.2, cashAdvance: 43.2 },
//       interestFreePeriodDays: 48,
//     },
//     rewards: {
//       estimatedPointValueINR: 1,
//       baseRate: { cashbackPercentage: 1 },
//       bonusCategories: [
//         {
//           category: "Amazon.in for Prime Members",
//           cashbackPercentage: 5,
//           notes: "Excludes flights, gift cards, wallet loads.",
//         },
//         {
//           category: "Amazon.in for Non-Prime Members",
//           cashbackPercentage: 3,
//         },
//         {
//           category: "Partner Merchants (Swiggy, Uber etc.)",
//           cashbackPercentage: 2,
//         },
//       ],
//       milestones: [],
//       pointExpiry: "N/A",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: false,
//       flightBooking: false,
//       hotelBooking: false,
//       airlinePartners: [],
//       hotelPartners: [],
//     },
//     travelBenefits: {
//       loungeAccess: { domestic: 0, international: 0, network: [] },
//       travelInsurance: {
//         hasInsurance: false,
//         coverageAmount: 0,
//         type: null,
//       },
//       forexMarkup: 3.5,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description: "15% off via ICICI Bank Culinary Treats programme.",
//       },
//       movies: { isAvailable: false, description: "Not available." },
//       golf: {
//         isAvailable: false,
//         complimentaryRoundsPerMonth: 0,
//         description: "Not available.",
//       },
//       concierge: { isAvailable: false, description: "Not available." },
//     },
//     eligibilityCriteria: {
//       minIncome: 300000,
//       minAge: 18,
//       maxAge: 60,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 700,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: [],
//       exclusions: ["Gold/Jewellery purchases", "EMI transactions"],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "AXIS-VYGR-004",
//     name: "Voyager Magnus Card",
//     bank: "Axis Bank",
//     image: "https://example.com/images/voyager-magnus.png",
//     annualFee: 10000,
//     joiningFee: 10000,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: true,
//         spendThreshold: 1500000,
//         description: "On spending ₹15,00,000 in a year.",
//       },
//       joiningFee: { isWaiverable: false, condition: "Not applicable." },
//     },
//     cardType: "Travel",
//     benefits: [
//       "Unlimited International Lounge Access",
//       "Buy 1 Get 1 on Movie Tickets",
//       "High reward rate",
//     ],
//     rating: 4.8,
//     description:
//       "A premium travel and lifestyle card with extensive lounge benefits and a strong rewards program.",
//     welcomeBonus: {
//       vouchers: [{ brand: "Luxe Gift Card", value: 10000 }],
//       minSpend: 0,
//       timeframeDays: 0,
//       description:
//         "Choose between a domestic flight ticket or a ₹10,000 Luxe Gift Card on fee payment.",
//     },
//     fees: {
//       latePayment: "Standard bank charges",
//       overLimit: "3% of overlimit amount, min ₹500",
//       foreignTransactionPercentage: 2,
//       apr: { purchase: 42.5, cashAdvance: 42.5 },
//       interestFreePeriodDays: 50,
//     },
//     rewards: {
//       estimatedPointValueINR: 0.2,
//       baseRate: { pointsPer100INR: 6 },
//       bonusCategories: [
//         { category: "Travel Edge Portal", pointsPer100INR: 30 },
//       ],
//       milestones: [
//         {
//           spendThreshold: 100000,
//           reward: "25,000 Bonus Points",
//           period: "monthly",
//         },
//       ],
//       pointExpiry: "Never",
//     },
//     redemption: {
//       cashEquivalent: false,
//       productCatalogue: true,
//       flightBooking: true,
//       hotelBooking: true,
//       airlinePartners: [
//         { name: "Vistara", transferRatio: "5:4" },
//         { name: "Qatar Airways", transferRatio: "5:4" },
//       ],
//       hotelPartners: [{ name: "Marriott Bonvoy", transferRatio: "5:4" }],
//     },
//     travelBenefits: {
//       loungeAccess: {
//         domestic: 8,
//         international: -1,
//         network: ["Priority Pass"],
//       },
//       travelInsurance: {
//         hasInsurance: true,
//         coverageAmount: 500000,
//         type: "Credit Shield",
//       },
//       forexMarkup: 2,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description: "Up to 20% off at 4000+ partner restaurants.",
//       },
//       movies: {
//         isAvailable: true,
//         description:
//           "Buy one get one free on BookMyShow, up to ₹500 off on the second ticket, 5 times a month.",
//       },
//       golf: {
//         isAvailable: false,
//         complimentaryRoundsPerMonth: 0,
//         description: "Not available.",
//       },
//       concierge: {
//         isAvailable: true,
//         description: "24/7 concierge service for bookings and assistance.",
//       },
//     },
//     eligibilityCriteria: {
//       minIncome: 1800000,
//       minAge: 21,
//       maxAge: 65,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 760,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: ["Monthly milestone bonus is capped at 25,000 points."],
//       exclusions: [],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "HDFC-MLN-005",
//     name: "Millennia Pro Card",
//     bank: "HDFC Bank",
//     image: "https://example.com/images/millennia-pro.png",
//     annualFee: 1000,
//     joiningFee: 1000,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: true,
//         spendThreshold: 100000,
//         description: "On spending ₹1,00,000 in a year.",
//       },
//       joiningFee: {
//         isWaiverable: true,
//         condition: "Available as First Year Free for select customers.",
//       },
//     },
//     cardType: "Cashback",
//     benefits: [
//       "5% Cashback on partner merchants",
//       "1% base cashback",
//       "Quarterly lounge access",
//     ],
//     rating: 4.6,
//     description:
//       "A popular choice for young professionals, offering great cashback on the most-used online platforms.",
//     welcomeBonus: {
//       bonusPoints: 1000,
//       minSpend: 0,
//       timeframeDays: 0,
//       description: "1000 CashPoints on payment of joining fee.",
//     },
//     fees: {
//       latePayment: "Standard HDFC charges",
//       overLimit: "2.5% of overlimit amount, min ₹550",
//       foreignTransactionPercentage: 3.5,
//       apr: { purchase: 43.2, cashAdvance: 43.2 },
//       interestFreePeriodDays: 50,
//     },
//     rewards: {
//       estimatedPointValueINR: 0.25,
//       baseRate: { cashbackPercentage: 1 },
//       bonusCategories: [
//         {
//           category: "Amazon, Flipkart, Myntra, Swiggy, Zomato",
//           cashbackPercentage: 5,
//           monthlyCap: 1000,
//           notes: "Cashback earned as CashPoints.",
//         },
//       ],
//       milestones: [
//         {
//           spendThreshold: 100000,
//           reward: "₹1000 gift voucher",
//           period: "quarterly",
//         },
//       ],
//       pointExpiry: "24 months",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: true,
//       flightBooking: true,
//       hotelBooking: true,
//       airlinePartners: [],
//       hotelPartners: [],
//     },
//     travelBenefits: {
//       loungeAccess: { domestic: 8, international: 0, network: [] },
//       travelInsurance: {
//         hasInsurance: false,
//         coverageAmount: 0,
//         type: null,
//       },
//       forexMarkup: 3.5,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description: "Up to 20% off on partner restaurants via Swiggy Dineout.",
//       },
//       movies: { isAvailable: false, description: "Not available." },
//       golf: {
//         isAvailable: false,
//         complimentaryRoundsPerMonth: 0,
//         description: "Not available.",
//       },
//       concierge: { isAvailable: false, description: "Not available." },
//     },
//     eligibilityCriteria: {
//       minIncome: 420000,
//       minAge: 21,
//       maxAge: 60,
//       employmentTypes: ["Salaried"],
//       minCreditScore: 740,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: ["5% cashback capped at ₹1000 per month."],
//       exclusions: ["Wallet loads", "Fuel Spends"],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "AMEX-PLT-006",
//     name: "Platinum Travel Card",
//     bank: "American Express",
//     image: "https://example.com/images/amex-plat-travel.png",
//     annualFee: 5000,
//     joiningFee: 3500,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: false,
//         spendThreshold: 0,
//         description: "Annual fee is not waiverable.",
//       },
//       joiningFee: { isWaiverable: false, condition: "Not applicable." },
//     },
//     cardType: "Travel",
//     benefits: [
//       "Milestone-based travel benefits",
//       "Airport lounge access",
//       "Strong rewards program",
//     ],
//     rating: 4.7,
//     description:
//       "A card designed for frequent travelers who can maximize value through milestone spending.",
//     welcomeBonus: {
//       bonusMiles: 10000,
//       minSpend: 5000,
//       timeframeDays: 90,
//       description:
//         "10,000 Membership Rewards Points on spending ₹5,000 in 90 days.",
//     },
//     fees: {
//       latePayment: "Standard Amex charges",
//       overLimit: "N/A",
//       foreignTransactionPercentage: 3.5,
//       apr: { purchase: 42, cashAdvance: 42 },
//       interestFreePeriodDays: 48,
//     },
//     rewards: {
//       estimatedPointValueINR: 0.5,
//       baseRate: { pointsPer100INR: 2 },
//       bonusCategories: [],
//       milestones: [
//         {
//           spendThreshold: 190000,
//           reward: "Travel Vouchers worth ₹7,700",
//           period: "annually",
//         },
//         {
//           spendThreshold: 400000,
//           reward: "Travel Vouchers worth ₹11,800 + ₹10,000 Taj Stay Voucher",
//           period: "annually",
//         },
//       ],
//       pointExpiry: "Never",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: true,
//       flightBooking: true,
//       hotelBooking: true,
//       airlinePartners: [{ name: "Vistara", transferRatio: "3:1" }],
//       hotelPartners: [{ name: "Marriott Bonvoy", transferRatio: "1:1" }],
//     },
//     travelBenefits: {
//       loungeAccess: { domestic: 8, international: 0, network: [] },
//       travelInsurance: {
//         hasInsurance: false,
//         coverageAmount: 0,
//         type: null,
//       },
//       forexMarkup: 3.5,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description: "Up to 20% off at select partner restaurants.",
//       },
//       movies: { isAvailable: false, description: "Not available." },
//       golf: {
//         isAvailable: false,
//         complimentaryRoundsPerMonth: 0,
//         description: "Not available.",
//       },
//       concierge: { isAvailable: false, description: "Not available." },
//     },
//     eligibilityCriteria: {
//       minIncome: 600000,
//       minAge: 18,
//       maxAge: 65,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 750,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: [],
//       exclusions: ["Insurance premiums", "Cash transactions"],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "BPCL-SBI-007",
//     name: "BPCL Octane Card",
//     bank: "SBI Card",
//     image: "https://example.com/images/bpcl-octane.png",
//     annualFee: 1499,
//     joiningFee: 1499,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: true,
//         spendThreshold: 200000,
//         description: "On spending ₹2,00,000 in a year.",
//       },
//       joiningFee: { isWaiverable: false, condition: "Not applicable." },
//     },
//     cardType: "Fuel",
//     benefits: [
//       "High reward rate on fuel",
//       "Value back on BPCL spending",
//       "Lounge access",
//     ],
//     rating: 4.4,
//     description:
//       "A co-branded card offering exceptional value on fuel purchases at BPCL outlets.",
//     welcomeBonus: {
//       bonusPoints: 6000,
//       minSpend: 0,
//       timeframeDays: 0,
//       description:
//         "6,000 bonus Reward Points worth ₹1,500 on payment of joining fee.",
//     },
//     fees: {
//       latePayment: "Standard SBI charges",
//       overLimit: "2.5% of overlimit amount, min ₹600",
//       foreignTransactionPercentage: 3.5,
//       apr: { purchase: 42, cashAdvance: 42 },
//       interestFreePeriodDays: 50,
//     },
//     rewards: {
//       estimatedPointValueINR: 0.25,
//       baseRate: { pointsPer100INR: 1 },
//       bonusCategories: [
//         {
//           category: "BPCL Fuel & Lubricants",
//           pointsPer100INR: 25,
//           monthlyCap: 2500,
//           notes: "Up to a maximum of ₹10,000 spend per month.",
//         },
//         {
//           category: "Dining, Groceries, Departmental Stores",
//           pointsPer100INR: 10,
//         },
//       ],
//       milestones: [],
//       pointExpiry: "24 months",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: true,
//       flightBooking: false,
//       hotelBooking: false,
//       airlinePartners: [],
//       hotelPartners: [],
//     },
//     travelBenefits: {
//       loungeAccess: { domestic: 4, international: 0, network: [] },
//       travelInsurance: {
//         hasInsurance: false,
//         coverageAmount: 0,
//         type: null,
//       },
//       forexMarkup: 3.5,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description: "10 points per ₹100 spent on dining.",
//       },
//       movies: {
//         isAvailable: true,
//         description: "Complimentary movie voucher worth ₹250 from BookMyShow.",
//       },
//       golf: {
//         isAvailable: false,
//         complimentaryRoundsPerMonth: 0,
//         description: "Not available.",
//       },
//       concierge: { isAvailable: false, description: "Not available." },
//     },
//     eligibilityCriteria: {
//       minIncome: 720000,
//       minAge: 21,
//       maxAge: 60,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 750,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: ["Fuel rewards capped at 2500 points per month."],
//       exclusions: [],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "IDFC-WLTH-008",
//     name: "First Wealth Card",
//     bank: "IDFC First Bank",
//     image: "https://example.com/images/idfc-wealth.png",
//     annualFee: 0,
//     joiningFee: 0,
//     feeWaiver: null,
//     cardType: "Premium",
//     benefits: [
//       "Lifetime Free",
//       "Zero Forex Markup",
//       "Low APR",
//       "Lounge & Spa Access",
//     ],
//     rating: 4.8,
//     description:
//       "A unique lifetime-free premium card with industry-leading features like 0% forex markup and low interest rates.",
//     welcomeBonus: {
//       vouchers: [{ brand: "Generic", value: 500 }],
//       minSpend: 15000,
//       timeframeDays: 90,
//       description:
//         "Welcome voucher worth ₹500 on spending ₹15,000 within 90 days.",
//     },
//     fees: {
//       latePayment: "15% of total amount due, min ₹100, max ₹1250",
//       overLimit: "Standard bank charges",
//       foreignTransactionPercentage: 0,
//       apr: { purchase: 9, cashAdvance: 18 },
//       interestFreePeriodDays: 48,
//     },
//     rewards: {
//       estimatedPointValueINR: 0.25,
//       baseRate: { pointsPer100INR: 3 },
//       bonusCategories: [
//         { category: "Online Spends", pointsPer100INR: 6 },
//         {
//           category: "Offline Spends above ₹20,000/month",
//           pointsPer100INR: 10,
//         },
//       ],
//       milestones: [],
//       pointExpiry: "Never",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: true,
//       flightBooking: false,
//       hotelBooking: false,
//       airlinePartners: [],
//       hotelPartners: [],
//     },
//     travelBenefits: {
//       loungeAccess: {
//         domestic: 16,
//         international: 16,
//         network: ["Dreamfolks"],
//       },
//       travelInsurance: {
//         hasInsurance: true,
//         coverageAmount: 10000000,
//         type: "Comprehensive Travel Insurance",
//       },
//       forexMarkup: 0,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description: "Up to 20% discount at over 1500 restaurants.",
//       },
//       movies: {
//         isAvailable: true,
//         description:
//           "Buy one get one offer on movie tickets up to ₹500 on Paytm, twice a month.",
//       },
//       golf: {
//         isAvailable: true,
//         complimentaryRoundsPerMonth: 2,
//         description: "2 complimentary rounds of golf per month.",
//       },
//       concierge: { isAvailable: false, description: "Not available." },
//     },
//     eligibilityCriteria: {
//       minIncome: 3600000,
//       minAge: 21,
//       maxAge: 65,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 760,
//       existingRelationshipRequired: true,
//     },
//     finePrint: {
//       capping: [],
//       exclusions: ["Fuel", "Insurance", "EMI"],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "HDFC-DCB-009",
//     name: "Diners Club Black",
//     bank: "HDFC Bank",
//     image: "https://example.com/images/dcb.png",
//     annualFee: 10000,
//     joiningFee: 10000,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: true,
//         spendThreshold: 800000,
//         description: "On spending ₹8,00,000 in a year.",
//       },
//       joiningFee: { isWaiverable: false, condition: "Not applicable." },
//     },
//     cardType: "Premium",
//     benefits: [
//       "Unlimited lounge access for primary and add-on",
//       "Complimentary golf games",
//       "High reward rate",
//     ],
//     rating: 4.9,
//     description:
//       "A top-tier card for high spenders, offering a robust rewards program and extensive travel benefits.",
//     welcomeBonus: {
//       bonusPoints: 10000,
//       minSpend: 0,
//       timeframeDays: 0,
//       description:
//         "10,000 Reward Points and complimentary memberships to Forbes, Club Marriott, etc.",
//     },
//     fees: {
//       latePayment: "Standard HDFC charges",
//       overLimit: "2.5% of overlimit amount, min ₹550",
//       foreignTransactionPercentage: 2,
//       apr: { purchase: 23.88, cashAdvance: 23.88 },
//       interestFreePeriodDays: 50,
//     },
//     rewards: {
//       estimatedPointValueINR: 1,
//       baseRate: { pointsPer100INR: 3.33 },
//       bonusCategories: [
//         {
//           category: "SmartBuy Portal",
//           pointsPer100INR: 16.65,
//           notes: "Up to 5X rewards on select merchants.",
//         },
//       ],
//       milestones: [],
//       pointExpiry: "Never",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: true,
//       flightBooking: true,
//       hotelBooking: true,
//       airlinePartners: [
//         { name: "Vistara", transferRatio: "1:1" },
//         { name: "Singapore Airlines", transferRatio: "1:1" },
//       ],
//       hotelPartners: [],
//     },
//     travelBenefits: {
//       loungeAccess: {
//         domestic: -1,
//         international: -1,
//         network: ["Diners Club"],
//       },
//       travelInsurance: {
//         hasInsurance: true,
//         coverageAmount: 20000000,
//         type: "Air Accident Cover",
//       },
//       forexMarkup: 2,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description:
//           "Complimentary Club Marriott membership and up to 25% off with Good Food Trail program.",
//       },
//       movies: { isAvailable: false, description: "Not available." },
//       golf: {
//         isAvailable: true,
//         complimentaryRoundsPerMonth: 6,
//         description:
//           "6 complimentary golf games per quarter across the finest courses in the world.",
//       },
//       concierge: {
//         isAvailable: true,
//         description: "24/7 Global Concierge Service.",
//       },
//     },
//     eligibilityCriteria: {
//       minIncome: 2100000,
//       minAge: 21,
//       maxAge: 65,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 760,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: ["SmartBuy rewards have various monthly caps."],
//       exclusions: [],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
//   {
//     id: "AXIS-ACE-010",
//     name: "Ace Card",
//     bank: "Axis Bank",
//     image: "https://example.com/images/axis-ace.png",
//     annualFee: 499,
//     joiningFee: 499,
//     feeWaiver: {
//       annualFee: {
//         isWaiverable: true,
//         spendThreshold: 200000,
//         description: "On spending ₹2,00,000 in a year.",
//       },
//       joiningFee: { isWaiverable: false, condition: "Not applicable." },
//     },
//     cardType: "Cashback",
//     benefits: [
//       "5% cashback on bill payments",
//       "4% on partner merchants",
//       "2% flat cashback",
//     ],
//     rating: 4.6,
//     description:
//       "A simple and powerful cashback card with a high flat cashback rate on all spends.",
//     welcomeBonus: null,
//     fees: {
//       latePayment: "Standard Axis charges",
//       overLimit: "3% of overlimit amount, min ₹500",
//       foreignTransactionPercentage: 3.5,
//       apr: { purchase: 42.5, cashAdvance: 42.5 },
//       interestFreePeriodDays: 50,
//     },
//     rewards: {
//       estimatedPointValueINR: 1,
//       baseRate: { cashbackPercentage: 2 },
//       bonusCategories: [
//         {
//           category: "Bill Payments via Google Pay",
//           cashbackPercentage: 5,
//           monthlyCap: 500,
//         },
//         {
//           category: "Swiggy, Zomato, Ola",
//           cashbackPercentage: 4,
//           monthlyCap: 500,
//         },
//       ],
//       milestones: [],
//       pointExpiry: "N/A",
//     },
//     redemption: {
//       cashEquivalent: true,
//       productCatalogue: false,
//       flightBooking: false,
//       hotelBooking: false,
//       airlinePartners: [],
//       hotelPartners: [],
//     },
//     travelBenefits: {
//       loungeAccess: { domestic: 4, international: 0, network: [] },
//       travelInsurance: {
//         hasInsurance: false,
//         coverageAmount: 0,
//         type: null,
//       },
//       forexMarkup: 3.5,
//     },
//     lifestyleBenefits: {
//       dining: {
//         isAvailable: true,
//         description: "Up to 20% off at 4000+ partner restaurants.",
//       },
//       movies: { isAvailable: false, description: "Not available." },
//       golf: {
//         isAvailable: false,
//         complimentaryRoundsPerMonth: 0,
//         description: "Not available.",
//       },
//       concierge: { isAvailable: false, description: "Not available." },
//     },
//     eligibilityCriteria: {
//       minIncome: 300000,
//       minAge: 18,
//       maxAge: 70,
//       employmentTypes: ["Salaried", "Self-Employed"],
//       minCreditScore: 720,
//       existingRelationshipRequired: false,
//     },
//     finePrint: {
//       capping: [
//         "5% and 4% cashback categories have a combined monthly cap of ₹500.",
//       ],
//       exclusions: ["Wallet loads", "Fuel", "Rent", "Jewellery"],
//     },
//     lastUpdated: "2025-06-15T14:30:00.000Z",
//   },
// ];

export const banks = [
  "American Express",
  "Axis Bank",
  "HDFC Bank",
  "ICICI Bank",
  "IDFC First Bank",
  "SBI Card",
  "State Bank of India",
  "Zenith Bank", // Fictional bank from our premium card example
];

export const cardTypes = [
  "Premium",
  "Travel",
  "Cashback",
  "Lifestyle",
  "Fuel", // Added from the BPCL card example
  "Business", // Kept for future-proofing as it's in your type definition
];
