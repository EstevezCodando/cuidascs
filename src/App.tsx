import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { Header } from "@/components/Header";
import MapPage from "@/pages/MapPage";
import HotspotsPage from "@/pages/HotspotsPage";
import RoteirosPage from "@/pages/RoteirosPage";
import CooperativasPage from "@/pages/CooperativasPage";
import DashboardPage from "@/pages/DashboardPage";
import SobrePage from "@/pages/SobrePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/" element={<MapPage />} />
                  <Route path="/hotspots" element={<HotspotsPage />} />
                  <Route path="/roteiros" element={<RoteirosPage />} />
                  <Route path="/cooperativas" element={<CooperativasPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/sobre" element={<SobrePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
