import { Toaster } from "@/components/ui/toaster";
import { Route, Switch } from "wouter";
import HomeGitHub from "@/pages/Home.github";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeGitHub} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="app">
      <Router />
      <Toaster />
    </div>
  );
}

export default App;