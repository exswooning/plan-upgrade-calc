
import CalculatorForm from "@/components/CalculatorForm";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 transition-colors duration-300">
      <div className="calculator-container">
        <div className="calculator-header flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Hosting Upgrade Calculator
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Calculate the prorated cost of upgrading your hosting plan
        </p>
        
        <CalculatorForm />
        
        <footer className="text-center text-muted-foreground mt-16 text-sm">
          <p>© 2025 Hosting Upgrade Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
