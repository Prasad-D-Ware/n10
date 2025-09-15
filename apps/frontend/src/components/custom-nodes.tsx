import { Handle, Position } from "@xyflow/react";
import { MousePointer, Webhook ,Bot, Brain, Wrench} from "lucide-react"
import telegram from "../assets/telegram.svg"
import whatsapp from "../assets/whatsapp.svg"
import openai from "../assets/openai.svg"
import resend from "../assets/resend.svg"

export const TriggerNode = ({data} :{data: any}) => {
  return (
    <div className="relative flex items-center justify-center border border-black dark:border-white dark:bg-neutral-900 p-2 rounded-l-md">
      {data.type === "manual-trigger" && <MousePointer  className="w-6 h-6 text-orange-500" />}
      {data.type === "webhook-trigger" && <Webhook className="w-6 h-6 text-orange-500" />}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export const ActionNode = ({data} :{data: any}) => {
    // console.log(data);
    return (
      <div className={`flex items-center justify-center dark:bg-neutral-900 rounded-md border border-black dark:border-white p-2 ${data.type === "agent" ? "w-28" : ""}`}>
        <Handle type="target" position={Position.Left} />
        {data.type === "telegram" && <img src={telegram} alt="telegram" className="w-6 h-6" />}
        {data.type === "whatsapp" && <img src={whatsapp} alt="whatsapp" className="w-6 h-6" />}
        {data.type === "openai" && <img src={openai} alt="openai" className="w-6 h-6" />}
        {data.type === "resend" && <img src={resend} alt="resend" className="w-6 h-6" />}
        {data.type === "agent" && <Bot className="w-6 h-6" />}
        <Handle type="source" position={Position.Right}/>
        {data.type === "agent" && <Handle type="source" position={Position.Bottom} id="model" className="!left-2">
          <div className="flex items-center justify-center w-2 h-5 ">
          <Brain size={16} />
          </div>
          </Handle>}
        {data.type === "agent" && <Handle type="source" position={Position.Bottom} id="tool" className="!right-5" >  <div className="flex items-center justify-center w-2 h-5 ">
          <Wrench size={16} />
          </div></Handle>}
      </div>
    )
}