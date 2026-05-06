import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== 'patient') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { date, reason, notes, doctorId, clinicId } = body
//   console.log("session user:", session.user)
  // in src/app/api/appointments/route.ts

  const appointment = await prisma.appointment.create({
    data: {
      date,
      reason,
      notes,
      status: "pending",
      patient: {
        connect: { id: session.user.id }
      },
      doctor: {
        connect: { id: doctorId }
      },
      clinic: {
        connect: { id: clinicId }
      },
    }
  })

  return NextResponse.json({ message: "success", data: appointment }, { status: 201 })
}