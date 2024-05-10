import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get("postId");
  const query = postId != null ? `?postId=${postId}` : "";

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments${query}`
  );
  const parseData = await response.json();
  return Response.json(parseData);
}
