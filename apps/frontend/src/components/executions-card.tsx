import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"

interface ExecutionItem {
  id: string
  status: "SUCCESS" | "FAILED" | "RUNNING" | string
  started_at: string
  ended_at?: string
  workflow: {
    id: string
    name: string
  }
}

interface ExecutionsCardsProps {
  executions: ExecutionItem[]
}

export function ExecutionsCards({ executions }: ExecutionsCardsProps) {
  const navigate = useNavigate()

  const statusVariant = (status: string) => {
    if (status === "SUCCESS") return "default" as const
    if (status === "FAILED") return "destructive" as const
    return "outline" as const
  }

  const statusClassName = (status: string) => {
    if (status === "SUCCESS") return "bg-green-500 text-white hover:bg-green-600"
    return ""
  }

  const formatWhen = (dateString?: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const formatExecutionTime = (startTime: string, endTime?: string) => {
    if (!endTime) return "—"
    
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationMs = end - start
    
    if (durationMs < 1000) {
      return `${durationMs}ms`
    } else if (durationMs < 60000) {
      return `${(durationMs / 1000).toFixed(1)}s`
    } else {
      return `${(durationMs / 60000).toFixed(1)}m`
    }
  }

  if (!executions || executions.length === 0) {
    return (
      <div className="h-[400px] sm:h-[600px] w-full flex justify-center items-center">
        <div className="font-kode font-bold text-lg sm:text-xl text-center px-4">No Executions Yet!</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 max-w-7xl">
      {(executions || []).map((exec) => (
        <Card key={exec.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Badge 
                    variant={statusVariant(exec.status)} 
                    className={`font-inter uppercase text-[10px] sm:text-xs flex-shrink-0 ${statusClassName(exec.status)}`}
                  >
                    {exec.status}
                  </Badge>
                  <button
                    onClick={() => navigate(`/workflows/${exec.workflow.id}`)}
                    className="text-left truncate hover:underline font-semibold text-sm sm:text-base"
                  >
                    {exec.workflow.name}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground sm:ml-auto">
                  <span>{formatWhen(exec.started_at)}</span>
                  {exec.ended_at && (
                    <span className="font-medium">
                      • {formatExecutionTime(exec.started_at, exec.ended_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ExecutionsCards


