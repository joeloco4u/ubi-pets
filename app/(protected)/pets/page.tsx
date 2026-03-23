"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus } from "lucide-react";
import { QRCodeGenerator } from "@/components/qr-code";
import { z } from "zod";

const petSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.string().refine(
    (val) => ["perro", "gato"].includes(val.toLowerCase()),
    { message: "La especie debe ser Perro o Gato" }
  ),
});

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = "https://ubi-petsweb-gib0idwgy-joeloco4us-projects.vercel.app";

export default function PetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; species?: string }>({});

  const fetchPets = async () => {
    const { data } = await supabase.from("pets").select("*");
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
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("¡Mascota agregada correctamente!");
      setName("");
      setSpecies("");
      await fetchPets();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0A2540] mb-8 flex items-center gap-3">
          <PawPrint className="h-10 w-10 text-[#FF6B35]" /> Mis Mascotas
        </h1>

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

        <div className="space-y-4">
          {pets.length === 0 ? (
            <p className="text-center py-12 text-gray-500">Aún no tienes mascotas. Agrega la primera arriba.</p>
          ) : (
            pets.map((pet) => (
              <Card key={pet.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{pet.name}</h3>
                  <p className="text-gray-600">{pet.species}</p>
                </div>
                <QRCodeGenerator 
                  data={`${BASE_URL}/pet/${pet.id}`}
                  petName={pet.name} 
                />
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}