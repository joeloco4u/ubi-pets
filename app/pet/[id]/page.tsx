export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
      <h1 className="text-3xl font-bold text-[#0A2540]">Ubi Pets</h1>
      <p className="mt-4 text-gray-600">Mascota detectada: <span className="font-mono font-bold text-[#FF6B35]">{id}</span></p>
      <div className="mt-6 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">Ruta funcional en Vercel</div>
    </div>
  );
}
