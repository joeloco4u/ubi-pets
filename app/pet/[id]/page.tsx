export default async function PublicPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-[#0A2540] mb-4">Ubi Pets</h1>
        <div className="h-1.5 w-16 bg-[#FF6B35] mx-auto mb-8 rounded-full"></div>
        <p className="text-gray-600 text-lg mb-2 font-medium">Escaneo Detectado</p>
        <code className="block bg-gray-100 p-3 rounded-lg text-xs text-blue-600 mb-8 break-all">
          ID: {id}
        </code>
        <div className="py-3 px-6 bg-green-50 text-green-700 rounded-full text-sm font-bold animate-pulse">
          ✅ CONEXIÓN EXITOSA
        </div>
        <p className="mt-6 text-gray-400 text-xs">Buscando datos en la base de datos de Maracaibo...</p>
      </div>
    </div>
  );
}
