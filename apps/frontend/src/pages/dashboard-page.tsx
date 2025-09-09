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
import { useState } from "react";

const applications = [
  { key: "telegram", name: "Telegram" },
  { key: "whatsapp", name: "WhatsApp" },
  { key: "openai", name: "OpenAI" },
];

const DashBoardPage = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState("");
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
                <DialogTitle className="font-kode font-bold">Select Application</DialogTitle>
                <DialogDescription>
                  <Select onValueChange={(value) => setSelectedApp(value)} value={selectedApp}>
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
                  <div className="mt-3 font-inter">
                  {selectedApp === "openai" && <div>TODO : openai data</div>}
                  {selectedApp === "telegram" && <div>TODO : telegram data</div>}
                  {selectedApp === "whatsapp" && <div>TODO : whatsapp data</div>}
                  </div>
                </DialogDescription>
              </DialogHeader>
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
