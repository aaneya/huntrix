import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddRecordPage from "./pages/AddRecordPage";
import ViewRecordsPage from "./pages/ViewRecordsPage";
import VerifyRecordsPage from "./pages/VerifyRecordsPage";
import DocumentUploadPage from "./pages/DocumentUploadPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import SecurityPage from "./pages/SecurityPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CompliancePage from "./pages/CompliancePage";
import OAuthDemoPage from "./pages/OAuthDemoPage";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={LoginPage} />
      <Route path={"/dashboard"} component={DashboardPage} />
      <Route path={"/add-record"} component={AddRecordPage} />
      <Route path={"/view-records"} component={ViewRecordsPage} />
      <Route path={"/verify-records"} component={VerifyRecordsPage} />
      <Route path={"/upload-document"} component={DocumentUploadPage} />
      <Route path={"/features"} component={FeaturesPage} />
      <Route path={"/pricing"} component={PricingPage} />
      <Route path={"/security"} component={SecurityPage} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/blog"} component={BlogPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/privacy"} component={PrivacyPage} />
      <Route path={"/terms"} component={TermsPage} />
      <Route path={"/compliance"} component={CompliancePage} />
      <Route path={"/oauth-demo"} component={OAuthDemoPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
