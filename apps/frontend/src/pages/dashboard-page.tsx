import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import ResendCredential from "@/components/resend-credential"
import WpCredentials from "@/components/wp-credentials";
import TgCredentials from "@/components/tg-credentials";
import OpenAICredentials from "@/components/openai-credentials";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

const demoApplications = [
  { key: "telegram", name: "Telegram" },
  { key: "whatsapp", name: "WhatsApp" },
  { key: "openai", name: "OpenAI" },
  { key: "resend", name: "Resend (Mail)" },
];

const DashBoardPage = () => {
  const navigate = useNavigate();
  const [applications] = useState(demoApplications);
  const [selectedApp, setSelectedApp] = useState("");
  const [credName,setCredName] = useState("");
  const [credData,setCredData] = useState({});

  useEffect(()=>{
    fetchAllCredentials();
  },[])

  const fetchAllCredentials = async() => {
    const response = await axios.get("http://localhost:3000/api/v1/credentials/create");

    const data = response.data;

    if(!data.success){
      toast.error(data.message);
      console.log(data.error);
      return;
    }

    toast.success(data.message);
    // TODO : set exisiting credentials that can show under credentials tab
  }

  const handleCreateCredentials = async() => {
      const response = await axios.post("http://localhost:3000/api/v1/credentials/create",{
        name : credName,
        application : selectedApp,
        data : credData
      })

      const data = response.data;

      if(!data.success){
        toast.error(data.message);
        console.log(data.error);
        return;
      }

      toast.success(data.message);
  }
  return (
    <div className="m-16 mx-auto max-w-7xl w-full">
      <div className="flex justify-between">
        <div className="">
          <div className="text-xl font-bold font-kode">Dashboard</div>
          <div className="font-inter">
            All the workflows, credentials and executions you have access to
          </div>
        </div>
        <div className="flex items-center gap-2 font-kode">
          <Button onClick={() => navigate("/workflows")}>
            Create Workflow
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Credentials</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-kode font-bold">
                  Select Application
                </DialogTitle>
                <DialogDescription>
                  Choose an application to create credentials for
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => setSelectedApp(value)}
                  value={selectedApp}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.key} value={app.key}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-3 font-inter">
                  <Input placeholder="Credential Name" value={credName} onChange={(e)=> setCredName(e.target.value)}/>
                  {selectedApp === "openai" && <OpenAICredentials onDataChange={setCredData}/>}
                  {selectedApp === "telegram" && <TgCredentials onDataChange={setCredData}/>}
                  {selectedApp === "whatsapp" && <WpCredentials onDataChange={setCredData}/>}
                  {selectedApp === "resend" && <ResendCredential onDataChange={setCredData}/>}
                  <Button className="font-kode w-full" onClick={handleCreateCredentials}>Create Credential</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-10 h-full w-full">
        <Tabs defaultValue="workflows" className="font-inter">
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
          </TabsList>
          <TabsContent value="workflows">
            TODO : get all workflows made by this user
          </TabsContent>
          <TabsContent value="credentials">
            TODO : get all credentials given by this user
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashBoardPage;
