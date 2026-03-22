"use client";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { QRCodeGenerator } from "@/components/qr-code";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PublicPetPage({ params }: { params: { id: string } }) {
    const [pet, setPet] = useState<any>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        // Cargar mascota
        supabase.from("pets").select("*").eq("id", params.id).single().then(({ data }) => {
            setPet(data);
            if (data) recordScan(data.id); // Registrar escaneo automáticamente
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

    if (!pet) return <div className="p-8 text-center text-xl">Cargando mascota...</div>;

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-md mx-auto text-center">
                <h1 className="text-5xl font-bold text-[#0A2540] mb-4">{pet.name}</h1>
                <p className="text-3xl text-gray-600 mb-10">{pet.species}</p>

                <div className="bg-white p-8 rounded-3xl shadow-2xl mb-10 border-4 border-[#FF6B35]/20">
                    <QRCodeGenerator
                        data={`https://ubi-petsweb-gib0idwgy-joeloco4us-projects.vercel.app/pet/${pet.id}`}
                        petName={pet.name}
                        size={300}
                    />
                </div>

                <div className="bg-red-50 border-2 border-red-300 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-red-700 mb-3">¿Encontraste esta mascota?</h2>
                    <p className="text-red-600 text-lg">Ya se notificó al dueño con tu ubicación.</p>
                    <p className="text-sm text-gray-500 mt-4">Gracias por ayudar ❤️</p>
                </div>
            </div>
        </div>
    );
}