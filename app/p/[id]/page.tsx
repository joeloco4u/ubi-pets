export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <h1 className="p-20 text-3xl font-bold">Mascota: {id} - RUTA P FUNCIONANDO</h1>;
}
