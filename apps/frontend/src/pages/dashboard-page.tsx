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
import ResendCredential from "@/components/resend-credential";
import WpCredentials from "@/components/wp-credentials";
import TgCredentials from "@/components/tg-credentials";
import OpenAICredentials from "@/components/openai-credentials";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { CredentialsCards } from "@/components/credential-card";
import { Loader2 } from "lucide-react";

const demoApplications = [
  { key: "telegram", name: "Telegram" },
  { key: "whatsapp", name: "WhatsApp" },
  { key: "openai", name: "OpenAI" },
  { key: "resend", name: "Resend (Mail)" },
];

export interface Credentials {
  id: string;
  user_id: string;
  name: string;
  application: string;
  data: {
    apikey?: string;
    accessToken?: string;
    businessAccountId?: string;
  };
  created_at: string;
  updated_at: string;
}

const DashBoardPage = () => {
  const navigate = useNavigate();
  const [applications] = useState(demoApplications);
  const [selectedApp, setSelectedApp] = useState("");
  const [credName, setCredName] = useState("");
  const [credData, setCredData] = useState({});
  const [credentials, setCredentials] = useState<Credentials[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCredentials();
  }, []);

  const fetchAllCredentials = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/v1/credentials"
    );

    const data = response.data;

    if (!data.success) {
      // toast.error(data.message);
      console.log(data.error);
      setLoading(false);
      return;
    }
    // toast.success(data.message);
    setCredentials(
      (data.credentials as Credentials[])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
    );
    setLoading(false);
  };

  const handleCreateCredentials = async () => {
    const payload = {
      name: credName,
      application: selectedApp,
      data: credData,
    };
    // console.log(payload);

    const response = await axios.post(
      "http://localhost:3000/api/v1/credentials/create",
      payload
    );

    const data = response.data;

    if (!data.success) {
      toast.error(data.message);
      console.log(data.error);
      return;
    }

    toast.success(data.message);
  };

  const handleUpdateCredential = async (updated: Credentials) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/credentials/${updated.id}`,
        {
          name: updated.name,
          data: updated.data,
        }
      );
      const data = response.data;
      if (!data.success) {
        toast.error(data.message || "Update failed");
        return;
      }
      const saved: Credentials = data.credential;
      setCredentials((prev) =>
        prev
          .map((c) => (c.id === saved.id ? saved : c))
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
      );
      toast.success("Credential Updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteCredential = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/credentials/${id}`
      );
      const data = response.data;
      if (!data.success) {
        toast.error(data.message || "Delete failed");
        return;
      }
      setCredentials((prev) => prev.filter((c) => c.id !== id));
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };
  return (
    <div className="m-16 mx-auto max-w-7xl w-full">
      <div className="flex justify-between">
        <div className="">
          <div className="text-xl font-bold font-kode text-orange-500">
            Dashboard
          </div>
          <div className="font-inter">
            All the workflows, credentials and executions you have access to
          </div>
        </div>
        <div className="flex items-center gap-2 font-kode">
          <Button
            onClick={() => navigate("/workflows")}
            className="bg-orange-500"
          >
            Create Workflow
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 ">Create Credentials</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-kode font-bold text-orange-500">
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
                  <Input
                    placeholder="Credential Name"
                    value={credName}
                    onChange={(e) => setCredName(e.target.value)}
                  />
                  {selectedApp === "openai" && (
                    <OpenAICredentials onDataChange={setCredData} />
                  )}
                  {selectedApp === "telegram" && (
                    <TgCredentials onDataChange={setCredData} />
                  )}
                  {selectedApp === "whatsapp" && (
                    <WpCredentials onDataChange={setCredData} />
                  )}
                  {selectedApp === "resend" && (
                    <ResendCredential onDataChange={setCredData} />
                  )}
                  <Button
                    className="font-kode w-full bg-orange-500"
                    onClick={handleCreateCredentials}
                  >
                    Create Credential
                  </Button>
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
            {loading ? (
              <div className="h-[600px] w-full justify-center flex items-center">
                <Loader2 className="animate-spin text-orange-500" />
              </div>
            ) : (
              <CredentialsCards
                credentials={credentials}
                onSave={handleUpdateCredential}
                onDelete={handleDeleteCredential}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashBoardPage;
