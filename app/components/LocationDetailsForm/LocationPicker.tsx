// components/LocationPicker.tsx
"use client";

import {
  GoogleMap,
  Marker,
  Circle,
  useLoadScript,
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  overflow: "hidden",
};

const center = {
  lat: -33.8688,
  lng: 151.2093,
};

export default function LocationPicker({
  onSelect,
}: {
  onSelect: (address: string, latLng: google.maps.LatLngLiteral) => void;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  const [position, setPosition] = useState(center);
  const [address, setAddress] = useState(
    "7914 Lees Creek St. Dayton, Australia, 457895"
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = async (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    setValue(suggestion.description, false);
    clearSuggestions();

    const results = await getGeocode({ address: suggestion.description });
    const { lat, lng } = await getLatLng(results[0]);
    const newCenter = { lat, lng};
    setPosition(newCenter);
    onSelect(suggestion.description, { lat, lng });
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={17}
        >
          <Marker position={position} />
          <Circle
            center={position}
            radius={50}
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.1,
              strokeColor: "#FF0000",
              strokeOpacity: 0.5,
              strokeWeight: 1,
            }}
          />
        </GoogleMap>
      </div>

      <Input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Enter a location"
      />
      {status === 'OK' && (
        <ul className="absolute bg-white border mt-1 w-full z-10">
          {data.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
