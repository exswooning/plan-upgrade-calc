
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CurrencySelect = ({ value, onChange }: CurrencySelectProps) => {
  const currencies = [
    { label: "NPR", symbol: "NPR" },
    { label: "USD", symbol: "$" },
    { label: "EUR", symbol: "€" },
    { label: "GBP", symbol: "£" },
    { label: "INR", symbol: "₹" }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.symbol} value={currency.symbol}>
            {currency.label} ({currency.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelect;
