// test/room.test.ts
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient, Room } from "@prisma/client";
import { NextResponse } from "next/server";

// 1. First create the mock instance
const mockPrisma = mockDeep<PrismaClient>();

// 2. Mock the db module using jest.doMock to avoid hoisting issues
jest.doMock("@/db/db", () => ({
  __esModule: true,
  default: mockPrisma,
}));

// 3. Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: unknown, options?: { status?: number }) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
}));

// 4. Now import the modules that use the mocked db
import { GET, POST } from "@/app/api/room/route";
import { DELETE } from "@/app/api/room/[id]/route";

describe("Room API Routes", () => {
  // Sample test data matching your response
  const mockRooms: Room[] = [
    {
      id: "d8b70f92-df03-4335-b306-77c084504d2d",
      name: "101",
      createdAt: new Date("2025-03-04T03:00:33.162Z"),
      updatedAt: new Date("2025-03-04T03:00:33.162Z"),
    },
    {
      id: "efe6310e-8d5c-4b14-8d9b-aaeb46f3582a",
      name: "201",
      createdAt: new Date("2025-03-04T03:00:44.134Z"),
      updatedAt: new Date("2025-03-04T03:00:44.134Z"),
    },
    {
      id: "5e90dee8-6903-4514-9ae4-fd1528ec5acf",
      name: "TOTAL",
      createdAt: new Date("2025-03-04T03:06:45.097Z"),
      updatedAt: new Date("2025-03-04T03:06:45.097Z"),
    },
  ];

  beforeEach(() => {
    mockReset(mockPrisma);
    jest.clearAllMocks();
  });

  describe("GET /api/room", () => {
    it("should return all rooms ordered by name", async () => {
      mockPrisma.room.findMany.mockResolvedValue(mockRooms);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockRooms);
      expect(mockPrisma.room.findMany).toHaveBeenCalledWith({
        orderBy: [{ name: "asc" }],
      });
    });

    it("should return 500 if database error occurs", async () => {
      mockPrisma.room.findMany.mockRejectedValue(new Error("Database error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch rooms" });
    });
  });

  describe("POST /api/room", () => {
    it("should create a new room with valid data", async () => {
      const newRoom = {
        id: "new-room-id",
        name: "NEW",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ name: "NEW" }),
      } as unknown as Request;

      mockPrisma.room.create.mockResolvedValue(newRoom);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(newRoom);
      expect(mockPrisma.room.create).toHaveBeenCalledWith({
        data: { name: "NEW" },
      });
    });

    it("should return 400 for invalid data", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ name: "INVALID" }), // Not matching your schema
      } as unknown as Request;

      const response = await POST(mockRequest);

      expect(response.status).toBe(400);
      expect(mockPrisma.room.create).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/room/[id]", () => {
    it("should delete an existing room", async () => {
      const roomToDelete = mockRooms[0];
      mockPrisma.room.findUnique.mockResolvedValue(roomToDelete);
      mockPrisma.room.delete.mockResolvedValue(roomToDelete);

      const response = await DELETE({} as Request, {
        params: { id: roomToDelete.id },
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(roomToDelete);
      expect(mockPrisma.room.delete).toHaveBeenCalledWith({
        where: { id: roomToDelete.id },
      });
    });

    it("should return 404 for non-existent room", async () => {
      mockPrisma.room.findUnique.mockResolvedValue(null);

      const response = await DELETE({} as Request, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(mockPrisma.room.delete).not.toHaveBeenCalled();
    });
  });
});
