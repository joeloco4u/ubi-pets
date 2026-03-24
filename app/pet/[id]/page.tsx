export default async function PublicPetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white p-8 text-center">
      <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold text-[#0A2540] mb-4">Página de Mascota</h1>
        <p className="text-xl text-gray-600">ID recibido: <span className="font-mono">{id}</span></p>
        <p className="mt-8 text-green-600 font-medium">✅ Si ves este texto, la ruta dinámica [id] funciona correctamente.</p>
      </div>
    </div>
  );
}
