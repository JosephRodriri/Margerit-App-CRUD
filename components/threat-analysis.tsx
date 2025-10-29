"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ThreatForm } from "@/components/threat-form"
import type { Threat } from "@/app/analisis/page"
import type { Asset } from "@/app/clasificacion/page"

interface ThreatAnalysisProps {
  threats: Threat[]
  setThreats: (threats: Threat[]) => void
}

export function ThreatAnalysis({ threats, setThreats }: ThreatAnalysisProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingThreat, setEditingThreat] = useState<Threat | null>(null)

  useEffect(() => {
    // Load assets from localStorage
    const storedAssets = localStorage.getItem("magerit-assets")
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets))
    }
  }, [])

  const handleAddThreat = (threat: Omit<Threat, "id">) => {
    const newThreat = {
      ...threat,
      id: Date.now().toString(),
    }
    setThreats([...threats, newThreat])
    setIsDialogOpen(false)
  }

  const handleEditThreat = (threat: Omit<Threat, "id">) => {
    if (editingThreat) {
      setThreats(threats.map((t) => (t.id === editingThreat.id ? { ...threat, id: editingThreat.id } : t)))
      setEditingThreat(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteThreat = (id: string) => {
    setThreats(threats.filter((t) => t.id !== id))
  }

  const openEditDialog = (threat: Threat) => {
    setEditingThreat(threat)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingThreat(null)
  }

  const getFrecuenciaColor = (frecuencia: number) => {
    if (frecuencia >= 75) return "text-red-500"
    if (frecuencia >= 50) return "text-orange-500"
    if (frecuencia >= 25) return "text-yellow-500"
    return "text-green-500"
  }

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      "Desastres Naturales": "bg-purple-500 hover:bg-purple-600",
      "Origen Industrial": "bg-orange-500 hover:bg-orange-600",
      "Errores y Fallos": "bg-yellow-500 hover:bg-yellow-600",
      "Ataques Intencionados": "bg-red-500 hover:bg-red-600",
    }
    return <Badge className={colors[tipo] || ""}>{tipo}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Identificación de Amenazas</CardTitle>
            <CardDescription>Registra las amenazas que pueden afectar a tus activos</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingThreat(null)} disabled={assets.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Amenaza
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingThreat ? "Editar Amenaza" : "Nueva Amenaza"}</DialogTitle>
                <DialogDescription>
                  {editingThreat
                    ? "Modifica los datos de la amenaza."
                    : "Identifica una amenaza y evalúa su frecuencia y degradación."}
                </DialogDescription>
              </DialogHeader>
              <ThreatForm
                assets={assets}
                onSubmit={editingThreat ? handleEditThreat : handleAddThreat}
                onCancel={closeDialog}
                initialData={editingThreat || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertTriangle />
              </EmptyMedia>
              <EmptyTitle>No hay activos disponibles</EmptyTitle>
              <EmptyDescription>
                Primero debes clasificar activos en la sección de Clasificación antes de identificar amenazas.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : threats.length === 0 ? (
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertTriangle />
              </EmptyMedia>
              <EmptyTitle>No hay amenazas registradas</EmptyTitle>
              <EmptyDescription>Comienza identificando las amenazas que pueden afectar a tus activos.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Primera Amenaza
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amenaza</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Frecuencia</TableHead>
                <TableHead className="text-center">Degradación Máx.</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threats.map((threat) => {
                const maxDegradacion = Math.max(
                  threat.degradacionD,
                  threat.degradacionI,
                  threat.degradacionC,
                  threat.degradacionA,
                  threat.degradacionT,
                )
                return (
                  <TableRow key={threat.id}>
                    <TableCell className="font-medium">{threat.nombre}</TableCell>
                    <TableCell>{threat.assetName}</TableCell>
                    <TableCell>{getTipoBadge(threat.tipo)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-semibold ${getFrecuenciaColor(threat.frecuencia)}`}>
                        {threat.frecuencia}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-semibold ${getFrecuenciaColor(maxDegradacion)}`}>{maxDegradacion}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(threat)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteThreat(threat.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
