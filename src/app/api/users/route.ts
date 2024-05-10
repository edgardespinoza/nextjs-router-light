import { NextResponse } from "next/server";

export const GET = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const parseData = await response.json();
  return NextResponse.json(parseData);
};

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json(data, { status: 201 });
}
