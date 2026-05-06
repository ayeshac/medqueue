"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


const DashboardPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-gray-400 mt-1">
            MedQueue Dashboard
          </p>
        </div>

        {/* User info card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-white text-lg font-medium mb-4">
            Your Profile
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-gray-400 w-20">Name</span>
              <span className="text-white">{session?.user?.name}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-400 w-20">Email</span>
              <span className="text-white">{session?.user?.email}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-400 w-20">Role</span>
              <span className="text-emerald-400 capitalize">
                {session?.user?.role}
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-400 w-20">ID</span>
              <span className="text-white text-sm font-mono">
                {session?.user?.id}
              </span>
            </div>
          </div>
        </div>

      
      <Link
        href="/doctors"
        className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
      >
        Find a Doctor →
      </Link>
    </div>
    </div>
  )
}

export default DashboardPage