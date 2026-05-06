import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  // always check auth first
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // read all query params from URL
  // /api/doctors?page=1&limit=4&search=cardio
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '4')
  const search = searchParams.get('search') ?? ''
  // search defaults to empty string — no search = return all doctors

  // build the where clause dynamically
  // if search is empty, just filter by role
  // if search has a value, also filter by name or specialisation
  const whereClause = {
    role: "doctor" as const,
    ...(search && {
      name: { contains: search, mode: 'insensitive' as const }
    })
  }
  // the ...(search && { OR: [...] }) part means:
  // if search is empty string — spread nothing, just role filter
  // if search has value — spread the OR condition into whereClause

  const doctors = await prisma.user.findMany({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
  })

  const total = await prisma.user.count({
    where: whereClause,
    // count also uses the same whereClause
    // so totalPages is calculated based on filtered results
  })

  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages

  return NextResponse.json({
    message: "success",
    data: doctors,
    total,
    page,
    pageSize: limit,
    totalPages,
    hasNextPage,
  }, { status: 200 })
}