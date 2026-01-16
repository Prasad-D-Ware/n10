import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FlaskConical, Loader2, Plus, Copy } from "lucide-react";
import { TriggerCard, type Trigger } from "@/components/trigger-card";
import { ActionCard } from "@/components/action-card";
import { ActionNode, TriggerNode } from "@/components/custom-nodes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OpenAICredentials from "@/components/openai-credentials";
import TgCredentials from "@/components/tg-credentials";
import ResendCredential from "@/components/resend-credential";
import WpCredentials from "@/components/wp-credentials";
import { BACKEND_URL } from "@/lib/config";
import SolanaCredential from "@/components/solana-credential";
import { useSidebar } from "@/components/ui/sidebar";


const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
}

// const initialNodes : Node[] = [
//   // {
//   //   id: "n1",
//   //   type : "trigger",
//   //   position: { x: 0, y: 0 },
//   //   data: { label: "MANUAL", type: "manual-trigger",input:{ message  : "hello happy bday" } },
//   // },
//   // { id: "n2", type: "action", position: { x: 100, y: 0 }, data: { label: "Node 2" ,type: "telegram"} },
//   // { id: "n3", type: "action", position: { x: 200, y: 0 }, data: { label: "Node 3" ,type: "resend"} },
//   // { id: "n4", type: "action", position: { x: 300, y: 0 }, data: { label: "Node 4" ,type: "openai"} },
//   // { id: "n5", type: "action", position: { x: 400, y: 0 }, data: { label: "Node 5" ,type: "whatsapp"} },
//   // { id: "n6", type: "action", position: { x: 500, y: 0 }, data: { label: "Node 6" ,type: "agent"} },
//   // { id: "n7", type: "action", position: { x: 450, y: 100 }, data: { label: "Node 6" ,type: "openai"} },
//   // { id: "n8", type: "action", position: { x: 600, y: 100 }, data: { label: "Node 6" ,type: "resend"} },
//   // { id: "n9", type: "action", position: { x: 650, y: 0 }, data: { label: "Node 6" ,type: "telegram"} },
// ];
// const initialEdges : Edge[] =  [
//   // { id: "n1-n2", source: "n1", target: "n2" },
//   // { id: "n2-n3", source: "n2", target: "n3" },
//   // { id: "n3-n4", source: "n3", target: "n4" },
//   // { id: "n4-n5", source: "n4", target: "n5" },
//   // { id: "n5-n6", source: "n5", target: "n6" },
//   // { id: "n6-n7", source: "n6", target: "n7" ,sourceHandle: "model"},
//   // { id: "n7-n8", source: "n6", target: "n8" ,sourceHandle: "tools"},
//   // { id: "n6-n9", source: "n6", target: "n9" },
// ];

const WorkflowPage = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [enable, setEnable] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: sidebarState, isMobile } = useSidebar();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<Node, Edge> | null>(null);
  const [pendingViewport, setPendingViewport] = useState<{ x: number; y: number; zoom: number } | null>(null);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, "IDLE" | "RUNNING" | "SUCCESS" | "FAILED">>({});
  const [isExecuting, setIsExecuting] = useState(false);

  // decorate nodes with status for styling
  const decorateNodesWithStatus = useCallback(() => {
    setNodes((prev) =>
      prev.map((n) => {
        const status = nodeStatuses[n.id] || "IDLE";
        return { ...n, data: { ...(n.data as any), __status: status } } as Node;
      })
    );
  }, [nodeStatuses]);

  useEffect(() => {
    decorateNodesWithStatus();
  }, [nodeStatuses, decorateNodesWithStatus]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [formData, setFormData] = useState<any>({});


  type Credential = {
    id: string;
    user_id: string;
    name: string;
    application: string;
    data: Record<string, any>;
    created_at: string;
    updated_at: string;
  };
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isCredDialogOpen, setIsCredDialogOpen] = useState(false);
  const [creatingCred, setCreatingCred] = useState(false);
  const [credSelectedApp, setCredSelectedApp] = useState("");
  const [credName, setCredName] = useState("");
  const [credData, setCredData] = useState<Record<string, any>>({});
  const [pendingCredentialForNodeId, setPendingCredentialForNodeId] = useState<string | null>(null);


  const saveFLow = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      return flow;
    }
  }, [rfInstance]);

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

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
    const existing = (node.data as any)?.config || {};
    setFormData(existing);
    setIsConfigOpen(true);
  }, []);

  const updateForm = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveNodeConfig = () => {
    if (!selectedNode) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: { ...(n.data as any), config: formData },
            }
          : n
      )
    );
    setIsConfigOpen(false);
    setSelectedNode(null);
  };

  const fetchAllCredentials = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/credentials`);
      const data = response.data;
      if (!data.success) {
        return;
      }
      setCredentials(
        (data.credentials as Credential[])
          .slice()
          .sort((a: Credential, b: Credential) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );
    } catch (error) {
      // ignore
    }
  };

  useEffect(() => {
    fetchAllCredentials();
  }, []);

  const openCreateCredentialDialog = (application: string, forNodeId?: string) => {
    setCredSelectedApp(application);
    setCredName("");
    setCredData({});
    if (forNodeId) setPendingCredentialForNodeId(forNodeId);
    setIsCredDialogOpen(true);
  };

  const handleCreateCredential = async () => {
    setCreatingCred(true);
    try {
      const payload = { name: credName, application: credSelectedApp, data: credData };
      const response = await axios.post(`${BACKEND_URL}/credentials/create`, payload);
      const data = response.data;
      if (!data.success) {
        toast.error(data.message || "Failed to create credential");
        return;
      }
      toast.success(data.message || "Credential created");
      await fetchAllCredentials();
      if (pendingCredentialForNodeId && selectedNode && selectedNode.id === pendingCredentialForNodeId) {
        const match = credentials.find((c) => c.application === credSelectedApp);
        if (match) {
          setFormData((prev: any) => ({ ...prev, credential: match.id }));
        }
      }
      setIsCredDialogOpen(false);
      setPendingCredentialForNodeId(null);
    } catch (error) {
      toast.error("Failed to create credential");
    } finally {
      setCreatingCred(false);
    }
  };

  const CredentialSelector = ({ appType, value, onChange }: { appType: string; value: string; onChange: (v: string) => void }) => {
    const items = credentials.filter((c) => c.application === appType);
    return (
      <Select
        value={value || ""}
        onValueChange={(val) => {
          if (val === "__add__") {
            openCreateCredentialDialog(appType, selectedNode?.id);
            return;
          }
          onChange(val);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Credential" />
        </SelectTrigger>
        <SelectContent>
          {items.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
          <SelectItem value="__add__">+ Add Credential…</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  type FormRenderer = (fd: any, update: (k: string, v: any) => void) => React.ReactNode;

  const nodeFormRenderers: Record<string, Record<string, FormRenderer>> = {
    trigger: {
      "manual-trigger": () => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Button onClick={handleExecuteWorkflow} className="bg-orange-500" disabled={isExecuting}>
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <FlaskConical />
                  Execute Workflow
                </>
              )}
            </Button>
          </div>
        </div>
      ),
      "webhook-trigger": () => {
        const url = id ? `https://n10.prsd.dev${BACKEND_URL}/webhook/${id}` : "";
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(url);
            toast.success("Webhook URL copied to clipboard");
          } catch {
            toast.error("Failed to copy URL");
          }
        };
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Save workflow to get the URL"
                  value={url}
                  readOnly
                />
                <Button type="button" className="bg-orange-500" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </div>
            </div>
          </div>
        );
      },
    },
    action: {
      telegram: (fd, update) => (
        <div className="flex flex-col gap-3">
           <div className="flex flex-col gap-1">
          <Label>Credential</Label>
            <CredentialSelector appType="telegram" value={fd.credential} onChange={(v) => update("credential", v)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Chat ID</Label>
            <Input
              placeholder="123456789"
              value={fd.chatId || ""}
              onChange={(e) => update("chatId", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Message</Label>
            <Input
              placeholder="Your message"
              value={fd.message || ""}
              onChange={(e) => update("message", e.target.value)}
            />
          </div>
        </div>
      ),
      whatsapp: (fd, update) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label>Credential</Label>
            <CredentialSelector appType="whatsapp" value={fd.credential} onChange={(v) => update("credential", v)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Recipient Phone</Label>
            <Input
              placeholder="+91-..."
              value={fd.phone || ""}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Message</Label>
            <Input
              placeholder="Your message"
              value={fd.message || ""}
              onChange={(e) => update("message", e.target.value)}
            />
          </div>
        </div>
      ),
      openai: (fd, update) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label>Credential</Label>
            <CredentialSelector appType="openai" value={fd.credential} onChange={(v) => update("credential", v)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Prompt</Label>
            <Input
              placeholder="Write a poem about..."
              value={fd.prompt || ""}
              onChange={(e) => update("prompt", e.target.value)}
            />
          </div>
        </div>
      ),
      resend: (fd, update) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label>Credential</Label>
            <CredentialSelector appType="resend" value={fd.credential} onChange={(v) => update("credential", v)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>To</Label>
            <Input
              placeholder="user@example.com"
              value={fd.to || ""}
              onChange={(e) => update("to", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Subject</Label>
            <Input
              placeholder="Subject"
              value={fd.subject || ""}
              onChange={(e) => update("subject", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Body</Label>
            <Input
              placeholder="Email body"
              value={fd.body || ""}
              onChange={(e) => update("body", e.target.value)}
            />
          </div>
        </div>
      ),
      agent: (fd, update) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label>Model</Label>
            <Input
              placeholder="gpt-4o"
              value={fd.model || ""}
              onChange={(e) => update("model", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Tools (comma separated)</Label>
            <Input
              placeholder="search, calculator"
              value={fd.tools || ""}
              onChange={(e) => update("tools", e.target.value)}
            />
          </div>
        </div>
      ),
      solana: (fd, update) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label>Credential</Label>
            <CredentialSelector appType="solana" value={fd.credential} onChange={(v) => update("credential", v)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Wallet Address</Label>
            <Input
              placeholder="U5eyyuMUzn8TvRaWnrdLj.."
              value={fd.address || ""}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Amount</Label>
            <Input
              placeholder="0.001"
              value={fd.amount || ""}
              onChange={(e) => update("amount", e.target.value)}
            />
          </div>
        </div>
      ),
    },
  };

  const renderNodeForm = () => {
    if (!selectedNode) return null;
    const nodeKind = selectedNode.type || "";
    const nodeType = (selectedNode.data as any)?.type || "";
    const renderer = nodeFormRenderers[nodeKind]?.[nodeType];
    if (renderer) return renderer(formData, updateForm);
    return <div className="text-sm opacity-70">No configuration for this node type.</div>;
  };

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/workflows/${id}`);

        if (response.data.success) {
          const workflow = response.data.workflow;
          setWorkflowName(workflow.name || "");
          setEnable(workflow.enabled || false);

          const flow = workflow.flow;

          if (flow) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setPendingViewport({ x, y, zoom });
          }
          // setNodes(workflow.nodes || []);
          // setEdges(workflow.edges || []);
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
    const response = await axios.get(`${BACKEND_URL}/availableTrigger`);

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
    const flow = saveFLow();
    console.log(flow);
    try {
      if(id){
        const response = await axios.put(`${BACKEND_URL}/workflows/${id}`,{
          name : workflowName,
          enabled : enable,
          nodes,
          edges,
          flow
        })

        if(!response.data.success){
          console.log("Error Updating" , response.data.error);
          toast.error(response.data.message);
          return;
        }

        toast.success(response.data.message);
      } else { 
        const response = await axios.post(`${BACKEND_URL}/workflows/create`,{
        name : workflowName,
        enabled : enable,
        nodes,
        edges,
        flow
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
      data: { 
        label: trigger.name, 
        type: trigger.type,
      },
    };
    setNodes((prev) => [...prev,triggerNode]);
    setIsPickerOpen(false);
  };

  const handleExecuteWorkflow = async () => {
    setIsExecuting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/execute`,{
        workflowId: id
      })
  
      const data = response.data;
  
      if(!data.success){
        console.log("Error Executing Workflow" , data.error);
        toast.error(data.message);
        setIsExecuting(false);
        return;
      }
  
      // reset statuses to idle
      const next: Record<string, "IDLE" | "RUNNING" | "SUCCESS" | "FAILED"> = {};
      for (const n of nodes) next[n.id] = "IDLE";
      setNodeStatuses(next);
  
      // subscribe to SSE
      const es = new EventSource(`${BACKEND_URL}/execute/stream`, {
        withCredentials: true
      });
      
      es.onopen = () => {
        console.log("SSE connection opened");
      };
      
      es.onmessage = (ev) => {
        try {
          const event = JSON.parse(ev.data);
          console.log("SSE event received:", event);
          
          // Handle connection confirmation
          if (event.type === "connected") {
            console.log("SSE connection confirmed:", event.message);
            return;
          }
          
          if (!event?.executionId || event.executionId !== data.executionId) return;
          const nodeId = event.nodeId as string;
          const status = event.status as "RUNNING" | "SUCCESS" | "FAILED";
          setNodeStatuses((prev) => ({ ...prev, [nodeId]: status }));
          if (status === "FAILED" || status === "SUCCESS") {
            // Check if all nodes are done (both trigger and action nodes)
            const updatedStatuses = { ...nodeStatuses, [nodeId]: status };
            const allDone = nodes.every((n) => 
              updatedStatuses[n.id] === "SUCCESS" || updatedStatuses[n.id] === "FAILED"
            );
            if (allDone) {
              es.close();
              setIsExecuting(false);
            }
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };
      
      es.onerror = (error) => {
        console.error("SSE connection error:", error);
        es.close();
        setIsExecuting(false);
      };
    } catch (error) {
      setIsExecuting(false);
      throw error;
    } finally{
      setIsExecuting(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-orange-500"/>
        </div>
      </div>
    );
  }

  const headerLeftOffset = isMobile 
    ? "left-0" 
    : sidebarState === "expanded" 
      ? "md:left-[17rem]" 
      : "md:left-[5rem]";

  return (
    <div className="fixed inset-0 w-full h-full">
      <div className={`gradient-shadow-only fixed top-4 ${headerLeftOffset} right-4 z-50 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg shadow-lg transition-all duration-200 ease-linear`}>
        <div className="h-full px-4 flex items-center justify-between gap-4 max-w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="font-kode font-bold text-orange-500 text-sm whitespace-nowrap">Workflow</div>
            <Input 
              placeholder="workflow name" 
              className="border-transparent h-8 text-sm flex-1 max-w-xs" 
              value={workflowName} 
              onChange={(e) => setWorkflowName(e.target.value)}
            />
          </div>
          <Panel position="top-center" className="bg-transparent shadow-none font-inter hidden sm:block"> {nodes.length > 0 && <span className="text-sm opacity-70">Drag and connect nodes to create your workflow</span>}</Panel>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="font-inter flex gap-2 items-center text-xs sm:text-sm">
              <span className="hidden sm:inline">Enabled:</span>
              <SlideToggle enabled={enable} setEnable={setEnable} />
              <span className="text-xs opacity-70 whitespace-nowrap">
                {enable ? "On" : "Off"}
              </span>
            </div>
            <Button 
              className="font-kode font-bold bg-orange-500 hover:bg-orange-700 hover:text-white hover:cursor-pointer h-8 px-3 text-xs sm:text-sm" 
              onClick={handleSaveWorkflow}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              className="border p-2 sm:p-3 rounded-lg h-6 w-6 sm:h-9 sm:w-9 flex items-center justify-center border-orange-500"
              variant={"ghost"}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openPicker(nodes.length === 0 ? "trigger" : "action");
              }}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4"/>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          colorMode={theme}
          className="flex items-center justify-center"
          onInit={(reactFlowInstance) => {
            setRfInstance(reactFlowInstance);
            if (pendingViewport) {
              reactFlowInstance.setViewport(pendingViewport);
            }
          }}
          // maxZoom={1}
        >
          <Panel position="bottom-center">
            <Button className=" bg-orange-500 hover:bg-orange-700 text-white hover:cursor-pointer text-xs sm:text-sm" onClick={handleExecuteWorkflow} disabled={isExecuting}>
              {isExecuting ? (
                <>
                  <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="hidden sm:inline">Executing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <FlaskConical className="h-3 w-3 sm:h-4 sm:w-4"/>
                  <span className="hidden sm:inline ml-1">Execute</span>
                </>
              )}
            </Button>
          </Panel>
          <MiniMap className="hidden sm:block"/>
          <Background />
          {nodes.length === 0 && (
            <div className="flex items-center justify-center flex-col">
              <button
                className="z-10 border border-dashed border-black dark:border-white h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center text-2xl sm:text-3xl rounded-xl"
                onClick={() => openPicker("trigger")}
              >
                +
              </button>
              <div className="font-kode mt-2 text-sm sm:text-base">Add First Step</div>
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
                  // { id: "agent", name: "AI-Agent", type: "agent" },
                  { id: "solana", name: "Send Solana", type: "solana" },
                ].map((app) => (
                  <ActionCard key={app.id} action={app} onSelect={handleSelectAction} />
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-kode">
              {selectedNode ? `${(selectedNode.data as any)?.label || "Node"} Settings` : "Node Settings"}
            </DialogTitle>
            <DialogDescription className="font-inter">
              Configure this {selectedNode?.type} node.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">{renderNodeForm()}</div>
          {!(
            selectedNode?.type === "trigger" &&
            ((selectedNode?.data as any)?.type === "manual-trigger" || (selectedNode?.data as any)?.type === "webhook-trigger")
          ) && (
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsConfigOpen(false)}>Cancel</Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveNodeConfig}>Save</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCredDialogOpen} onOpenChange={setIsCredDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-kode font-bold text-orange-500">
              {credSelectedApp ? `Create ${credSelectedApp} Credential` : "Create Credential"}
            </DialogTitle>
            <DialogDescription>
              Add a new credential to use in this action
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3 font-inter">
              <Input
                placeholder="Credential Name"
                value={credName}
                onChange={(e) => setCredName(e.target.value)}
              />
              {credSelectedApp === "openai" && (
                <OpenAICredentials onDataChange={setCredData} />
              )}
              {credSelectedApp === "telegram" && (
                <TgCredentials onDataChange={setCredData} />
              )}
              {credSelectedApp === "whatsapp" && (
                <WpCredentials onDataChange={setCredData} />
              )}
              {credSelectedApp === "resend" && (
                <ResendCredential onDataChange={setCredData} />
              )}
              {credSelectedApp === "solana" && (
                  <SolanaCredential onDataChange={setCredData} />
              )}
              <Button
                className="font-kode w-full bg-orange-500"
                onClick={handleCreateCredential}
                disabled={creatingCred || !credSelectedApp || !credName}
              >
                {creatingCred ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Credential"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowPage;
