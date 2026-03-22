"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus } from "lucide-react";
import { QRCodeGenerator } from "@/components/qr-code";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    const { data } = await supabase.from("pets").select("*");
    setPets(data || []);
  };

  const addPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !species) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("pets").insert({
      name,
      species,
      owner_id: user?.id,
    });

    setName("");
    setSpecies("");
    fetchPets();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0A2540] mb-8 flex items-center gap-3">
          <PawPrint className="h-10 w-10 text-[#FF6B35]" /> Mis Mascotas
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Agregar nueva mascota</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addPet} className="space-y-4">
              <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input placeholder="Especie (perro, gato...)" value={species} onChange={(e) => setSpecies(e.target.value)} required />
              <Button type="submit" disabled={loading} className="w-full bg-[#FF6B35]">
                <Plus className="mr-2 h-4 w-4" />
                {loading ? "Guardando..." : "Agregar Mascota"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {pets.map((pet) => (
            <Card key={pet.id} className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">{pet.name}</h3>
                <p className="text-gray-600">{pet.species}</p>
              </div>
              <QRCodeGenerator 
                data={`https://ubi-petsweb-gib0idwgy-joeloco4us-projects.vercel.app/pet/${pet.id}`}
                petName={pet.name}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}