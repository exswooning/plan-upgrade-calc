
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillingCycle } from "@/utils/calculatorUtils";

interface BillingCycleSelectProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

const BillingCycleSelect = ({ value, onChange }: BillingCycleSelectProps) => {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as BillingCycle)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Billing Cycle" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="annually">Annually</SelectItem>
        <SelectItem value="triennially">Triennially</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default BillingCycleSelect;
