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
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { TriggerCard, type Trigger } from "@/components/trigger-card";

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { label: "MANUAL", type: "trigger",input:{ message  : "hello happy bday" } },
  },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
  { id: "n3", position: { x: 0, y: 200 }, data: { label: "Node 3" } },
  { id: "n4", position: { x: 0, y: 300 }, data: { label: "Node 4" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" },{ id: "n2-n3", source: "n2", target: "n3" },{ id: "n3-n4", source: "n3", target: "n4" }];

const WorkflowPage = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [enable, setEnable] = useState(false);
  const [showTriggerSheet, setTriggerSheet] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [availableTriggers,setAvailableTriggers] = useState([]);

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
          setNodes(workflow.nodes || initialNodes);
          setEdges(workflow.edges || initialEdges);
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
    setTriggerSheet(true);
    const response = await axios.get("http://localhost:3000/api/v1/availableTrigger");

    const data = response.data;

    if(!data.success){
      console.log("Error",data.error);
      return;
    }

    console.log(data.triggers);
    setAvailableTriggers(data.triggers);
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
          onConnect={onConnect}
          fitView
          colorMode={theme}
          className="flex items-center justify-center"
          // maxZoom={1}
        >
          <Panel
            position="top-center"
            className="bg-orange-500 font-kode px-2 py-1 border border-black  rounded-md dark:text-black"
          >
            Workflow Editor
          </Panel>
          <Background />
          <div className="flex items-center justify-center flex-col">
            <Sheet>
              <SheetTrigger
                className="z-10 border border-dashed border-white h-20 w-20 flex items-center justify-center text-3xl rounded-xl"
                onClick={handleAddTrigger}
              >
                +
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="mt-10">
                  <SheetTitle className="font-kode">What triggers this workflow?</SheetTitle>
                  <SheetDescription className="font-inter">
                  A trigger is a step that starts your workflow
                  </SheetDescription>
                    </SheetHeader>
                  <div className="flex flex-col gap-5 mx-5">
                  {availableTriggers.map((trigger : Trigger) => 
                    <TriggerCard key={trigger.id} trigger={trigger} />
                  )}
                   </div>
              </SheetContent>
            </Sheet>

            <div className="font-kode mt-2">Add First Step</div>
          </div>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default WorkflowPage;
