"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Phone, PawPrint, Heart, MapPin } from "lucide-react";
import Link from "next/link";

interface PetData {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  weight: number | null;
  medical_notes: string | null;
  owner_phone: string | null;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [showGpsButton, setShowGpsButton] = useState(false);

  const requestGps = () => {
    setLocationStatus("📍 Solicitando ubicación...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latVal = position.coords.latitude;
        const lngVal = position.coords.longitude;
        setLat(latVal);
        setLng(lngVal);
        setLocationStatus("📍 Ubicación lista para enviar");
        setShowGpsButton(false);
      },
      () => {
        setLocationStatus("📍 No se pudo obtener ubicación");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    setLocationStatus("📍 Localizando mascota...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latVal = position.coords.latitude;
        const lngVal = position.coords.longitude;
        setLat(latVal);
        setLng(lngVal);
        setLocationStatus("📍 Ubicación lista para enviar");
      },
      () => {
        setLocationStatus("📍 Ubicación no disponible");
        setShowGpsButton(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const init = async () => {
      const { id: petId } = await params;
      const supabase = createClient();

      await supabase.from("scans").insert({
        pet_id: petId,
        lat: lat,
        lng: lng,
      });

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId)
        .single();

      if (!error && data) {
        setPet(data);
      }
      setLoading(false);
    };

    init();
  }, [params, lat, lng]);

  const logScan = async (petId: string, latVal: number | null, lngVal: number | null) => {
    const supabase = createClient();
    await supabase.from("scans").insert({
      pet_id: petId,
      lat: latVal,
      lng: lngVal,
    });
  };

  const handleContact = () => {
    if (!pet?.owner_phone) return;
    
    let message: string;
    if (lat && lng) {
      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      message = `¡Hola! Encontré a tu mascota *${pet.name}*. Mi ubicación es: ${googleMapsLink}`;
    } else {
      message = `¡Hola! Encontré a tu mascota *${pet.name}*. Por favor, contáctame para coordinar la entrega.`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${pet.owner_phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    window.open(waUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-md">
          <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Mascota no encontrada</h1>
          <p className="text-gray-500">Esta mascota no existe o ha sido eliminada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-4">
      {locationStatus && (
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {locationStatus}
        </div>
      )}
      
      {showGpsButton && (
        <button
          onClick={requestGps}
          className="mb-3 bg-[#0A2540] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#1a3a5c] transition-colors"
        >
          <MapPin className="w-4 h-4" />
          📍 Activar GPS para ayudar a la mascota
        </button>
      )}
      
      <Link href="/" className="text-[#0A2540] hover:text-[#FF6B35] transition-colors mb-4 text-sm font-medium">
        ← Ir a Ubi Pets
      </Link>
      
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="bg-[#0A2540] w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2540] mb-3">{pet.name}</h1>
        
        <span className="inline-block bg-[#FF7F50] text-white px-4 py-2 rounded-full text-sm font-medium mb-3">
          {pet.species}
        </span>

        {(pet.breed || pet.weight) && (
          <div className="flex justify-center gap-2 mb-6">
            {pet.breed && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {pet.breed}
              </span>
            )}
            {pet.weight && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {pet.weight} kg
              </span>
            )}
          </div>
        )}

        {pet.medical_notes && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl text-left">
            <h3 className="flex items-center gap-2 text-[#0A2540] font-semibold mb-2">
              <Heart className="h-4 w-4 text-[#FF6B35]" />
              Información Médica
            </h3>
            <p className="text-gray-700 text-sm">{pet.medical_notes}</p>
          </div>
        )}

        {pet.owner_phone ? (
          <button 
            onClick={handleContact}
            className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 text-base sm:text-lg touch-manipulation"
          >
            <Phone className="h-5 w-5" />
            ¡Contactar al dueño!
          </button>
        ) : (
          <button className="w-full bg-gray-300 text-gray-500 font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed" disabled>
            <Phone className="h-5 w-5" />
            Contacto no disponible
          </button>
        )}

        <p className="mt-6 text-sm text-gray-500">
          ¿Quieres proteger a tu mascota?{" "}
          <Link href="/register" className="text-[#FF6B35] font-semibold hover:underline">
            Crea tu cuenta en Ubi Pets gratis.
          </Link>
        </p>
      </div>
    </div>
  );
}