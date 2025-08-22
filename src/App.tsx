import Header from '../components/Header'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-4xl md:text-6xl font-bold gradient-text">
            NAC Designer
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Network Access Control Architecture Designer
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-2xl font-semibold mb-4">Architecture Designer</h3>
            <p className="text-muted-foreground mb-6">
              Design and visualize your network access control architecture with interactive diagrams and policy management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-primary text-4xl mb-2">🏗️</div>
                <h4 className="font-semibold mb-2">Interactive Design</h4>
                <p className="text-sm text-muted-foreground">Build your NAC architecture with drag-and-drop components</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-primary text-4xl mb-2">🔐</div>
                <h4 className="font-semibold mb-2">Policy Management</h4>
                <p className="text-sm text-muted-foreground">Define and manage security policies with visual tools</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-primary text-4xl mb-2">📊</div>
                <h4 className="font-semibold mb-2">Real-time Simulation</h4>
                <p className="text-sm text-muted-foreground">Test your architecture with comprehensive simulations</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App