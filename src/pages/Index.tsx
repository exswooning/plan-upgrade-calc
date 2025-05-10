
import CalculatorForm from "@/components/CalculatorForm";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 transition-colors duration-300">
      <div className="calculator-container">
        <div className="calculator-header flex justify-between items-center glass rounded-xl p-6 mb-8">
          <h1 className="title-large text-primary mb-2 text-balance">
            Hosting Upgrade Calculator
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-lg text-muted-foreground mb-8 px-6 text-balance">
          Calculate the prorated cost of upgrading your hosting plan
        </p>
        
        <CalculatorForm />
        
        <footer className="text-center text-muted-foreground mt-16 text-sm glass rounded-xl p-4">
          <p>© 2025 Hosting Upgrade Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
