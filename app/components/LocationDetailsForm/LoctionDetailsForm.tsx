// components/LocationDetailsForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import HoursOfOperation from "./HoursOfOperation";
import { Trash2 } from "lucide-react";
import LocationPicker from "./LocationPicker";
import { LoadScript } from "@react-google-maps/api";

type Entry = {
  selectedDays: string[];
  start: string;
  end: string;
};

export default function LocationDetailsForm() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [data, setData] = useState("");

  const [entries, setEntries] = useState<Entry[]>([]);
  const [servicingEntries, setServicingEntries] = useState<Entry[]>([]);
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [checked, setChecked] = useState(false);

  console.log(servicingEntries);

  const handleCancel = () => {
    setSelectedDays([]);
    setStart("");
    setEnd("");
    setOpenFirst(false);
    setOpenSecond(false);
  };

  const handleReset = () => {
    setSelectedDays([]);
    setStart("");
    setEnd("");
  };

  const handleSave = () => {
    console.log(selectedDays, start, end);
    if (selectedDays.length == 0 || !start || !end) {
      alert("Please fill all fields");
      return;
    }
    const newEntry: Entry = { selectedDays, start, end };
    setEntries((prev) => [...prev, newEntry]);
    // Reset form
    setSelectedDays([]);
    setStart("");
    setEnd("");
    setOpenFirst(false);
    setOpenSecond(false);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleLocationSelect = (
    address: string,
    latLng: google.maps.LatLngLiteral
  ) => {
    console.log("Selected Address:", address);
    console.log("Coordinates:", latLng);
  };

  const renderTimeSlots = (timeSlots: Entry[]) =>
    timeSlots.map((item, index) => (
      <div className="flex justify-between" key={index}>
        <div>
          <p className="text-sm text-muted-foreground">
            {item.selectedDays.join(", ")}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            {item.start} - {item.end}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setEntries((prev) => prev.filter((_, curr) => curr !== index))
            }
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    ));

  return (
    <form
      onSubmit={handleSubmit((data) => {
        data.hoursOfOperation = entries;
        data.hoursOfServicing = servicingEntries;
        console.log(data);
        setData(JSON.stringify(data));
      })}
      className="max-w-3xl mx-auto space-y-6 p-6"
    >
      <div className="space-y-7">
        <div className="space-y-4">
          <Label htmlFor="location">
            Location<span className="text-red-500">*</span>
          </Label>
          {/* <Input id="location" {...register("location", { required: true })} /> */}
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={["places"]}
          >
            <LocationPicker onSelect={handleLocationSelect} />
          </LoadScript>
        </div>

        <div className="space-y-4">
          <Label htmlFor="propertyName">
            Property Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="propertyName"
            {...register("propertyName", { required: true })}
            placeholder="e.g. Geekyants"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="propertyType">
            Property Type<span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(value) => setValue("propertyType", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Complex">Complex</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="occupancy">Occupancy Count</Label>
          <Input
            id="occupancy"
            {...register("occupancy")}
            placeholder="e.g. 100 people"
          />
        </div>

        <div className="space-y-4">
          <Label>Multiple Locations</Label>
          <Select
            onValueChange={(value) => setValue("multipleLocations", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Currently has Vending?</Label>
          <Select onValueChange={(value) => setValue("hasVending", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            {...register("description")}
            placeholder="Enter a description"
          />
        </div>

        <div className="space-y-4">
          <Label>Hours of Operation</Label>
          <HoursOfOperation
            handleCancel={handleCancel}
            handleReset={handleReset}
            handleSave={handleSave}
            toggleDay={toggleDay}
            setEnd={setEnd}
            setStart={setStart}
            open={openFirst}
            setOpen={setOpenFirst}
            selectedDays={selectedDays}
          />
          {renderTimeSlots(entries)}
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Checkbox
              id="sameAsOperationHours"
              {...register("sameAsOperationHours")}
              checked={checked}
              onCheckedChange={(val) => {
                setChecked(!!val);
                if (val) setServicingEntries(entries);
                else setServicingEntries([]);
              }}
            />
            Same as Hours of Operations
          </Label>

          <Label>Access Hours for Servicing</Label>
          <HoursOfOperation
            handleCancel={handleCancel}
            handleReset={handleReset}
            handleSave={handleSave}
            toggleDay={toggleDay}
            setEnd={setEnd}
            setStart={setStart}
            open={openSecond}
            setOpen={setOpenSecond}
            selectedDays={selectedDays}
          />
          {renderTimeSlots(servicingEntries)}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10"
        >
          Cancel Lead
        </Button>
        <Button
          type="submit"
          className="bg-[#0099cc] hover:bg-[#0086b3] text-white"
        >
          Next
        </Button>
      </div>
    </form>
  );
}
