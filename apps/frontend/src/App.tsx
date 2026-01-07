import { Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./components/landing";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import DashBoardPage from "./pages/dashboard-page";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import WorkflowPage from "./pages/workflow-page";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import axios from "axios";
import SettingsPage from "./pages/settings-page";

axios.defaults.withCredentials = true;

// Layout wrapper for pages with sidebar
function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Mobile header with sidebar trigger */}
        <header className="md:hidden flex items-center h-14 px-4 border-b bg-background sticky top-0 z-40">
          <SidebarTrigger className="mr-2" />
          <span className="font-kode font-bold text-orange-500">N10</span>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-center" theme="dark"/>
      <SidebarProvider>
        <Routes>
          <Route element={<Landing />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<SidebarLayout><DashBoardPage /></SidebarLayout>} path="/dashboard" />
          <Route element={<SidebarLayout><WorkflowPage /></SidebarLayout>} path="/workflows" />
          <Route element={<SidebarLayout><WorkflowPage /></SidebarLayout>} path="/workflows/:id" />
          <Route element={<SidebarLayout><SettingsPage /></SidebarLayout>} path="/analytics" />
        </Routes>
      </SidebarProvider>
      </ThemeProvider>
  );
}

export default App;
