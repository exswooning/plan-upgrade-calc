
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { planNames } from "@/utils/calculatorUtils";

interface PlanSelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const PlanSelect = ({ value, onChange, label }: PlanSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {planNames.map((plan) => (
          <SelectItem key={plan} value={plan}>
            {plan}
          </SelectItem>
        ))}
        <SelectItem value="Other">Other - Enter Manually</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PlanSelect;
