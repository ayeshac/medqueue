import {z} from 'zod'
export const AppointmentFormSchema = z.object({
    date:z.string().min(1,"Date is required"),
    reason:z.string().min(10,"Please describe your reason in at least 10 characters"),
    notes:z.string().optional()
})

export type AppointmentFormData = z.infer<typeof AppointmentFormSchema>