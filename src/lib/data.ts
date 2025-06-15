// mock data for credit cards
export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  image: string;
  annualFee: number;
  joiningFee: number;
  renewalFee: number;
  cardType: "Premium" | "Travel" | "Cashback" | "Business" | "Lifestyle";
  benefits: string[];
  rating: number;
  description: string;
  fees: {
    latePayment: number;
    overLimit: number;
    foreignTransaction: number;
  };
  rewards: {
    baseRate: string;
    bonusCategories: { category: string; rate: string }[];
    redemptionOptions: string[];
    pointExpiry: string;
    milestones: string[];
  };
  travelBenefits: {
    loungeAccess: { domestic: number; international: number };
    travelInsurance: string;
    airportTransfers: boolean;
    hotelDiscounts: string;
    forexMarkup: number;
  };
  lifestyleBenefits: {
    dining: string;
    movies: string;
    shopping: string;
    golf: boolean;
    concierge: boolean;
  };
  fuelBenefits: {
    surchargeWaiver: string;
    cashbackRate: string;
    monthlyLimit: number;
    eligibleStations: string[];
  };
  securityFeatures: {
    fraudProtection: boolean;
    zeroLiability: boolean;
    cardLock: boolean;
    transactionAlerts: boolean;
  };
  digitalFeatures: {
    mobileAppRating: number;
    digitalWallet: string[];
    contactless: boolean;
    virtualCard: boolean;
  };
  customerService: {
    support24x7: boolean;
    relationshipManager: boolean;
    branchNetwork: number;
    onlineManagement: boolean;
  };
  eligibilityCriteria: {
    minIncome: number;
    minAge: number;
    maxAge: number;
    employmentTypes: string[];
    minCreditScore: number;
  };
}

export const creditCards: CreditCard[] = [
  {
    id: "hdfc-regalia",
    name: "HDFC Regalia Gold",
    bank: "HDFC Bank",
    image: "/placeholder.svg?height=200&width=320",
    annualFee: 2500,
    joiningFee: 2500,
    renewalFee: 2500,
    cardType: "Premium",
    benefits: [
      "4 reward points per ₹150 spent",
      "Complimentary airport lounge access",
      "Fuel surcharge waiver",
      "Insurance coverage up to ₹1 crore",
    ],
    rating: 4.5,
    description:
      "Premium lifestyle credit card with excellent rewards and benefits",
    fees: {
      latePayment: 950,
      overLimit: 500,
      foreignTransaction: 3.5,
    },
    rewards: {
      baseRate: "1 point per ₹150",
      bonusCategories: [
        { category: "Dining", rate: "4 points per ₹150" },
        { category: "Fuel", rate: "2 points per ₹150" },
        { category: "Groceries", rate: "2 points per ₹150" },
      ],
      redemptionOptions: ["Cash", "Gift Vouchers", "Air Miles", "Products"],
      pointExpiry: "3 years",
      milestones: [
        "10,000 bonus points on ₹3 lakh spends",
        "25,000 bonus points on ₹7.5 lakh spends",
      ],
    },
    travelBenefits: {
      loungeAccess: { domestic: 12, international: 6 },
      travelInsurance: "Up to ₹1 crore",
      airportTransfers: false,
      hotelDiscounts: "Up to 20% at partner hotels",
      forexMarkup: 2.0,
    },
    lifestyleBenefits: {
      dining: "15% discount at partner restaurants",
      movies: "Buy 1 Get 1 on movie tickets",
      shopping: "10% cashback on online shopping",
      golf: true,
      concierge: true,
    },
    fuelBenefits: {
      surchargeWaiver: "1% fuel surcharge waiver",
      cashbackRate: "2.5% cashback",
      monthlyLimit: 500,
      eligibleStations: ["HPCL", "IOCL", "BPCL"],
    },
    securityFeatures: {
      fraudProtection: true,
      zeroLiability: true,
      cardLock: true,
      transactionAlerts: true,
    },
    digitalFeatures: {
      mobileAppRating: 4.3,
      digitalWallet: ["Google Pay", "Apple Pay", "Samsung Pay"],
      contactless: true,
      virtualCard: true,
    },
    customerService: {
      support24x7: true,
      relationshipManager: true,
      branchNetwork: 6000,
      onlineManagement: true,
    },
    eligibilityCriteria: {
      minIncome: 600000,
      minAge: 21,
      maxAge: 65,
      employmentTypes: ["Salaried", "Self-employed"],
      minCreditScore: 750,
    },
  },
  {
    id: "sbi-cashback",
    name: "SBI SimplyCLICK",
    bank: "State Bank of India",
    image: "/placeholder.svg?height=200&width=320",
    annualFee: 499,
    joiningFee: 499,
    renewalFee: 499,
    cardType: "Cashback",
    benefits: [
      "10X reward points on online spends",
      "5X reward points on dining",
      "Annual fee waiver on ₹1 lakh spends",
      "Contactless payment enabled",
    ],
    rating: 4.2,
    description: "Best for online shopping with accelerated rewards",
    fees: {
      latePayment: 750,
      overLimit: 500,
      foreignTransaction: 3.5,
    },
    rewards: {
      baseRate: "1 point per ₹100",
      bonusCategories: [
        { category: "Online Shopping", rate: "10 points per ₹100" },
        { category: "Dining", rate: "5 points per ₹100" },
      ],
      redemptionOptions: ["Cash", "Gift Vouchers", "Statement Credit"],
      pointExpiry: "2 years",
      milestones: ["5,000 bonus points on ₹2 lakh spends"],
    },
    travelBenefits: {
      loungeAccess: { domestic: 4, international: 0 },
      travelInsurance: "Up to ₹50 lakh",
      airportTransfers: false,
      hotelDiscounts: "N/A",
      forexMarkup: 3.5,
    },
    lifestyleBenefits: {
      dining: "10% discount at select restaurants",
      movies: "₹100 off on movie tickets",
      shopping: "5% cashback on online shopping",
      golf: false,
      concierge: false,
    },
    fuelBenefits: {
      surchargeWaiver: "1% fuel surcharge waiver",
      cashbackRate: "1% cashback",
      monthlyLimit: 200,
      eligibleStations: ["IOCL", "BPCL"],
    },
    securityFeatures: {
      fraudProtection: true,
      zeroLiability: true,
      cardLock: true,
      transactionAlerts: true,
    },
    digitalFeatures: {
      mobileAppRating: 4.1,
      digitalWallet: ["Google Pay", "Samsung Pay"],
      contactless: true,
      virtualCard: false,
    },
    customerService: {
      support24x7: true,
      relationshipManager: false,
      branchNetwork: 22000,
      onlineManagement: true,
    },
    eligibilityCriteria: {
      minIncome: 300000,
      minAge: 21,
      maxAge: 65,
      employmentTypes: ["Salaried", "Self-employed"],
      minCreditScore: 650,
    },
  },
  {
    id: "icici-amazon",
    name: "ICICI Amazon Pay",
    bank: "ICICI Bank",
    image: "/placeholder.svg?height=200&width=320",
    annualFee: 0,
    joiningFee: 0,
    renewalFee: 0,
    cardType: "Cashback",
    benefits: [
      "5% cashback on Amazon purchases",
      "2% cashback on bill payments",
      "1% cashback on other purchases",
      "No annual fee lifetime",
    ],
    rating: 4.3,
    description: "Perfect for Amazon shoppers with no annual fee",
    fees: {
      latePayment: 750,
      overLimit: 500,
      foreignTransaction: 3.5,
    },
    rewards: {
      baseRate: "1% cashback",
      bonusCategories: [
        { category: "Amazon", rate: "5% cashback" },
        { category: "Bill Payments", rate: "2% cashback" },
      ],
      redemptionOptions: ["Amazon Pay Balance", "Statement Credit"],
      pointExpiry: "No expiry",
      milestones: ["₹500 Amazon voucher on ₹50,000 spends"],
    },
    travelBenefits: {
      loungeAccess: { domestic: 0, international: 0 },
      travelInsurance: "N/A",
      airportTransfers: false,
      hotelDiscounts: "N/A",
      forexMarkup: 3.5,
    },
    lifestyleBenefits: {
      dining: "N/A",
      movies: "N/A",
      shopping: "5% cashback on Amazon",
      golf: false,
      concierge: false,
    },
    fuelBenefits: {
      surchargeWaiver: "N/A",
      cashbackRate: "1% cashback",
      monthlyLimit: 0,
      eligibleStations: [],
    },
    securityFeatures: {
      fraudProtection: true,
      zeroLiability: true,
      cardLock: true,
      transactionAlerts: true,
    },
    digitalFeatures: {
      mobileAppRating: 4.2,
      digitalWallet: ["Google Pay", "Apple Pay"],
      contactless: true,
      virtualCard: true,
    },
    customerService: {
      support24x7: true,
      relationshipManager: false,
      branchNetwork: 5000,
      onlineManagement: true,
    },
    eligibilityCriteria: {
      minIncome: 200000,
      minAge: 18,
      maxAge: 65,
      employmentTypes: ["Salaried", "Self-employed"],
      minCreditScore: 600,
    },
  },
  {
    id: "axis-magnus",
    name: "Axis Bank Magnus",
    bank: "Axis Bank",
    image: "/placeholder.svg?height=200&width=320",
    annualFee: 12500,
    joiningFee: 12500,
    renewalFee: 12500,
    cardType: "Premium",
    benefits: [
      "12 Edge Miles per ₹200 spent",
      "Unlimited airport lounge access",
      "Golf privileges worldwide",
      "Concierge services 24/7",
    ],
    rating: 4.7,
    description: "Ultra-premium card with luxury benefits and high rewards",
    fees: {
      latePayment: 1100,
      overLimit: 500,
      foreignTransaction: 2.0,
    },
    rewards: {
      baseRate: "12 Edge Miles per ₹200",
      bonusCategories: [
        { category: "Travel", rate: "25 Edge Miles per ₹200" },
        { category: "Dining", rate: "20 Edge Miles per ₹200" },
        { category: "International", rate: "20 Edge Miles per ₹200" },
      ],
      redemptionOptions: ["Air Miles", "Hotel Points", "Cash", "Gift Vouchers"],
      pointExpiry: "3 years",
      milestones: [
        "25,000 bonus miles on ₹15 lakh spends",
        "1,00,000 bonus miles on ₹25 lakh spends",
      ],
    },
    travelBenefits: {
      loungeAccess: { domestic: 999, international: 999 },
      travelInsurance: "Up to ₹3 crore",
      airportTransfers: true,
      hotelDiscounts: "Up to 30% at luxury hotels",
      forexMarkup: 2.0,
    },
    lifestyleBenefits: {
      dining: "20% discount at premium restaurants",
      movies: "Complimentary movie tickets",
      shopping: "15% discount at luxury brands",
      golf: true,
      concierge: true,
    },
    fuelBenefits: {
      surchargeWaiver: "1% fuel surcharge waiver",
      cashbackRate: "4% cashback",
      monthlyLimit: 1000,
      eligibleStations: ["HPCL", "IOCL", "BPCL", "Shell"],
    },
    securityFeatures: {
      fraudProtection: true,
      zeroLiability: true,
      cardLock: true,
      transactionAlerts: true,
    },
    digitalFeatures: {
      mobileAppRating: 4.4,
      digitalWallet: ["Google Pay", "Apple Pay", "Samsung Pay"],
      contactless: true,
      virtualCard: true,
    },
    customerService: {
      support24x7: true,
      relationshipManager: true,
      branchNetwork: 4500,
      onlineManagement: true,
    },
    eligibilityCriteria: {
      minIncome: 1500000,
      minAge: 21,
      maxAge: 65,
      employmentTypes: ["Salaried", "Self-employed", "Business"],
      minCreditScore: 800,
    },
  },
  {
    id: "kotak-dream",
    name: "Kotak 811 #Dream Different",
    bank: "Kotak Mahindra Bank",
    image: "/placeholder.svg?height=200&width=320",
    annualFee: 0,
    joiningFee: 0,
    renewalFee: 0,
    cardType: "Lifestyle",
    benefits: [
      "4X reward points on weekend dining",
      "2X reward points on online spends",
      "No annual fee for first year",
      "Instant digital card issuance",
    ],
    rating: 4.0,
    description: "Entry-level card perfect for young professionals",
    fees: {
      latePayment: 500,
      overLimit: 500,
      foreignTransaction: 3.5,
    },
    rewards: {
      baseRate: "1 point per ₹100",
      bonusCategories: [
        { category: "Weekend Dining", rate: "4 points per ₹100" },
        { category: "Online Shopping", rate: "2 points per ₹100" },
      ],
      redemptionOptions: ["Cash", "Gift Vouchers", "Statement Credit"],
      pointExpiry: "2 years",
      milestones: ["2,500 bonus points on ₹1 lakh spends"],
    },
    travelBenefits: {
      loungeAccess: { domestic: 2, international: 0 },
      travelInsurance: "Up to ₹25 lakh",
      airportTransfers: false,
      hotelDiscounts: "N/A",
      forexMarkup: 3.5,
    },
    lifestyleBenefits: {
      dining: "10% discount on weekends",
      movies: "₹75 off on movie tickets",
      shopping: "5% cashback on online shopping",
      golf: false,
      concierge: false,
    },
    fuelBenefits: {
      surchargeWaiver: "1% fuel surcharge waiver",
      cashbackRate: "1% cashback",
      monthlyLimit: 150,
      eligibleStations: ["HPCL", "IOCL"],
    },
    securityFeatures: {
      fraudProtection: true,
      zeroLiability: true,
      cardLock: true,
      transactionAlerts: true,
    },
    digitalFeatures: {
      mobileAppRating: 4.0,
      digitalWallet: ["Google Pay"],
      contactless: true,
      virtualCard: true,
    },
    customerService: {
      support24x7: true,
      relationshipManager: false,
      branchNetwork: 1600,
      onlineManagement: true,
    },
    eligibilityCriteria: {
      minIncome: 180000,
      minAge: 18,
      maxAge: 65,
      employmentTypes: ["Salaried", "Self-employed"],
      minCreditScore: 600,
    },
  },
  {
    id: "indusind-tiger",
    name: "IndusInd Bank Tiger",
    bank: "IndusInd Bank",
    image: "/placeholder.svg?height=200&width=320",
    annualFee: 2500,
    joiningFee: 0,
    renewalFee: 2500,
    cardType: "Travel",
    benefits: [
      "2 miles per ₹100 spent",
      "Airport lounge access 6 times/year",
      "Travel insurance coverage",
      "Zero forex markup on international spends",
    ],
    rating: 4.1,
    description: "Ideal travel companion with great international benefits",
    fees: {
      latePayment: 850,
      overLimit: 500,
      foreignTransaction: 0,
    },
    rewards: {
      baseRate: "2 miles per ₹100",
      bonusCategories: [
        { category: "Travel", rate: "4 miles per ₹100" },
        { category: "International", rate: "3 miles per ₹100" },
      ],
      redemptionOptions: ["Air Miles", "Hotel Points", "Cash"],
      pointExpiry: "3 years",
      milestones: ["10,000 bonus miles on ₹4 lakh spends"],
    },
    travelBenefits: {
      loungeAccess: { domestic: 6, international: 2 },
      travelInsurance: "Up to ₹75 lakh",
      airportTransfers: false,
      hotelDiscounts: "Up to 15% at partner hotels",
      forexMarkup: 0,
    },
    lifestyleBenefits: {
      dining: "12% discount at partner restaurants",
      movies: "Buy 1 Get 1 on movie tickets",
      shopping: "8% cashback on international shopping",
      golf: false,
      concierge: false,
    },
    fuelBenefits: {
      surchargeWaiver: "1% fuel surcharge waiver",
      cashbackRate: "2% cashback",
      monthlyLimit: 400,
      eligibleStations: ["HPCL", "IOCL", "BPCL"],
    },
    securityFeatures: {
      fraudProtection: true,
      zeroLiability: true,
      cardLock: true,
      transactionAlerts: true,
    },
    digitalFeatures: {
      mobileAppRating: 4.1,
      digitalWallet: ["Google Pay", "Samsung Pay"],
      contactless: true,
      virtualCard: false,
    },
    customerService: {
      support24x7: true,
      relationshipManager: false,
      branchNetwork: 2000,
      onlineManagement: true,
    },
    eligibilityCriteria: {
      minIncome: 500000,
      minAge: 21,
      maxAge: 65,
      employmentTypes: ["Salaried", "Self-employed"],
      minCreditScore: 700,
    },
  },
];

export const banks = [
  "HDFC Bank",
  "State Bank of India",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
];
export const cardTypes = [
  "Premium",
  "Travel",
  "Cashback",
  "Business",
  "Lifestyle",
];
