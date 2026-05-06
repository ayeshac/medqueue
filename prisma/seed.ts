import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: "ayeshakausarprom@gmail.com" },
    update: { role: "admin" },
    create: {
      name: "Kausar",
      email: "ayeshakausarprom@gmail.com",
      role: "admin",
      phone: "",
    }
  })


  // Create a clinic first
  const clinic = await prisma.clinic.create({
    data: {
      name: "MedQueue Central Clinic",
      location: "Sydney, NSW",
      address: "123 George Street, Sydney NSW 2000",
      phone: "02 9000 0000",
    },
  })

  // Create 6 doctors
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@medqueue.com",
      phone: "0400 000 001",
      role: "doctor" as const,
      specialisation: "Cardiology" as const,
      bio: "15 years experience in cardiology",
      consultationFee: 150.0,
      rating: 4.8,
    },
    {
      name: "Dr. James Wilson",
      email: "james.wilson@medqueue.com",
      phone: "0400 000 002",
      role: "doctor" as const,
      specialisation: "General_Practice" as const,
      bio: "10 years experience in general practice",
      consultationFee: 80.0,
      rating: 4.5,
    },
    {
      name: "Dr. Priya Patel",
      email: "priya.patel@medqueue.com",
      phone: "0400 000 003",
      role: "doctor" as const,
      specialisation: "Dermatology" as const,
      bio: "Specialist in skin conditions",
      consultationFee: 120.0,
      rating: 4.9,
    },
    {
      name: "Dr. Michael Chen",
      email: "michael.chen@medqueue.com",
      phone: "0400 000 004",
      role: "doctor" as const,
      specialisation: "Neurology" as const,
      bio: "Expert in neurological disorders",
      consultationFee: 200.0,
      rating: 4.7,
    },
    {
      name: "Dr. Emma Davis",
      email: "emma.davis@medqueue.com",
      phone: "0400 000 005",
      role: "doctor" as const,
      specialisation: "Paediatrics" as const,
      bio: "Dedicated to children's health",
      consultationFee: 100.0,
      rating: 4.6,
    },
    {
      name: "Dr. Omar Abdullah",
      email: "omar.abdullah@medqueue.com",
      phone: "0400 000 006",
      role: "doctor" as const,
      specialisation: "Orthopaedics" as const,
      bio: "Specialist in bone and joint conditions",
      consultationFee: 180.0,
      rating: 4.7,
    },
  ]

  for (const doctor of doctors) {
    await prisma.user.create({
      data: {
        ...doctor,
        clinicId: clinic.id,
      },
    })
  }

  console.log("Seeded 1 clinic and 6 doctors")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())