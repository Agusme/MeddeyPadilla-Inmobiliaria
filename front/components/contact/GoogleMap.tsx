"use client";

import { useState } from "react";

const mapUrl =
  "https://www.google.com/maps?q=Congreso%20603%2C%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n&z=17&output=embed";

export default function GoogleMap() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-64 w-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-[#292929] p-5" aria-label="Cargando mapa" role="status">
          <div className="h-full rounded-lg bg-white/10 animate-pulse" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-[#171717]/90 px-4 py-2 text-xs font-medium text-white/75 shadow-lg">Cargando mapa...</span>
          </div>
        </div>
      )}
      <iframe
        title="Ubicación de Medde & Padilla"
        src={mapUrl}
        className="h-full w-full border-0"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
