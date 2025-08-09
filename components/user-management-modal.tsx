"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

type Role = "Viewer" | "Editor" | "Admin"
type User = { id: string; name: string; email: string; role: Role }

export default function UserManagementModal({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("Viewer")

  useEffect(() => {
    const saved = localStorage.getItem("portnox-users")
    if (saved) setUsers(JSON.parse(saved))
  }, [])
  useEffect(() => {
    localStorage.setItem("portnox-users", JSON.stringify(users))
  }, [users])

  const add = () => {
    if (!name || !email) return
    setUsers((arr) => [...arr, { id: crypto.randomUUID(), name, email, role }])
    setName("")
    setEmail("")
    setRole("Viewer")
  }

  const remove = (id: string) => setUsers((arr) => arr.filter((u) => u.id !== id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {["Viewer", "Editor", "Admin"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={add}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <Badge variant={u.role === "Admin" ? "default" : u.role === "Editor" ? "secondary" : "outline"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-2 text-right">
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => remove(u.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-neutral-500">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
