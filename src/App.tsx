import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import Extract from "@/pages/Extract";
import Convert from "@/pages/Convert";
import Edit from "@/pages/Edit";
import Embed from "@/pages/Embed";

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 pt-16">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/extract" component={Extract} />
            <Route path="/convert" component={Convert} />
            <Route path="/edit" component={Edit} />
            <Route path="/embed" component={Embed} />
            {/* Fallback */}
            <Route>
               <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
                 404 - Page Not Found
               </div>
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
