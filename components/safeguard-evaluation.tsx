"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Shield } from "lucide-react"
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
import { SafeguardForm } from "@/components/safeguard-form"
import type { Threat, Safeguard } from "@/app/analisis/page"

interface SafeguardEvaluationProps {
  threats: Threat[]
  safeguards: Safeguard[]
  setSafeguards: (safeguards: Safeguard[]) => void
}

export function SafeguardEvaluation({ threats, safeguards, setSafeguards }: SafeguardEvaluationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSafeguard, setEditingSafeguard] = useState<Safeguard | null>(null)

  const handleAddSafeguard = (safeguard: Omit<Safeguard, "id">) => {
    const newSafeguard = {
      ...safeguard,
      id: Date.now().toString(),
    }
    setSafeguards([...safeguards, newSafeguard])
    setIsDialogOpen(false)
  }

  const handleEditSafeguard = (safeguard: Omit<Safeguard, "id">) => {
    if (editingSafeguard) {
      setSafeguards(
        safeguards.map((s) => (s.id === editingSafeguard.id ? { ...safeguard, id: editingSafeguard.id } : s)),
      )
      setEditingSafeguard(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteSafeguard = (id: string) => {
    setSafeguards(safeguards.filter((s) => s.id !== id))
  }

  const openEditDialog = (safeguard: Safeguard) => {
    setEditingSafeguard(safeguard)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingSafeguard(null)
  }

  const getThreatName = (threatId: string) => {
    const threat = threats.find((t) => t.id === threatId)
    return threat ? `${threat.nombre} (${threat.assetName})` : "Amenaza desconocida"
  }

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      Preventiva: "bg-blue-500 hover:bg-blue-600",
      Detectiva: "bg-yellow-500 hover:bg-yellow-600",
      Correctiva: "bg-green-500 hover:bg-green-600",
    }
    return <Badge className={colors[tipo] || ""}>{tipo}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Evaluación de Salvaguardas</CardTitle>
            <CardDescription>Registra las medidas de seguridad implementadas o planificadas</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSafeguard(null)} disabled={threats.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Salvaguarda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSafeguard ? "Editar Salvaguarda" : "Nueva Salvaguarda"}</DialogTitle>
                <DialogDescription>
                  {editingSafeguard
                    ? "Modifica los datos de la salvaguarda."
                    : "Define una salvaguarda y evalúa su eficacia."}
                </DialogDescription>
              </DialogHeader>
              <SafeguardForm
                threats={threats}
                onSubmit={editingSafeguard ? handleEditSafeguard : handleAddSafeguard}
                onCancel={closeDialog}
                initialData={editingSafeguard || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {threats.length === 0 ? (
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Shield />
              </EmptyMedia>
              <EmptyTitle>No hay amenazas disponibles</EmptyTitle>
              <EmptyDescription>
                Primero debes identificar amenazas antes de definir salvaguardas para protegerte de ellas.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : safeguards.length === 0 ? (
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Shield />
              </EmptyMedia>
              <EmptyTitle>No hay salvaguardas registradas</EmptyTitle>
              <EmptyDescription>
                Comienza definiendo las medidas de seguridad para proteger tus activos de las amenazas.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Primera Salvaguarda
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salvaguarda</TableHead>
                <TableHead>Amenaza Protegida</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Eficacia</TableHead>
                <TableHead className="text-center">Madurez</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeguards.map((safeguard) => (
                <TableRow key={safeguard.id}>
                  <TableCell className="font-medium">{safeguard.nombre}</TableCell>
                  <TableCell className="max-w-xs truncate">{getThreatName(safeguard.threatId)}</TableCell>
                  <TableCell>{getTipoBadge(safeguard.tipo)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{safeguard.eficacia}%</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{safeguard.madurez}%</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(safeguard)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteSafeguard(safeguard.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
