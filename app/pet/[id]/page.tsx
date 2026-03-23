"use client";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { QRCodeGenerator } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertTriangle, Heart, PawPrint } from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = "https://ubi-petsweb-gib0idwgy-joeloco4us-projects.vercel.app";

export default function PublicPetPage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState<any>(null);
  const [scanned, setScanned] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    supabase.from("pets").select("*").eq("id", params.id).single().then(({ data }) => {
      setPet(data);
      if (data) recordScan(data.id);
    });
  }, [params.id]);

  const recordScan = async (petId: string) => {
    if (scanned) return;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });
      await supabase.from("scan_events").insert({
        pet_id: petId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setScanned(true);
    } catch (err) {
      console.log("Ubicación denegada o error");
    }
  };

  const handleReport = async () => {
    setLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });
      await supabase.from("scan_events").insert({
        pet_id: params.id,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        message: reportMessage || "¡La encontré!",
      });
      setReportSent(true);
    } catch (err) {
      alert("Necesitas permitir ubicación para reportar");
    }
    setLoadingLocation(false);
  };

  if (!pet) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <PawPrint className="w-16 h-16 text-[#FF6B35]" />
        <p className="text-xl text-gray-600">Buscando mascota...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-[#0A2540] p-8 text-center">
            <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <PawPrint className="w-20 h-20 text-[#FF6B35]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">{pet.name}</h1>
            <p className="text-xl text-red-200 font-medium">{pet.species}</p>
          </div>

          <div className="p-8 text-center">
            <div className="bg-red-50 border-4 border-red-200 rounded-3xl p-6 mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Mascota Perdida</h2>
              <p className="text-red-600">
                Esta mascota necesita volver a casa. Si la encontraste, por favor ayúdanos a contactar a su dueño.
              </p>
            </div>

            {!showReportForm && !reportSent && (
              <Button 
                onClick={() => setShowReportForm(true)}
                className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-xl py-6 rounded-2xl font-bold"
              >
                <MapPin className="mr-2 w-6 h-6" />
                Reportar que la encontré
              </Button>
            )}

            {showReportForm && !reportSent && (
              <Card className="mt-4 border-2 border-[#FF6B35]/30">
                <CardHeader>
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    ¡Gracias por ayudar!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    Comparte un mensaje opcional y confirma tu ubicación
                  </p>
                  <Input 
                    placeholder="Mensaje opcional (ej: está bien, la vi en...)"
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                  />
                  <Button 
                    onClick={handleReport}
                    disabled={loadingLocation}
                    className="w-full bg-green-600 hover:bg-green-700 text-xl py-4 rounded-xl"
                  >
                    {loadingLocation ? "Enviando..." : "Confirmar ubicación y enviar"}
                  </Button>
                  <button 
                    onClick={() => setShowReportForm(false)}
                    className="w-full text-gray-500 text-sm"
                  >
                    Cancelar
                  </button>
                </CardContent>
              </Card>
            )}

            {reportSent && (
              <div className="bg-green-50 border-2 border-green-300 rounded-3xl p-6">
                <Heart className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-700 mb-2">¡Reporte enviado!</h3>
                <p className="text-green-600">
                  El dueño ha sido notificado. Gracias por tu ayuda ❤️
                </p>
              </div>
            )}

            {scanned && !reportSent && (
              <p className="text-xs text-gray-400 mt-4 text-center">
                Ya se envió notificación automática al dueño
              </p>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Escanea el código para ver esta página</p>
          <div className="inline-block p-2 bg-white rounded-xl shadow-lg mt-2">
            <QRCodeGenerator
              data={`${BASE_URL}/pet/${pet.id}`}
              petName={pet.name}
              size={150}
            />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by UbiPets - Reunion de mascotas
        </p>
      </div>
    </div>
  );
}