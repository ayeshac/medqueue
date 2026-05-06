import { Doctor } from "@/types"

interface DoctorCardProps {
  doctor: Doctor
  onBook: (doctor: Doctor) => void
  canBook: boolean
}

const DoctorCard = ({ doctor, onBook, canBook }: DoctorCardProps) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 hover:border-gray-500 transition-colors">
      
      {/* Avatar + name row */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg font-bold">
            {doctor.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-white font-medium">{doctor.name}</h3>
          <p className="text-emerald-400 text-sm">{doctor.specialisation}</p>
        </div>
      </div>

      {/* Bio */}
      {doctor.bio && (
        <p className="text-gray-400 text-sm leading-relaxed">
          {doctor.bio}
        </p>
      )}

      {/* Fee and rating */}
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">
          ${doctor.consultationFee}
        </span>
        <span className="text-yellow-400 text-sm">
          ⭐ {doctor.rating}
        </span>
      </div>

      {/* Book button */}
      {canBook && (
        <button
          onClick={() => onBook(doctor)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg transition-colors duration-200"
        >
          Book Appointment
        </button>
      )}
    </div>
  )
}

export default DoctorCard