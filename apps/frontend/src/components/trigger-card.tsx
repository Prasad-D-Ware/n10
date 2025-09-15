import { MousePointer, Webhook, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface Trigger {
  id: string
  name: string
  type: string
  description: string
}

interface TriggerCardProps {
  trigger: Trigger
  onSelect?: (trigger: Trigger) => void
}

const getTriggerIcon = (type: string) => {
  switch (type) {
    case "manual-trigger":
      return <MousePointer className="w-6 h-6 text-orange-500" />
    case "webhook-trigger":
      return <Webhook className="w-6 h-6 text-orange-500" />
    default:
      return <Zap className="w-6 h-6 text-orange-500" />
  }
}

const getTriggerDisplayName = (name: string, type: string) => {
  if (type === "webhook-trigger") {
    return (
      <span className="flex items-center gap-2">
        {name} <span className="text-orange-500">⚡</span>
      </span>
    )
  }
  return name
}

export function TriggerCard({ trigger, onSelect }: TriggerCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 hover:border-l-orange-400" onClick={() => onSelect?.(trigger)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{getTriggerIcon(trigger.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-kode font-semibold text-lg text-foreground mb-2">
              {getTriggerDisplayName(trigger.name, trigger.type)}
            </h3>
            <p className="font-inter text-muted-foreground text-sm leading-relaxed">
              {trigger.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
