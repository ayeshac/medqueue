"use client"
import { AppointmentFormData, AppointmentFormSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form"


interface BookingModalProps{
    doctorId:string;
    clinicId:string;
    onClose: () => void
}
const BookingModal = ({doctorId,clinicId,onClose}:BookingModalProps) => {
    const {register,handleSubmit,formState:{errors}} = useForm<AppointmentFormData>({
        resolver:zodResolver(AppointmentFormSchema)
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: AppointmentFormData & { doctorId: string, clinicId: string }) => {
          const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          return res.json()
        },
        onSuccess: () => {
          // runs when API returns success
          // close modal, show toast, refetch doctors list
          onClose()
        },
        onError: () => {
          // runs when API returns error
        }
      })
      
    const submitClicked = async (data: AppointmentFormData) => {
        mutate({ ...data, doctorId, clinicId })
    }
    return(
        
        <form onSubmit={handleSubmit(submitClicked)}>
            <label>Date : </label>
            <input type="date" {...register('date')} />
            {errors.date && <p>{errors.date.message}</p>}
            <label>Reason : </label>
            <input type="text" {...register("reason")} />
            {errors.reason && <p>{errors.reason.message}</p>}
            <label>Notes : </label>
            <input type="text" {...register("notes")}/>
            {errors.notes && <p>{errors.notes.message}</p>}
            <button type="submit" disabled={isPending}>Book</button>
        </form>
    )
}

export default BookingModal