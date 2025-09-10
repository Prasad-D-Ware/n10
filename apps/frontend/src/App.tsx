import { Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./components/landing";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import DashBoardPage from "./pages/dashboard-page";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import WorkflowPage from "./pages/workflow-page";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster/>
      <SidebarProvider>
        <Routes>
          <Route element={<Landing />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<><AppSidebar/><DashBoardPage /></>} path="/dashboard" />
          <Route element={<><AppSidebar/><WorkflowPage /></>} path="/workflows" />
        </Routes>
      </SidebarProvider>
      </ThemeProvider>
  );
}

export default App;
