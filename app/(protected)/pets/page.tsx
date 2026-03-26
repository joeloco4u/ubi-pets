"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { QRCodeGenerator } from "@/components/qr-code";
import { z } from "zod";

const petSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.string().refine(
    (val) => ["perro", "gato"].includes(val.toLowerCase()),
    { message: "La especie debe ser Perro o Gato" }
  ),
});

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("pets").select("*").eq("owner_id", user.id);
    setPets(data || []);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const addPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const result = petSchema.safeParse({ name, species });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        species: fieldErrors.species?.[0],
      });
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("pets").insert({
      name,
      species,
      owner_id: user?.id,
      medical_notes: medicalNotes,
      owner_phone: ownerPhone,
    });

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
                <Input 
                  placeholder="Especie (perro, gato...)" 
                  value={species} 
                  onChange={e => setSpecies(e.target.value)} 
                  required 
                />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.length === 0 ? (
            <p className="col-span-full text-center py-12 text-gray-500">Aún no tienes mascotas. Agrega la primera arriba.</p>
          ) : (
            pets.map((pet) => (
              <Card key={pet.id} className="p-4 sm:p-6 flex flex-col justify-between items-center">
                <div className="text-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold">{pet.name}</h3>
                  <p className="text-gray-600">{pet.species}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <QRCodeGenerator 
                    data={`${BASE_URL}/p/${pet.id}`}
                    petName={pet.name} 
                  />
                  <button
                    onClick={() => deletePet(pet.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar mascota"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}