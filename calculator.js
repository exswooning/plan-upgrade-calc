
// Plan pricing data
const planData = {
  Basic: {
    monthly: 500,
    annually: 5000,
    triennially: 12000
  },
  Standard: {
    monthly: 1000,
    annually: 10000,
    triennially: 24000
  },
  Premium: {
    monthly: 1500,
    annually: 15000,
    triennially: 36000
  },
  Business: {
    monthly: 2500,
    annually: 25000,
    triennially: 60000
  },
  Enterprise: {
    monthly: 5000,
    annually: 50000,
    triennially: 120000
  }
};

// Days in billing cycle
const DAYS_IN_CYCLE = {
  monthly: 30,
  annually: 365,
  triennially: 1095
};

// DOM Elements
const currentPlanSelect = document.getElementById('currentPlan');
const currentBillingCycleSelect = document.getElementById('currentBillingCycle');
const currentPlanPriceInput = document.getElementById('currentPlanPrice');
const startDateInput = document.getElementById('startDate');
const currentDateInput = document.getElementById('currentDate');
const newPlanSelect = document.getElementById('newPlan');
const newBillingCycleSelect = document.getElementById('newBillingCycle');
const newPlanPriceInput = document.getElementById('newPlanPrice');
const calculateBtn = document.getElementById('calculateBtn');
const resultCard = document.getElementById('resultCard');
const resultNewPlan = document.getElementById('resultNewPlan');
const resultAmount = document.getElementById('resultAmount');
const resultDays = document.getElementById('resultDays');
const resultNextBilling = document.getElementById('resultNextBilling');
const themeToggle = document.getElementById('theme-toggle');

// Set default dates
const today = new Date();
const formattedToday = formatDateForInput(today);
currentDateInput.value = formattedToday;

// Calculate a default start date (e.g., 3 months ago)
const defaultStartDate = new Date();
defaultStartDate.setMonth(defaultStartDate.getMonth() - 3);
startDateInput.value = formatDateForInput(defaultStartDate);

// Initialize theme from localStorage or system preference
initializeTheme();

// Event listeners
currentPlanSelect.addEventListener('change', updateCurrentPlanPrice);
currentBillingCycleSelect.addEventListener('change', updateCurrentPlanPrice);
newPlanSelect.addEventListener('change', updateNewPlanPrice);
newBillingCycleSelect.addEventListener('change', updateNewPlanPrice);
calculateBtn.addEventListener('click', handleCalculate);
themeToggle.addEventListener('click', toggleTheme);

// Format date for input field
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Initialize theme
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Toggle theme function
function toggleTheme() {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Auto-populate current plan price
function updateCurrentPlanPrice() {
  const plan = currentPlanSelect.value;
  const billingCycle = currentBillingCycleSelect.value;
  
  if (plan && plan !== 'Other' && billingCycle) {
    const planPrices = planData[plan];
    if (planPrices && planPrices[billingCycle]) {
      currentPlanPriceInput.value = planPrices[billingCycle];
    } else {
      currentPlanPriceInput.value = '';
    }
  }
}

// Auto-populate new plan price
function updateNewPlanPrice() {
  const plan = newPlanSelect.value;
  const billingCycle = newBillingCycleSelect.value;
  
  if (plan && plan !== 'Other' && billingCycle) {
    const planPrices = planData[plan];
    if (planPrices && planPrices[billingCycle]) {
      newPlanPriceInput.value = planPrices[billingCycle];
    } else {
      newPlanPriceInput.value = '';
    }
  }
}

// Format currency
function formatCurrency(amount, currencySymbol = 'NPR') {
  return `${currencySymbol} ${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// Calculate remaining days in the billing cycle
function getRemainingDays(startDate, currentDate, billingCycle) {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  
  // Calculate cycle end date
  const cycleEndDate = new Date(start);
  
  if (billingCycle === 'monthly') {
    cycleEndDate.setMonth(cycleEndDate.getMonth() + 1);
  } else if (billingCycle === 'annually') {
    cycleEndDate.setFullYear(cycleEndDate.getFullYear() + 1);
  } else if (billingCycle === 'triennially') {
    cycleEndDate.setFullYear(cycleEndDate.getFullYear() + 3);
  }
  
  // Calculate days remaining
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.max(0, Math.round((cycleEndDate - current) / msPerDay));
  
  return daysRemaining;
}

// Calculate next billing date
function getNextBillingDate(startDate, billingCycle) {
  const start = new Date(startDate);
  const nextBilling = new Date(start);
  
  if (billingCycle === 'monthly') {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  } else if (billingCycle === 'annually') {
    nextBilling.setFullYear(nextBilling.getFullYear() + 1);
  } else if (billingCycle === 'triennially') {
    nextBilling.setFullYear(nextBilling.getFullYear() + 3);
  }
  
  return nextBilling;
}

// Calculate prorated upgrade cost
function calculateProratedUpgradeCost(currentPrice, currentBillingCycle, newPrice, newBillingCycle, remainingDays, startDate) {
  // Calculate the daily rates
  const currentDailyRate = currentPrice / DAYS_IN_CYCLE[currentBillingCycle];
  const newDailyRate = newPrice / DAYS_IN_CYCLE[newBillingCycle];
  
  // Calculate the cost difference for remaining days
  const upgradeCost = (newDailyRate - currentDailyRate) * remainingDays;
  
  return Math.max(0, upgradeCost);
}

// Format date for display
function formatDateForDisplay(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Show toast notification
function showToast(title, message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const toastTitle = document.createElement('div');
  toastTitle.className = 'toast-title';
  toastTitle.textContent = title;
  
  const toastDescription = document.createElement('div');
  toastDescription.className = 'toast-description';
  toastDescription.textContent = message;
  
  toast.appendChild(toastTitle);
  toast.appendChild(toastDescription);
  toastContainer.appendChild(toast);
  
  // Remove the toast after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 5000);
}

// Handle calculate button click
function handleCalculate() {
  // Validate inputs
  if (!currentPlanSelect.value || !newPlanSelect.value || !currentPlanPriceInput.value || !newPlanPriceInput.value || !startDateInput.value || !currentDateInput.value) {
    showToast('Missing information', 'Please fill in all required fields.', 'error');
    return;
  }

  try {
    const currentPlanPrice = parseFloat(currentPlanPriceInput.value);
    const newPlanPrice = parseFloat(newPlanPriceInput.value);
    const currentBillingCycle = currentBillingCycleSelect.value;
    const newBillingCycle = newBillingCycleSelect.value;
    const startDate = startDateInput.value;
    const currentDate = currentDateInput.value;
    
    // Calculate remaining days
    const daysRemaining = getRemainingDays(startDate, currentDate, currentBillingCycle);
    
    if (daysRemaining <= 0) {
      showToast('Invalid dates', 'The start date must be before the current date and within the billing cycle.', 'error');
      return;
    }
    
    // Calculate prorated cost
    const prorated = calculateProratedUpgradeCost(
      currentPlanPrice,
      currentBillingCycle,
      newPlanPrice,
      newBillingCycle,
      daysRemaining,
      startDate
    );
    
    // Calculate next billing date
    const nextBilling = getNextBillingDate(startDate, currentBillingCycle);
    
    // Update result card
    resultNewPlan.textContent = `${newPlanSelect.value} (${newBillingCycle})`;
    resultAmount.textContent = formatCurrency(prorated);
    resultDays.innerHTML = `for the remaining <strong>${daysRemaining}</strong> days of your current <strong>${currentPlanSelect.value} (${currentBillingCycle})</strong> cycle.`;
    resultNextBilling.innerHTML = `Your next billing date for the <strong>${newPlanSelect.value}</strong> at its regular price of <strong>${formatCurrency(newPlanPrice)}</strong> per <strong>${newBillingCycle}</strong> will be approximately <strong>${formatDateForDisplay(nextBilling)}</strong>.`;
    
    // Show result card
    resultCard.classList.remove('hidden');
    
    // Scroll to result card
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Show success toast
    showToast('Calculation complete', 'Prorated upgrade cost has been calculated successfully.');
  } catch (error) {
    console.error('Calculation error:', error);
    showToast('Calculation error', 'An error occurred while calculating the prorated cost.', 'error');
  }
}
