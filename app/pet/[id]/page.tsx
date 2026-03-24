import { Suspense } from 'react';

export default async function PublicPetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold">Ubi Pets - Escaneo Activo</h1>
      <p className="text-gray-500">Mascota ID: {id}</p>
      <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">Ruta dinámica activa</div>
    </div>
  );
}
