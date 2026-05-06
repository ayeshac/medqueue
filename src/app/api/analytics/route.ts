import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  // appointments grouped by status — for doughnut chart
  const byStatus = await prisma.appointment.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  // appointments per doctor — for bar chart
  const byDoctor = await prisma.appointment.groupBy({
    by: ['doctorId'],
    _count: { doctorId: true }
  })

  // all appointments for last 30 days — for line chart
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo }
    },
    select: { createdAt: true }
  })

  return NextResponse.json({
    byStatus,
    byDoctor,
    recentAppointments,
  }, { status: 200 })
}