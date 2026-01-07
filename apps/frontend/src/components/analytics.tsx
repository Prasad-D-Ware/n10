import { AnalyticsCard } from "./analytics-card"
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/lib/config"
import { Loader2 } from "lucide-react"

export function Analytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    const response = await axios.get(`${BACKEND_URL}/analytics`)
    const data = response.data
    setAnalytics(data.analytics)
  }

  if (!analytics) {
    return <div className="p-4 sm:p-6 md:p-0 md:m-16 mx-auto max-w-7xl w-full flex items-center justify-center h-[60vh] sm:h-[850px]">
    <div className="text-center">
      <Loader2 className="animate-spin text-orange-500"/>
    </div>
  </div>
  }

  return (
    <div className="p-4 sm:p-6 md:p-0 md:m-16 mx-auto max-w-7xl w-full">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-kode text-orange-500 mb-1 sm:mb-2">
          Analytics Overview
        </h2>
        <p className="text-muted-foreground font-inter text-sm sm:text-base">
          Key metrics and performance indicators for your automation workflows
        </p>
      </div>
      
      <AnalyticsCard analytics={analytics} />
    </div>
  )
}

export default Analytics
