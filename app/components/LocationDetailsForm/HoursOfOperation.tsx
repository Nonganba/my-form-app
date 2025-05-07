"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allDays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
const times = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 1;
  return ["AM", "PM"].flatMap((period) => [
    `${hour.toString().padStart(2, "0")}:00 ${period}`,
  ]);
}).flat();

type Entry = {
  selectedDays: string[];
  start: string;
  end: string;
};

type HoursOfOperationProps = {
  handleCancel: () => void;
  handleReset: () => void;
  handleSave: () => void;
  toggleDay: (day: string) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStart: React.Dispatch<React.SetStateAction<string>>;
  setEnd: React.Dispatch<React.SetStateAction<string>>;
  selectedDays: string[];
  open: boolean;
};

const HoursOfOperation: React.FC<HoursOfOperationProps> = ({
  handleCancel,
  handleReset,
  handleSave,
  toggleDay,
  setEnd,
  setOpen,
  setStart,
  selectedDays,
  open,
}) => {
  console.log(open);
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex justify-between text-muted-foreground"
          >
            <span>Add hours</span>
            <span>+ Add</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[635px] p-12">
          <div className="flex flex-col gap-10 justify-between">
            <div className="mb-3 flex gap-1 justify-between">
              {allDays.map((day) => (
                <button
                  key={day}
                  className={`px-2 py-1 rounded-md text-sm ${
                    selectedDays.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-medium">{selectedDays.join(", ")}</p>
              <div className="flex gap-2 mb-4">
                <Select
                  onValueChange={setStart}
                >
                  <SelectTrigger className="w-[155px]">
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {times.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={setEnd}
                >
                  <SelectTrigger className="w-[155px]">
                    <SelectValue placeholder="End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {times.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              </div>
              <div>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HoursOfOperation;
