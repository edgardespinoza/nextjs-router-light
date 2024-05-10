export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const parseData = await response.json();
  return Response.json(parseData);
}
