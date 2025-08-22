import { Shield } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Portnox NAC Designer</h1>
              <p className="text-sm text-muted-foreground">Zero Trust Network Access Control</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}