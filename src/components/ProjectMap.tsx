"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type Project = {
  project_id: string;
  name: string;
  latitude: number;
  longitude: number;
  score: number;
};

// ✅ Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ProjectMap({ projects }: { projects: Project[] }) {
  return (
    <MapContainer
      center={[20, 0]} // slightly better global center
      zoom={2}
      minZoom={2}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={1.0}
      style={{ height: "100%", width: "100%" }}
    >
      {/* ✅ FIX: stop infinite world repeat */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />

      {projects.map((p) => (
        <Marker key={p.project_id} position={[p.latitude, p.longitude]}>
          <Popup>
            <div className="space-y-1 text-sm">
              <strong>{p.name}</strong>
              <p className="text-gray-500">{p.project_id}</p>
              <p className="font-medium">
                Score: {(p.score * 100).toFixed(1)}%
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
