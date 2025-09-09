import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const WorkflowPage = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes : any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes : any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params : any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
 
  return (
    <div className="m-16 mx-auto max-w-7xl w-full">
      {/* Header*/}
      <div className="flex h-16 items-center justify-between ">
        <div className="flex gap-2 items-center">
          <div className="font-kode font-bold">Workflow </div>
          <Input placeholder="workflow name" className="border-transparent"/>
        </div>
        <div className="flex gap-5">

          <Button className="font-kode">Save</Button>
        </div>
      </div>

      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Panel position="top-center" className="bg-white font-kode px-2 py-1 border border-black  rounded-md">Workflow Editor</Panel>
              <Background />
              <Controls/>
        </ReactFlow>

      </div>

    </div>
  )
}

export default WorkflowPage
