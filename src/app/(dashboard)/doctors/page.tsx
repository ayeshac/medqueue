"use client"
import DoctorCard from "@/components/shared/DoctorCard"
import BookingModal from "@/components/shared/BookingModal"
import { useDebounce } from "@/hooks/useDebounce"
import usePermission from "@/hooks/usePermission"
import { Doctor } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

interface DoctorsResponse {
  data: Doctor[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
}

const DoctorsContent = () => {
  const router = useRouter()
  const canBook = usePermission("book:appointment")
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 150)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const page = parseInt(searchParams.get('page') ?? '1')

  const fetchDoctors = async () => {
    const res = await fetch(`/api/doctors?page=${page}&limit=4&search=${debouncedSearch}`)
    const json = await res.json()
    return json
  }

  const { data } = useQuery<DoctorsResponse>({
    queryKey: ['doctors', page, debouncedSearch],
    queryFn: fetchDoctors
  })

  const { status } = useSession()

  const setPage = (newPage: number) => {
    router.push(`${pathName}?page=${newPage}`)
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [router, status])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">Find a Doctor</h1>
          <p className="text-gray-400 mt-1">Book an appointment with our specialists</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-emerald-500 transition-colors"
        />

        {/* Booking modal */}
        {selectedDoctor && (
          <BookingModal
            doctorId={selectedDoctor.id}
            clinicId={selectedDoctor.clinicId!}
            onClose={() => setSelectedDoctor(null)}
          />
        )}

        {/* Doctors grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={setSelectedDoctor}
              canBook={canBook}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: data?.totalPages ?? 0 }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${p === page ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-white'}`}
            >
              {p}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!data?.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  )
}

const DoctorDashboard = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    }>
      <DoctorsContent />
    </Suspense>
  )
}

export default DoctorDashboard