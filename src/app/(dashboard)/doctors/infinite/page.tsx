"use client"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useRef, useEffect } from "react"



const DoctorInfiniteDashboard = () => {
  const sentinelRef = useRef<HTMLDivElement>(null)

    const fetchDoctors = async ({ pageParam }: { pageParam: number }) => {
        const res = await fetch(`/api/doctors?page=${pageParam}&limit=4`)
        const json = await res.json()
        return json
      }

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['doctors-infinite'],
        queryFn: (({pageParam}) => fetchDoctors({pageParam})),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.hasNextPage ? lastPage.page + 1 : undefined
        }
    })

    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      })
    
      if (sentinelRef.current) {
        observer.observe(sentinelRef.current)
      }
    
      return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <div>
          {data?.pages.flatMap(page => page.data).map((doctor) => (
            <div key={doctor.id}>
              {doctor.name}
            </div>
          ))}
          {isFetchingNextPage && <p>Loading more...</p>}
          {!hasNextPage && <p>No more doctors</p>}
          <div ref={sentinelRef} className="h-4" />
        </div>
      )
}

export default DoctorInfiniteDashboard