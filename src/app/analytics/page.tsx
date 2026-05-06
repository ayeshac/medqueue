"use client"

// 1 — imports
import { useQuery } from "@tanstack/react-query"
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
} from 'chart.js'

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale,
    BarElement, PointElement,
    LineElement, Title
)


const AnalyticsPage = () => {
    // 3 — fetch analytics data (same pattern as doctors page)
    const { data, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const res = await fetch('/api/analytics')
            return res.json()
        }
    })

    if (isLoading) return <p>Loading...</p>

    // 4 — shape the data for doughnut chart
    const doughnutData = {
        labels: data?.byStatus.map((s: { status: string; _count: { status: number } }) => s.status),
        datasets: [{
            data: data?.byStatus.map((s: { status: string; _count: { status: number } }) => s._count.status),
            backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'],
        }]
    }
    const barData = {
        labels: data?.byDoctor.map((d: { doctorId: string; _count: { doctorId: number } }) => d.doctorId),
        datasets: [{
            label: 'Appointments',
            data: data?.byDoctor.map((d: { doctorId: string; _count: { doctorId: number } }) => d._count.doctorId),
            backgroundColor: '#3B82F6',
        }]
    }

    const dateCounts: Record<string, number> = {}
    data?.recentAppointments.forEach((apt: { createdAt: string }) => {
        const date = new Date(apt.createdAt).toLocaleDateString()
        dateCounts[date] = (dateCounts[date] ?? 0) + 1
    })

    const lineData = {
        labels: Object.keys(dateCounts),
        datasets: [{
            label: 'Appointments',
            data: Object.values(dateCounts),
            borderColor: '#10B981',
            tension: 0.3,
        }]
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
          <h1 className="text-white text-2xl mb-8">Analytics</h1>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Doughnut chart */}
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center">
              <h2 className="text-white mb-4 self-start">Appointments by Status</h2>
              <div className="w-64 h-64">
                <Doughnut data={doughnutData} />
              </div>
            </div>
      
            {/* Bar chart */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-white mb-4">Appointments by Doctor</h2>
              <Bar data={barData} />
            </div>
      
            {/* Line chart — full width */}
            <div className="bg-gray-800 p-6 rounded-lg md:col-span-2">
              <h2 className="text-white mb-4">Appointments over Last 30 Days</h2>
              <Line data={lineData} />
            </div>
      
          </div>
        </div>
      )
}

export default AnalyticsPage