export type Role = "admin" | "doctor" | "patient";

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export type Specialisation =  "Cardiology"
    | "Dermatology"
    | "General Practice"
    | "Neurology"
    | "Orthopaedics"
    | "Paediatrics"
    | "Psychiatry";

export interface User {
    id:string;
    name:string;
    email:string;
    phone:string;
    role:Role;
    avatar?:string;
    createdAt:string;
    updatedAt:string;
}
export interface Patient extends User {
    role: 'patient';
    dateOfBirth: string;
    location: string;
    medicalHistory?:string;
}

export interface TimeSlot{
    id:string;
    startTime:string;
    endTime:string;
    isBooked:boolean;
}

export interface Doctor extends User{
    role: 'doctor';
    specialisation: Specialisation;
    clinicId:string;
    bio?:string;
    consultationFee:number;
    availableSlots:TimeSlot[];
    rating?:number;
}

export interface Clinic {
    id: string;
    name: string;
    location: string;
    address:string;
    phone:string;
    doctors:string[]
}

export interface Appointment {
    id: string;
    patientId:string;
    doctorId:string;
    clinicId:string;
    date: string;
    timeslot:TimeSlot;
    status:AppointmentStatus;
    reason:string;
    notes?:string;
    createdAt:string;
    updatedAt:string;
}

export interface ApiResponse<T>{
    data:T;
    message:string;
    success:boolean;
}

export interface PaginatedApiResponse<T>{
    data:T[];
    pageSize:number;
    totalPages:number;
    total:number;
    page:number;
    hasNextPage?:boolean;
}