import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  Panel,
  MiniMap,
  type Node,
  type Edge,
  useReactFlow,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/components/theme-provider";
import SlideToggle from "@/components/toggle-slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { TriggerCard, type Trigger } from "@/components/trigger-card";
import { ActionCard } from "@/components/action-card";
import { ActionNode, TriggerNode } from "@/components/custom-nodes";


const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
}

const initialNodes : Node[] = [
  // {
  //   id: "n1",
  //   type : "trigger",
  //   position: { x: 0, y: 0 },
  //   data: { label: "MANUAL", type: "manual-trigger",input:{ message  : "hello happy bday" } },
  // },
  // { id: "n2", type: "action", position: { x: 100, y: 0 }, data: { label: "Node 2" ,type: "telegram"} },
  // { id: "n3", type: "action", position: { x: 200, y: 0 }, data: { label: "Node 3" ,type: "resend"} },
  // { id: "n4", type: "action", position: { x: 300, y: 0 }, data: { label: "Node 4" ,type: "openai"} },
  // { id: "n5", type: "action", position: { x: 400, y: 0 }, data: { label: "Node 5" ,type: "whatsapp"} },
  // { id: "n6", type: "action", position: { x: 500, y: 0 }, data: { label: "Node 6" ,type: "agent"} },
  // { id: "n7", type: "action", position: { x: 450, y: 100 }, data: { label: "Node 6" ,type: "openai"} },
  // { id: "n8", type: "action", position: { x: 600, y: 100 }, data: { label: "Node 6" ,type: "resend"} },
  // { id: "n9", type: "action", position: { x: 650, y: 0 }, data: { label: "Node 6" ,type: "telegram"} },
];
const initialEdges : Edge[] =  [
  // { id: "n1-n2", source: "n1", target: "n2" },
  // { id: "n2-n3", source: "n2", target: "n3" },
  // { id: "n3-n4", source: "n3", target: "n4" },
  // { id: "n4-n5", source: "n4", target: "n5" },
  // { id: "n5-n6", source: "n5", target: "n6" },
  // { id: "n6-n7", source: "n6", target: "n7" ,sourceHandle: "model"},
  // { id: "n7-n8", source: "n6", target: "n8" ,sourceHandle: "tools"},
  // { id: "n6-n9", source: "n6", target: "n9" },
];

const WorkflowPage = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [enable, setEnable] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [availableTriggers,setAvailableTriggers] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"trigger" | "action">("trigger");

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/workflows/${id}`);

        if (response.data.success) {
          const workflow = response.data.workflow;
          setWorkflowName(workflow.name || "");
          setEnable(workflow.enabled || false);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
        } else {
          toast.error(response.data.message || "Failed to fetch workflow");
        }
      } catch (error: any) {
        console.error("Error fetching workflow:", error);
        toast.error("Failed to fetch workflow data");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [id]);

  const handleAddTrigger = async () => {
    const response = await axios.get("http://localhost:3000/api/v1/availableTrigger");

    const data = response.data;

    if(!data.success){
      console.log("Error",data.error);
      return;
    }

    console.log(data.triggers);
    setAvailableTriggers(data.triggers);
  };

  const openPicker = async (mode: "trigger" | "action") => {
    setPickerMode(mode);
    if (mode === "trigger") {
      await handleAddTrigger();
    }
    setIsPickerOpen(true);
  };

  const handleSelectAction = (action: { id: string; name: string; type: string }) => {
    const newId = `a-${Date.now()}`;
    const actionNode = {
      id: newId,
      type: "action" as const,
      position: { x: 150, y: nodes.length * 40 },
      data: { label: action.name, type: action.type },
    };
    setNodes((prev) => [ ...prev,actionNode]);
    setIsPickerOpen(false);
  };

  const handleSaveWorkflow = async () => {
    setSaving(true);
    try {
      if(id){
        const response = await axios.put(`http://localhost:3000/api/v1/workflows/${id}`,{
          name : workflowName,
          enabled : enable,
          nodes,
          edges
        })

        if(!response.data.success){
          console.log("Error Updating" , response.data.error);
          toast.error(response.data.message);
          return;
        }

        toast.success(response.data.message);
      } else { 
        const response = await axios.post("http://localhost:3000/api/v1/workflows/create",{
        name : workflowName,
        enabled : enable,
        nodes,
        edges
      })

      if(!response.data.success){
        console.log("Error Creating" , response.data.error);
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      
      const workflowId = response.data.workflow.id;
      navigate(`/workflows/${workflowId}`);}
      
    } catch (error : any) {
      console.log("Error in creating workflow")
      toast.error("Failed to save workflow");
    } finally {
      setSaving(false);
    }
  }

  const handleSelectTrigger = (trigger: Trigger) => {
    // console.log(trigger)
    const newId = `t-${Date.now()}`;
    const triggerNode = {
      id: newId,
      type: "trigger" as const,
      position: { x: 0, y: 0 },
      data: { label: trigger.name, type: trigger.type },
    };
    setNodes((prev) => [...prev,triggerNode]);
    setIsPickerOpen(false);
  };

  if (loading) {
    return (
      <div className="m-16 mx-auto max-w-7xl w-full flex items-center justify-center h-[850px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-orange-500"/>
        </div>
      </div>
    );
  }

  return (
    <div className="m-16 mx-auto max-w-7xl w-full">
      {/* Header*/}
      <div className="flex h-16 items-center justify-between ">
        <div className="flex gap-2 items-center">
          <div className="font-kode font-bold text-orange-500">Workflow </div>
          <Input placeholder="workflow name" className="border-transparent" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)}/>
        </div>
        <div className="flex items-center  gap-5">
          <div className="font-inter flex gap-2 items-center ">
            Enabled : <SlideToggle enabled={enable} setEnable={setEnable} />
            <span className="ml-2 text-sm opacity-70">
              {enable ? "On" : "Off"}
            </span>
          </div>
          <Button 
            className="font-kode font-bold bg-orange-500" 
            onClick={handleSaveWorkflow}
            disabled={saving}
          >
            {saving ? (
              <div className="px-1.5 py-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      <div className="w-full h-full pb-2">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          fitView
          colorMode={theme}
          className="flex items-center justify-center"
          // maxZoom={1}
        >
          <MiniMap/>
          <Panel
            position="top-center"
            className="bg-orange-500 font-kode px-2 py-1 border border-black  rounded-md dark:text-black"
          >
            Workflow Editor
          </Panel>
          <Panel position="top-left" className="bg-transparent shadow-none font-inter"> {nodes.length > 0 && <span className="text-sm opacity-70">Drag and connect nodes to create your workflow</span>}</Panel>
          <Background />
          <Panel position="top-right" className="bg-transparent shadow-none">
            <Button
              className="border p-5 rounded-lg h-10 w-10 flex items-center justify-center border-orange-500"
              variant={"ghost"}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openPicker(nodes.length === 0 ? "trigger" : "action");
              }}
            >
              <Plus className="h-4 w-4"/>
            </Button>
          </Panel>
          {nodes.length === 0 && (
            <div className="flex items-center justify-center flex-col">
              <button
                className="z-10 border border-dashed border-black dark:border-white h-20 w-20 flex items-center justify-center text-3xl rounded-xl"
                onClick={() => openPicker("trigger")}
              >
                +
              </button>
              <div className="font-kode mt-2">Add First Step</div>
            </div>
          )}
          <Controls orientation="horizontal"/>
        </ReactFlow>
      </div>

      <Sheet open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <SheetContent>
          {pickerMode === "trigger" ? (
            <>
              <SheetHeader className="mt-10">
                <SheetTitle className="font-kode">What triggers this workflow?</SheetTitle>
                <SheetDescription className="font-inter">
                  A trigger is a step that starts your workflow
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-5 mx-5 mt-4">
                {availableTriggers.map((trigger: Trigger) => (
                  <TriggerCard key={trigger.id} trigger={trigger} onSelect={handleSelectTrigger} />
                ))}
              </div>
            </>
          ) : (
            <>
              <SheetHeader className="mt-10">
                <SheetTitle className="font-kode">What Happens Next?</SheetTitle>
                <SheetDescription className="font-inter">
                  Add an action step to your workflow
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3 mx-5 mt-4">
                {[
                  { id: "telegram", name: "Telegram", type: "telegram" },
                  { id: "whatsapp", name: "WhatsApp", type: "whatsapp" },
                  { id: "openai", name: "OpenAI", type: "openai" },
                  { id: "resend", name: "Resend", type: "resend" },
                  { id: "agent", name: "AI-Agent", type: "agent" },
                ].map((app) => (
                  <ActionCard key={app.id} action={app} onSelect={handleSelectAction} />
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WorkflowPage;
