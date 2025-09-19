import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Workflow, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Key,
  TrendingUp,
} from "lucide-react"

interface AnalyticsData {
  totalWorkflows: number
  successfulExecutions: number
  failedExecutions: number
  avgExecutionTime: number
  totalCreds: number
}

interface AnalyticsCardProps {
  analytics: AnalyticsData
  className?: string
}

export function AnalyticsCard({ analytics, className }: AnalyticsCardProps) {
  const formatExecutionTime = (seconds: number) => {
    if (seconds < 1) {
      return `${(seconds * 1000).toFixed(0)}ms`
    } else if (seconds < 60) {
      return `${seconds.toFixed(1)}s`
    } else {
      return `${(seconds / 60).toFixed(1)}m`
    }
  }

  const totalExecutions = analytics.successfulExecutions + analytics.failedExecutions
  const successRate = totalExecutions > 0 ? (analytics.successfulExecutions / totalExecutions * 100) : 0

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full ${className}`}>
      {/* Total Workflows */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Workflows
            </CardTitle>
            <Workflow className="h-4 w-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-kode text-orange-500">
            {analytics.totalWorkflows}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active automation workflows
          </p>
        </CardContent>
      </Card>

      {/* Successful Executions */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful Executions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-kode text-green-500">
            {analytics.successfulExecutions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {successRate.toFixed(1)}% success rate
          </p>
        </CardContent>
      </Card>

      {/* Failed Executions */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Executions
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-kode text-red-500">
            {analytics.failedExecutions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalExecutions > 0 ? ((analytics.failedExecutions / totalExecutions) * 100).toFixed(1) : 0}% failure rate
          </p>
        </CardContent>
      </Card>

      {/* Average Execution Time */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Execution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-kode text-blue-500">
            {formatExecutionTime(analytics.avgExecutionTime)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average workflow duration
          </p>
        </CardContent>
      </Card>

      {/* Total Credentials */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Credentials
            </CardTitle>
            <Key className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-kode text-purple-500">
            {analytics.totalCreds}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Connected integrations
          </p>
        </CardContent>
      </Card>

      {/* Success Rate Badge */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Performance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge 
              variant={successRate >= 80 ? "default" : successRate >= 60 ? "secondary" : "destructive"}
              className={`font-kode text-sm ${
                successRate >= 80 
                  ? "bg-green-500 hover:bg-green-600" 
                  : successRate >= 60 
                  ? "bg-yellow-500 hover:bg-yellow-600" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {successRate.toFixed(1)}%
            </Badge>
            <span className="text-sm text-muted-foreground">
              {successRate >= 80 ? "Excellent" : successRate >= 60 ? "Good" : "Needs Attention"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on {totalExecutions} total executions
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsCard
