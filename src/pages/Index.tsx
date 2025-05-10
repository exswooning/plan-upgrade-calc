
import CalculatorForm from "@/components/CalculatorForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="calculator-container">
        <div className="calculator-header">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Hosting Upgrade Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the prorated cost of upgrading your hosting plan
          </p>
        </div>
        
        <CalculatorForm />
        
        <footer className="text-center text-gray-500 mt-16 text-sm">
          <p>© 2025 Hosting Upgrade Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
