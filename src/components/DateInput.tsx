
import { useState, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
  className?: string;
  allowInput?: boolean; // New prop to enable text input
}

const DateInput = ({ value, onChange, label, className, allowInput = true }: DateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? format(value, "yyyy-MM-dd") : "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle manual date input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    setInputValue(dateString);
    
    // Try to parse the input date
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      onChange(parsedDate);
    }
  };

  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setInputValue(format(date, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      {allowInput ? (
        <div className="flex">
          <Input
            type="date"
            value={inputValue}
            onChange={handleInputChange}
            className={cn("flex-1 pr-10", className)}
            ref={inputRef}
          />
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                type="button"
                className="ml-2 h-10 w-10"
                onClick={() => setIsOpen(!isOpen)}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Open calendar</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={value}
                onSelect={handleCalendarSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>Select {label}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => date && onChange(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateInput;
