"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Phone, PawPrint, Heart, MapPin } from "lucide-react";
import Link from "next/link";

interface PetData {
  id: string;
  name: string;
  species: string;
  medical_notes: string | null;
  owner_phone: string | null;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [buttonText, setButtonText] = useState("¡Contactar al dueño!");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getPet = async () => {
      const { id: petId } = await params;
      setId(petId);

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId)
        .single();

      if (!error && data) {
        setPet(data);
        logScan(petId);
      }
      setLoading(false);
    };

    getPet();
  }, [params]);

  const logScan = async (petId: string) => {
    let lat: number | null = null;
    let lng: number | null = null;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      setLocationStatus("📍 Ubicación capturada");
    } catch (e) {
      setLocationStatus("Ubicación no disponible");
    }

    await supabase.from("scans").insert({
      pet_id: petId,
      lat,
      lng,
    });
  };

  const handleContact = async () => {
    setButtonText("¡Ubicación enviada al dueño! 📍");
    setTimeout(() => {
      if (pet?.owner_phone) {
        window.open(`https://wa.me/${pet.owner_phone.replace(/\D/g, '')}`, "_blank");
      }
    }, 1500);
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
        
        <span className="inline-block bg-[#FF7F50] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          {pet.species}
        </span>

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
            {buttonText}
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