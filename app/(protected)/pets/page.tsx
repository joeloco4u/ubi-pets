"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { QRCodeGenerator } from "@/components/qr-code";

const BASE_URL = "https://ubi-petsweb.vercel.app";

export default function PetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; species?: string }>({});

  const fetchPets = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("pets").select("*", { count: 'exact' }).eq("owner_id", user.id);
    setPets(data || []);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const addPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const cleanSpecies = species.trim().toLowerCase();
    if (cleanSpecies !== 'perro' && cleanSpecies !== 'gato') {
      setErrors({ species: "La especie debe ser Perro o Gato" });
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setMessage("Error: No hay usuario autenticado");
      setLoading(false);
      return;
    }

    const speciesCapitalized = cleanSpecies.charAt(0).toUpperCase() + cleanSpecies.slice(1);

    const { error } = await supabase.from("pets").insert({
      name,
      species: speciesCapitalized,
      owner_id: user.id,
      medical_notes: medicalNotes,
      owner_phone: ownerPhone,
    }, { count: 'exact' });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("¡Mascota agregada correctamente!");
      setName("");
      setSpecies("");
      setMedicalNotes("");
      setOwnerPhone("");
      await fetchPets();
    }
    setLoading(false);
  };

  const deletePet = async (petId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta mascota?")) return;
    
    const supabase = createClient();
    const { error } = await supabase.from("pets").delete().eq("id", petId);
    if (!error) {
      await fetchPets();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="block mb-8 flex items-center gap-3 text-3xl sm:text-4xl font-bold text-[#0A2540] hover:opacity-80 transition-opacity cursor-pointer">
          <PawPrint className="h-8 sm:h-10 w-8 sm:w-10 text-[#FF6B35]" /> Mis Mascotas
        </Link>

        <Card className="mb-8">
          <CardHeader><CardTitle>Agregar nueva mascota</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={addPet} className="space-y-4">
              <div>
                <Input 
                  placeholder="Nombre" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <select
                  value={species}
                  onChange={e => setSpecies(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona especie</option>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                </select>
                {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species}</p>}
              </div>
              <div>
                <Input 
                  placeholder="Alergias o medicamentos" 
                  value={medicalNotes} 
                  onChange={e => setMedicalNotes(e.target.value)} 
                />
              </div>
              <div>
                <Input 
                  placeholder="Teléfono de contacto" 
                  value={ownerPhone} 
                  onChange={e => setOwnerPhone(e.target.value)} 
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#FF6B35]">
                <Plus className="mr-2 h-4 w-4" /> {loading ? "Guardando..." : "Agregar Mascota"}
              </Button>
            </form>
            {message && (
              <p className={`mt-3 text-center text-sm font-medium ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
                {message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {pets.length === 0 ? (
            <p className="col-span-full text-center py-12 text-gray-500">Aún no tienes mascotas. Agrega la primera arriba.</p>
          ) : (
            pets.map((pet) => (
              <div key={pet.id} className="max-w-[350px] mx-auto w-full">
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-md border border-gray-100">
                  <button
                    onClick={() => deletePet(pet.id)}
                    className="self-end p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar mascota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="text-2xl font-bold text-[#0A2540] capitalize">{pet.name}</h3>
                  <span className="text-sm text-gray-500 mb-4 uppercase tracking-widest">{pet.species}</span>
                  <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                    <QRCodeGenerator 
                      data={`${BASE_URL}/p/${pet.id}`}
                      petName={pet.name}
                      size={180}
                    />
                  </div>
                  <Link 
                    href={`/p/${pet.id}`}
                    className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl py-3"
                  >
                    Ver QR
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}