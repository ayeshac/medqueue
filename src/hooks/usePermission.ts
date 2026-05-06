"use client"
import { useSession } from "next-auth/react";

type Action = 
| "view:analytics"
| "manage:doctors"
| "manage:patients"
| "book:appointment"
| "view:allAppointments";

const usePermission = (action : Action)=> {
    const {data:session} = useSession();
    const role = session?.user.role;

    const permissions = {
        admin: ["view:analytics", "manage:doctors", "manage:patients", "book:appointment", "view:allAppointments"],
        doctor: ["view:allAppointments"],
        patient: ["book:appointment","view:analytics"],
      }

      // get permissions for current role
// if role is undefined, return empty array
const userPermissions = permissions[role as keyof typeof permissions] ?? []

// check if action is in the array
return userPermissions.includes(action)
}

export default usePermission