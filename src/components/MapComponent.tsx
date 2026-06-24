import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_ZOOM = 13;
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

function parseCoord(value?: number | string | null): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function toCoords(
  latitude?: number | string | null,
  longitude?: number | string | null,
): [number, number] | null {
  const lat = parseCoord(latitude);
  const lng = parseCoord(longitude);
  if (lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  if (lat === 0 && lng === 0) return null;
  return [lat, lng];
}

// Eksport — użyjesz w RightSidebar do przycisku „Nawiguj"
export function buildMapLink(
  address: string,
  coords?: [number, number] | null,
): string {
  if (coords) {
    return `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

interface MapProps {
  address: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  popupText?: string;
  zoom?: number;
}

function MapFallback({
  address,
  title,
  subtitle,
}: {
  address: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-center px-6 gap-3">
      <MapPin size={32} className="text-[#FF6B6B]" />
      <p className="text-white font-bold text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
      <p className="text-gray-400 text-sm leading-relaxed">{address}</p>
      <a
        href={buildMapLink(address)}
        target="_blank"
        rel="noreferrer"
        className="text-[#FF6B6B] text-xs font-bold hover:underline mt-1"
      >
        Otwórz w Google Maps
      </a>
    </div>
  );
}

const MapComponent = ({
  address,
  latitude,
  longitude,
  popupText,
  zoom = DEFAULT_ZOOM,
}: MapProps) => {
  const [tilesError, setTilesError] = useState(false);
  const coords = toCoords(latitude, longitude);

  if (!coords) {
    return (
      <MapFallback
        address={address}
        title="Lokalizacja niedostępna"
        subtitle="Brak współrzędnych dla tej restauracji"
      />
    );
  }

  if (tilesError) {
    return (
      <MapFallback
        address={address}
        title="Nie udało się załadować mapy"
        subtitle="Sprawdź połączenie z internetem"
      />
    );
  }

  return (
    <MapContainer
      center={coords}
      zoom={zoom}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
      style={{ height: "100%", width: "100%", background: "#1A1A1A" }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={TILE_URL}
        eventHandlers={{
          tileerror: () => setTilesError(true),
        }}
      />

      <Marker position={coords}>
        <Popup>{popupText ?? address}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
