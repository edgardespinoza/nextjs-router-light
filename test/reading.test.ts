// test/readings.test.ts
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient, Reading, Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// 1. Create mock instance
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
import { GET as getReadings } from "@/app/api/readings/route";
import { GET as getRoomReading } from "@/app/api/reading/room/[id]/route";
import {
  GET as getReading,
  DELETE as deleteReading,
  PUT as updateReading,
} from "@/app/api/reading/[id]/route";
import { POST as createReading } from "@/app/api/reading/route";

describe("Readings API Routes", () => {
  const mockRoom: Room = {
    id: "efe6310e-8d5c-4b14-8d9b-aaeb46f3582a",
    name: "201",
    createdAt: new Date("2025-06-02T01:47:46.330Z"),
    updatedAt: new Date("2025-06-02T01:47:46.330Z"),
  };

  const mockReading: Reading & { room: Room } = {
    id: "4f3752fd-cd10-4906-9bee-4c09be9eb0eb",
    meterLight: 400.54,
    meterWater: 100.8,
    year: 2024,
    month: 6,
    rent: 300,
    roomId: mockRoom.id,
    createdAt: new Date("2025-06-02T01:47:46.330Z"),
    updatedAt: new Date("2025-06-02T01:47:46.330Z"),
    room: mockRoom,
  };

  beforeEach(() => {
    mockReset(mockPrisma);
    jest.clearAllMocks();
  });

  describe("GET /api/readings", () => {
    it("should filter readings by month and year when provided", async () => {
      // Create a mock NextRequest with search params
      const searchParams = new URLSearchParams();
      searchParams.set("month", "6");
      searchParams.set("year", "2024");

      const mockRequest = {
        nextUrl: {
          searchParams: searchParams,
        },
      } as unknown as NextRequest;

      mockPrisma.reading.findMany.mockResolvedValue([mockReading]);

      const response = await getReadings(mockRequest);
      const data = await response.json();

      expect(mockPrisma.reading.findMany).toHaveBeenCalledWith({
        where: {
          month: 6,
          year: 2024,
        },
        include: { room: true },
      });
      expect(data).toEqual([
        {
          id: mockReading.id,
          meterLightBefore: mockReading.meterLight,
          meterLightCurrent: mockReading.meterLight,
          meterWaterBefore: mockReading.meterWater,
          meterWaterCurrent: mockReading.meterWater,
          year: mockReading.year,
          month: mockReading.month,
          rent: mockReading.rent,
          room: {
            id: mockReading.roomId,
            name: mockRoom.name,
          },
        },
      ]);
      expect(response.status).toBe(200);
    });

    it("should handle errors", async () => {
      const mockRequest = {
        nextUrl: {
          searchParams: new URLSearchParams({
            month: "5",
            year: "2025",
          }),
        },
      } as unknown as NextRequest;

      mockPrisma.reading.findMany.mockRejectedValue(
        new Error("Database error")
      );

      const response = await getReadings(mockRequest);
      const data = await response.json();

      expect(data).toEqual({ error: "Database error" });
      expect(response.status).toBe(500);
    });
  });

  describe("GET /api/reading/room/[id]", () => {
    it("should return readings for a specific room", async () => {
      // Create a proper mock for NextRequest
      const mockRequest = {
        nextUrl: {
          searchParams: new URLSearchParams({
            month: "1",
            year: "2023",
          }),
        },
      } as unknown as NextRequest;

      mockPrisma.reading.findFirst.mockResolvedValue(mockReading);

      const response = await getRoomReading(mockRequest, {
        params: Promise.resolve({ id: mockRoom.id }),
      });
      const data = await response.json();

      expect(mockPrisma.reading.findFirst).toHaveBeenCalledWith({
        where: {
          roomId: mockRoom.id,
          month: 1,
          year: 2023,
        },
        include: { room: true },
      });
      expect(data).toEqual({
        id: mockReading.id,
        meterLight: mockReading.meterLight,
        meterWater: mockReading.meterWater,
        month: mockReading.month,
        rent: mockReading.rent,
        room: {
          id: mockRoom.id,
          name: mockRoom.name,
        },
        year: mockReading.year,
      });
      expect(response.status).toBe(200);
    });

    it("should handle errors", async () => {
      const mockRequest = {
        nextUrl: {
          searchParams: new URLSearchParams({
            month: "1",
            year: "2023",
          }),
        },
      } as unknown as NextRequest;

      const response = await getRoomReading(mockRequest, {
        params: Promise.resolve({ id: "invalid-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        roomId: ["Invalid uuid"],
      });
    });
  });

  describe("GET /api/reading/[id]", () => {
    it("should return a specific reading", async () => {
      const mockRequest = {
        params: { id: mockReading.id },
      } as any;

      mockPrisma.reading.findUnique.mockResolvedValue(mockReading);

      const response = await getReading(mockRequest, {
        params: Promise.resolve({ id: mockReading.id }),
      });
      const data = await response.json();

      expect(mockPrisma.reading.findUnique).toHaveBeenCalledWith({
        where: { id: mockReading.id },
        include: { room: true },
      });
      expect(data).toEqual({
        id: mockReading.id,
        meterLightBefore: 0,
        meterLightCurrent: mockReading.meterLight,
        meterWaterBefore: 0,
        meterWaterCurrent: mockReading.meterWater,
        year: mockReading.year,
        month: mockReading.month,
        rent: mockReading.rent,
        room: {
          id: mockReading.roomId,
          name: mockRoom.name,
        },
      });
      expect(response.status).toBe(200);
    });

    it("should return 404 if reading not found", async () => {
      const mockRequest = {
        params: { id: "non-existent-id" },
      } as any;

      mockPrisma.reading.findUnique.mockResolvedValue(null);

      const response = await getReading(mockRequest, {
        params: Promise.resolve({ id: mockReading.id }),
      });
      const data = await response.json();

      expect(data).toEqual({ error: "Reading not found" });
      expect(response.status).toBe(404);
    });

    it("should handle errors", async () => {
      const mockRequest = {
        params: { id: mockReading.id },
      } as any;

      mockPrisma.reading.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      const response = await getReading(mockRequest, {
        params: Promise.resolve({ id: mockReading.id }),
      });
      const data = await response.json();

      expect(data).toEqual({ error: "Database error" });
      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /api/reading/[id]", () => {
    it("should delete a reading", async () => {
      const mockRequest = {
        params: { id: mockReading.id },
      } as any;

      // Mock the findUnique to return a reading (exists)
      mockPrisma.reading.findUnique.mockResolvedValue(mockReading);

      // Mock the delete to return the deleted reading
      mockPrisma.reading.delete.mockResolvedValue(mockReading);

      const response = await deleteReading(mockRequest, {
        params: Promise.resolve({ id: mockReading.id }),
      });
      const data = await response.json();

      expect(mockPrisma.reading.delete).toHaveBeenCalledWith({
        where: { id: mockReading.id },
      });
      expect(data).toEqual(mockReading);
      expect(response.status).toBe(200);
    });

    it("should handle errors", async () => {
      const mockRequest = {
        params: { id: mockReading.id },
      } as any;

      mockPrisma.reading.findUnique.mockResolvedValue(mockReading);

      mockPrisma.reading.delete.mockRejectedValue(new Error("Database error"));

      // Mock the delete to return the deleted reading

      const response = await deleteReading(mockRequest, {
        params: Promise.resolve({ id: mockReading.id }),
      });
      const data = await response.json();

      expect(data).toEqual({ error: "Database error" });
      expect(response.status).toBe(500);
    });
  });

  describe("PUT /api/reading/[id]", () => {
    it("should update a reading", async () => {
      const updatedReading = {
        ...mockReading,
      };
      const mockRequest = {
        params: { id: mockReading.id },
        json: jest.fn().mockResolvedValue({
          meterLight: mockReading.meterLight,
          meterWater: mockReading.meterWater,
          year: mockReading.year,
          month: mockReading.month,
          rent: mockReading.rent,
          roomId: mockReading.roomId,
        }),
      } as any;
      mockPrisma.reading.findUnique.mockResolvedValue(updatedReading);

      mockPrisma.reading.update.mockResolvedValue(updatedReading);

      const response = await updateReading(mockRequest, {
        params: Promise.resolve({ id: mockReading.id }),
      });
      const data = await response.json();

      expect(mockPrisma.reading.update).toHaveBeenCalledWith({
        where: { id: mockReading.id },
        data: {
          meterLight: updatedReading.meterLight,
          meterWater: updatedReading.meterWater,
          rent: updatedReading.rent,
        },
      });
      expect(data).toEqual(updatedReading);
      expect(response.status).toBe(200);
    });

    it("should handle errors", async () => {
      const mockRequest = {
        params: { id: mockReading.id },
        json: jest.fn().mockResolvedValue({
          meterLight: mockReading.meterLight,
          meterWater: mockReading.meterWater,
          year: mockReading.year,
          month: mockReading.month,
          rent: mockReading.rent,
          roomId: mockReading.roomId,
        }),
      } as any;
      // Mock the findUnique to return a reading (exists)
      mockPrisma.reading.findUnique.mockResolvedValue(mockReading);

      mockPrisma.reading.update.mockRejectedValue(new Error("Database error"));

      const response = await updateReading(mockRequest, {
        params: Promise.resolve({ id: mockReading.id }),
      });
      const data = await response.json();

      expect(data).toEqual({ error: "Database error" });
      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/reading", () => {
    it("should create a new reading", async () => {
      const newReading = {
        ...mockReading,
      };
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          meterLight: mockReading.meterLight,
          meterWater: mockReading.meterWater,
          year: mockReading.year,
          month: mockReading.month,
          rent: mockReading.rent,
          roomId: mockReading.roomId,
        }),
      } as any;

      mockPrisma.reading.create.mockResolvedValue(newReading);

      const response = await createReading(mockRequest);
      const data = await response.json();

      expect(mockPrisma.reading.create).toHaveBeenCalledWith({
        data: {
          meterLight: mockReading.meterLight,
          meterWater: mockReading.meterWater,
          year: mockReading.year,
          month: mockReading.month,
          rent: mockReading.rent,
          roomId: mockReading.roomId,
        },
      });
      expect(data).toEqual(newReading);
      expect(response.status).toBe(201);
    });

    it("should handle errors", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          meterLight: mockReading.meterLight,
          meterWater: mockReading.meterWater,
          year: mockReading.year,
          month: mockReading.month,
          rent: mockReading.rent,
          roomId: mockReading.roomId,
        }),
      } as any;

      mockPrisma.reading.create.mockRejectedValue(new Error("Database error"));

      const response = await createReading(mockRequest);
      const data = await response.json();

      expect(data).toEqual({ error: "Database error" });
      expect(response.status).toBe(500);
    });
  });
});
