import { supabase } from "@/lib/supabase-browser";
import { Phone, PawPrint } from "lucide-react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: pet, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !pet) {
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="bg-[#0A2540] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-[#0A2540] mb-3">{pet.name}</h1>
        
        <span className="inline-block bg-[#FF7F50] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          {pet.species}
        </span>

        <button className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-semibold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2">
          <Phone className="h-5 w-5" />
          ¡Contactar al dueño!
        </button>
      </div>
    </div>
  );
}
