import { useEffect, useState } from "react";

export function useDebounce<T>(value:T,delay:number): T {
    const [debounceValue,setDebounceValue] = useState<T>(value)

    useEffect(()=>{
        let debounceTimer = setTimeout(()=>{
            setDebounceValue(value)
        },delay)
        return(()=>clearTimeout(debounceTimer))
    },[value,delay])

    return debounceValue

}