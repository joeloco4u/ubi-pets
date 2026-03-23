export default function PublicPetPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white p-8 text-center">
      <h1 className="text-4xl font-bold">Página de prueba - ID: {params.id}</h1>
      <p className="mt-4 text-lg">Si ves este texto, la ruta dinámica [id] funciona.</p>
      <p className="mt-8 text-sm text-gray-500">Prueba con /pet/12345</p>
    </div>
  );
}