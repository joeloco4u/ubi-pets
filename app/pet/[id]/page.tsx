export default async function PublicPetPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen bg-white p-8 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-[#0A2540]">Página de Mascota</h1>
        <p className="text-2xl mt-6">ID recibido: <span className="font-mono text-[#FF6B35]">{id}</span></p>
        <p className="mt-12 text-green-600 font-medium">✅ Si ves este texto, la ruta dinámica funciona.</p>
      </div>
    </div>
  );
}
