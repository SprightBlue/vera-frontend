import { MapPin } from "lucide-react";
import { useLocation } from "../hooks/useLocation.ts";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationCardProps {
    trustContactId: number;
    personName?: string;
}

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom(), { animate: true });
        }
    }, [lat, lng, map]);
    return null;
};

export const LocationCard = ({ trustContactId, personName = "Usuario Protegido" }: LocationCardProps) => {
    const { location, isConnected, loading } = useLocation(trustContactId);

    const lat = location ? Number(location.latitude) : 0;
    const lng = location ? Number(location.longitude) : 0;

    return (
        <div className="bg-[#0d1222] border border-[#182033] rounded-3xl p-8 md:col-span-2 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">

            <div className="lg:col-span-5 flex flex-col justify-between min-h-75">
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-full ${isConnected ? 'bg-emerald-500/10' : 'bg-[#182033]'}`}>
                            <MapPin size={20} className={isConnected ? "text-emerald-400" : "text-gray-500"} />
                        </div>
                        <h3 className="font-semibold text-xl text-white">Ubicación en tiempo real</h3>
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        {loading ? (
                            <span className="text-gray-400 text-sm">Cargando estado inicial...</span>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                    <h2 className="text-xl font-bold text-white">
                                        {isConnected ? `${personName} se encuentra conectado` : `${personName} se encuentra desconectado`}
                                    </h2>
                                </div>
                                <div className="bg-[#141b2d] border border-[#1e2942] rounded-2xl p-4 mt-2">
                                    <span className="text-xs text-gray-500 font-semibold block mb-1 uppercase tracking-wider">Dirección Estimada</span>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {location ? location.locationText : "Esperando actualizaciones de GPS..."}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-7 w-full h-87.5 lg:h-full min-h-75 rounded-2xl overflow-hidden border border-[#182033] relative z-10">
                {!loading && location && lat !== 0 && lng !== 0 ? (
                    <MapContainer
                        center={[lat, lng]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={true}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[lat, lng]} />
                        <RecenterMap lat={lat} lng={lng} />
                    </MapContainer>
                ) : (
                    <div className="w-full h-full bg-[#090d1a] flex flex-col items-center justify-center gap-3 text-center p-4">
                        <div className="p-4 rounded-full bg-[#111728] border border-[#1b253d]">
                            <MapPin size={32} className="text-gray-600 animate-bounce" />
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs">
                            {loading ? "Cargando coordenadas de mapa..." : "No hay coordenadas disponibles en este momento."}
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};