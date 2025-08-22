import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { Toaster } from "@/components/ui/toaster"
import Layout from "./components/layout"
import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import ArchitecturePage from "./pages/architecture"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="portnox-theme">
      <SessionProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="architecture" element={<ArchitecturePage />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default App