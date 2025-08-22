import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold gradient-text">
                  NAC Designer
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Network Access Control Architecture Designer
                </p>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </div>
  )
}

export default App