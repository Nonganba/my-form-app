import LocationDetailsForm from "@/app/components/LocationDetailsForm/LoctionDetailsForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-[10%]">
      <h1 className="text-2xl font-bold text-center my-6">Location Details</h1>
      <LocationDetailsForm />
    </main>
  );
}
