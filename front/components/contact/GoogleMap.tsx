const mapUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.015299262929!2d-65.20799252576667!3d-26.839465690144976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225c08dfa9b5c9%3A0x94a08a050923ec08!2sCongreso%20de%20Tucum%C3%A1n%20603%20Piso%205%20oficina%20c%2C%20T4000%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses-419!2sar!4v1789495785908!5m2!1ses-419!2sar";

export default function GoogleMap() {
  return (
    <div className="relative h-64 w-full">
      <iframe
        title="Ubicación de Medde & Padilla, Congreso 603"
        src={mapUrl}
        className="h-full w-full border-0"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
