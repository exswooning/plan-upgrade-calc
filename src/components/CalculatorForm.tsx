
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns"; // Add this import for the format function
import PlanSelect from "./PlanSelect";
import BillingCycleSelect from "./BillingCycleSelect";
import DateInput from "./DateInput";
import { 
  planData, 
  BillingCycle, 
  calculateProratedUpgradeCost,
  getRemainingDays,
  getNextBillingDate,
  formatCurrency
} from "@/utils/calculatorUtils";

const CalculatorForm = () => {
  // Currency state - Now hardcoded to NPR since we removed the settings
  const currencySymbol = "NPR";
  
  // Current plan states
  const [currentPlan, setCurrentPlan] = useState("");
  const [currentBillingCycle, setCurrentBillingCycle] = useState<BillingCycle>("annually");
  const [currentPlanPrice, setCurrentPlanPrice] = useState<number | "">("");
  const [startDate, setStartDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date("2025-05-10")); // Using the specified date: May 10, 2025
  
  // New plan states
  const [newPlan, setNewPlan] = useState("");
  const [newBillingCycle, setNewBillingCycle] = useState<BillingCycle>("annually");
  const [newPlanPrice, setNewPlanPrice] = useState<number | "">("");
  
  // Result states
  const [proratedCost, setProratedCost] = useState<number | null>(null);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  // Auto-populate current plan price when plan or billing cycle changes
  useEffect(() => {
    if (currentPlan && currentPlan !== "Other" && currentBillingCycle) {
      const planPrices = planData[currentPlan];
      if (planPrices && planPrices[currentBillingCycle]) {
        setCurrentPlanPrice(planPrices[currentBillingCycle] as number);
      } else {
        setCurrentPlanPrice("");
      }
    }
  }, [currentPlan, currentBillingCycle]);

  // Auto-populate new plan price when plan or billing cycle changes
  useEffect(() => {
    if (newPlan && newPlan !== "Other" && newBillingCycle) {
      const planPrices = planData[newPlan];
      if (planPrices && planPrices[newBillingCycle]) {
        setNewPlanPrice(planPrices[newBillingCycle] as number);
      } else {
        setNewPlanPrice("");
      }
    }
  }, [newPlan, newBillingCycle]);

  // Calculate prorated cost
  const handleCalculate = () => {
    // Validate inputs
    if (!currentPlan || !newPlan || currentPlanPrice === "" || newPlanPrice === "") {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Calculate remaining days
      const daysRemaining = getRemainingDays(startDate, currentDate, currentBillingCycle);
      setRemainingDays(daysRemaining);
      
      if (daysRemaining <= 0) {
        toast({
          title: "Invalid dates",
          description: "The start date must be before the current date and within the billing cycle.",
          variant: "destructive"
        });
        return;
      }

      // Calculate prorated cost
      const prorated = calculateProratedUpgradeCost(
        currentPlanPrice as number,
        currentBillingCycle,
        newPlanPrice as number,
        newBillingCycle,
        daysRemaining,
        startDate
      );
      
      setProratedCost(prorated);
      
      // Calculate next billing date
      const nextBilling = getNextBillingDate(startDate, currentBillingCycle);
      setNextBillingDate(nextBilling);
      
      setCalculationPerformed(true);
      
      toast({
        title: "Calculation complete",
        description: "Prorated upgrade cost has been calculated successfully."
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation error",
        description: "An error occurred while calculating the prorated cost.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="calculator-card">
        <CardHeader>
          <CardTitle className="text-xl">Current Plan Details</CardTitle>
          <CardDescription>Enter information about your current hosting plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPlan">Current Plan</Label>
                <PlanSelect 
                  value={currentPlan} 
                  onChange={setCurrentPlan}
                  label="Current Plan"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentBillingCycle">Current Billing Cycle</Label>
                <BillingCycleSelect 
                  value={currentBillingCycle} 
                  onChange={setCurrentBillingCycle}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="currentPlanPrice">
                Current Plan Price ({currencySymbol})
                {currentPlan !== "Other" && currentPlanPrice !== "" && " (Auto-populated)"}
              </Label>
              <Input 
                id="currentPlanPrice"
                type="number"
                value={currentPlanPrice === "" ? "" : currentPlanPrice}
                onChange={(e) => setCurrentPlanPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                placeholder="Enter current plan price"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date of Current Billing Cycle</Label>
                <DateInput 
                  value={startDate}
                  onChange={setStartDate}
                  label="Start Date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentDate">Today's Date</Label>
                <DateInput 
                  value={currentDate}
                  onChange={setCurrentDate}
                  label="Today's Date"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="calculator-card">
        <CardHeader>
          <CardTitle className="text-xl">New Plan Details</CardTitle>
          <CardDescription>Enter information about the plan you want to upgrade to</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="newPlan">New Plan</Label>
                <PlanSelect 
                  value={newPlan} 
                  onChange={setNewPlan}
                  label="New Plan"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newBillingCycle">New Billing Cycle</Label>
                <BillingCycleSelect 
                  value={newBillingCycle} 
                  onChange={setNewBillingCycle}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="newPlanPrice">
                New Plan Price ({currencySymbol})
                {newPlan !== "Other" && newPlanPrice !== "" && " (Auto-populated)"}
              </Label>
              <Input 
                id="newPlanPrice"
                type="number"
                value={newPlanPrice === "" ? "" : newPlanPrice}
                onChange={(e) => setNewPlanPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                placeholder="Enter new plan price"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleCalculate} 
          className="px-8 py-6 text-lg"
        >
          Calculate Prorated Upgrade Cost
        </Button>
      </div>

      {calculationPerformed && proratedCost !== null && (
        <Card className="calculator-result">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-semibold">Calculation Results</h3>
                <Separator className="my-4" />
              </div>
              
              <div className="text-center">
                <p className="text-xl mb-2">The estimated prorated upgrade cost to</p>
                <p className="text-2xl font-bold text-primary mb-2">
                  {newPlan} ({newBillingCycle})
                </p>
                <p className="text-xl mb-2">is:</p>
                <p className="text-4xl font-bold text-primary mb-4">
                  {formatCurrency(proratedCost, currencySymbol)}
                </p>
                <p className="text-lg">
                  for the remaining <strong>{remainingDays}</strong> days of your current <strong>{currentPlan} ({currentBillingCycle})</strong> cycle.
                </p>
              </div>

              {nextBillingDate && (
                <Alert className="mt-6">
                  <AlertTitle>Next Billing Information</AlertTitle>
                  <AlertDescription>
                    Your next billing date for the <strong>{newPlan}</strong> at its regular price of <strong>{formatCurrency(newPlanPrice as number, currencySymbol)}</strong> per <strong>{newBillingCycle}</strong> will be approximately <strong>{format(nextBillingDate, "MMMM d, yyyy")}</strong>.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculatorForm;
