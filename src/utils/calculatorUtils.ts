import { addDays, differenceInDays, isLeapYear } from "date-fns";

// Define plan data types
export interface PlanPrice {
  monthly?: number;
  annually: number;
  triennially?: number;
}

export interface PlanData {
  [planName: string]: PlanPrice;
}

// Define predefined plan data
export const planData: PlanData = {
  "Web Essential": {
    annually: 2034,
    triennially: 3661
  },
  "Web Plus": {
    annually: 3390,
    triennially: 6102
  },
  "Web Pro": {
    annually: 6102,
    triennially: 10984
  },
  "Web Ultimate": {
    annually: 8136,
    triennially: 14645
  },
  "Cloud Thikka": {
    annually: 3390,
    triennially: 6102
  },
  "Cloud Ramro": {
    annually: 4746,
    triennially: 8543
  },
  "Cloud Babaal": {
    annually: 8814,
    triennially: 15865
  },
  "Nepal VPS plan 1C / 2G": {
    annually: 17086
  },
  "Nepal VPS plan 2C / 4G": {
    annually: 34171
  },
  "Nepal VPS plan 3C / 6G": {
    annually: 51257
  },
  "Nepal VPS plan 4C / 8G": {
    annually: 68478
  },
  "International VPS 2C / 4G": {
    annually: 13560
  },
  "International VPS 4C / 8G": {
    annually: 27120
  },
  "International VPS 8C / 16G": {
    annually: 48000
  },
  "International VPS 16C / 32G": {
    annually: 96000
  },
  "Windows VPS plan 1C / 2G": {
    annually: 17085.6
  },
  "Windows VPS plan 2C / 4G": {
    annually: 34171.2
  },
  "Windows VPS plan 3C / 6G": {
    annually: 51256.8
  },
  "Windows VPS plan 4C / 8G": {
    annually: 68478
  },
  "Cloud Mazzako": {}
};

// List of all plan names for dropdown
export const planNames = Object.keys(planData);

// Define billing cycle types
export type BillingCycle = "monthly" | "annually" | "triennially";

// Get days in billing cycle
export function getDaysInBillingCycle(cycle: BillingCycle, startDate?: Date): number {
  switch (cycle) {
    case "monthly":
      // Use average days in a month
      return 30.4375; // (365*3+366)/4/12
    case "annually":
      // Check if the specific year is a leap year if startDate is provided
      if (startDate && isLeapYear(startDate)) {
        return 366;
      }
      return 365;
    case "triennially":
      // Calculate exact number of days in the 3-year period if startDate is provided
      if (startDate) {
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 3);
        return differenceInDays(endDate, startDate);
      }
      // Otherwise use average including leap years
      return 365.25 * 3;
    default:
      return 365;
  }
}

// Calculate remaining days in current billing cycle
export function getRemainingDays(startDate: Date, currentDate: Date, billingCycle: BillingCycle): number {
  const totalDays = getDaysInBillingCycle(billingCycle, startDate);
  const endDate = addDays(startDate, totalDays);
  
  const remaining = differenceInDays(endDate, currentDate);
  return remaining > 0 ? remaining : 0;
}

// Calculate daily price based on plan price and billing cycle
export function getDailyPrice(planPrice: number, billingCycle: BillingCycle, startDate?: Date): number {
  const daysInCycle = getDaysInBillingCycle(billingCycle, startDate);
  return planPrice / daysInCycle;
}

// Calculate prorated upgrade cost
export function calculateProratedUpgradeCost(
  currentPlanPrice: number,
  currentBillingCycle: BillingCycle,
  newPlanPrice: number,
  newBillingCycle: BillingCycle,
  remainingDays: number,
  startDate?: Date
): number {
  const dailyCurrentPlanPrice = getDailyPrice(currentPlanPrice, currentBillingCycle, startDate);
  const dailyNewPlanPrice = getDailyPrice(newPlanPrice, newBillingCycle);
  
  const unusedValueCurrentPlan = dailyCurrentPlanPrice * remainingDays;
  const costNewPlanRemainingDays = dailyNewPlanPrice * remainingDays;
  
  const proratedCost = costNewPlanRemainingDays - unusedValueCurrentPlan;
  
  // Ensure the cost is not negative (minimum 0 for upgrades)
  return Math.max(0, proratedCost);
}

// Format currency
export function formatCurrency(amount: number, currencySymbol: string = "NPR"): string {
  return `${currencySymbol} ${amount.toFixed(2)}`;
}

// Get the next billing date
export function getNextBillingDate(startDate: Date, billingCycle: BillingCycle): Date {
  const daysInCycle = getDaysInBillingCycle(billingCycle, startDate);
  return addDays(startDate, daysInCycle);
}
