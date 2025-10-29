"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Package, Plus, Trash2, Edit, Info } from "lucide-react"
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
import { AssetForm } from "@/components/asset-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Asset = {
  id: string
  nombre: string
  tipo: string
  descripcion: string
  disponibilidad: number
  integridad: number
  confidencialidad: number
  autenticidad: number
  trazabilidad: number
}

export default function ClasificacionPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)

  useEffect(() => {
    const storedAssets = localStorage.getItem("magerit-assets")
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets))
    }
  }, [])

  useEffect(() => {
    if (assets.length > 0) {
      localStorage.setItem("magerit-assets", JSON.stringify(assets))
    }
  }, [assets])

  const handleAddAsset = (asset: Omit<Asset, "id">) => {
    const newAsset = {
      ...asset,
      id: Date.now().toString(),
    }
    setAssets([...assets, newAsset])
    setIsDialogOpen(false)
  }

  const handleEditAsset = (asset: Omit<Asset, "id">) => {
    if (editingAsset) {
      setAssets(assets.map((a) => (a.id === editingAsset.id ? { ...asset, id: editingAsset.id } : a)))
      setEditingAsset(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id))
  }

  const openEditDialog = (asset: Asset) => {
    setEditingAsset(asset)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingAsset(null)
  }

  const getValorPromedio = (asset: Asset) => {
    return (
      (asset.disponibilidad + asset.integridad + asset.confidencialidad + asset.autenticidad + asset.trazabilidad) /
      5
    ).toFixed(1)
  }

  const getValorColor = (valor: number) => {
    if (valor >= 8) return "text-red-500"
    if (valor >= 6) return "text-orange-500"
    if (valor >= 4) return "text-yellow-500"
    return "text-green-500"
  }

  const getDimensionBadge = (valor: number) => {
    if (valor >= 8) return <Badge variant="destructive">{valor}</Badge>
    if (valor >= 6) return <Badge className="bg-orange-500 hover:bg-orange-600">{valor}</Badge>
    if (valor >= 4) return <Badge className="bg-yellow-500 hover:bg-yellow-600">{valor}</Badge>
    return <Badge className="bg-green-500 hover:bg-green-600">{valor}</Badge>
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Clasificación de Activos</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty">
              Identifica y valora los activos de información de tu organización según las dimensiones de seguridad
              MAGERIT.
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Valoración de Activos</AlertTitle>
            <AlertDescription>
              Cada activo se valora en una escala de 0-10 para cada dimensión de seguridad (D-I-C-A-T). Esta valoración
              determina el impacto potencial de las amenazas sobre el activo.
            </AlertDescription>
          </Alert>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventario de Activos</CardTitle>
                  <CardDescription>Gestiona los activos de información de tu sistema</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingAsset(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir Activo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingAsset ? "Editar Activo" : "Nuevo Activo"}</DialogTitle>
                      <DialogDescription>
                        {editingAsset
                          ? "Modifica los datos del activo y su valoración."
                          : "Completa la información del activo y valora cada dimensión de seguridad."}
                      </DialogDescription>
                    </DialogHeader>
                    <AssetForm
                      onSubmit={editingAsset ? handleEditAsset : handleAddAsset}
                      onCancel={closeDialog}
                      initialData={editingAsset || undefined}
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
                      <Package />
                    </EmptyMedia>
                    <EmptyTitle>No hay activos registrados</EmptyTitle>
                    <EmptyDescription>
                      Comienza añadiendo tu primer activo para iniciar el análisis de riesgos.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir Primer Activo
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <Tabs defaultValue="tabla" className="w-full">
                  <TabsList>
                    <TabsTrigger value="tabla">Vista de Tabla</TabsTrigger>
                    <TabsTrigger value="tarjetas">Vista de Tarjetas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tabla" className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-center">D</TableHead>
                          <TableHead className="text-center">I</TableHead>
                          <TableHead className="text-center">C</TableHead>
                          <TableHead className="text-center">A</TableHead>
                          <TableHead className="text-center">T</TableHead>
                          <TableHead className="text-center">Promedio</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell className="font-medium">{asset.nombre}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{asset.tipo}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{getDimensionBadge(asset.disponibilidad)}</TableCell>
                            <TableCell className="text-center">{getDimensionBadge(asset.integridad)}</TableCell>
                            <TableCell className="text-center">{getDimensionBadge(asset.confidencialidad)}</TableCell>
                            <TableCell className="text-center">{getDimensionBadge(asset.autenticidad)}</TableCell>
                            <TableCell className="text-center">{getDimensionBadge(asset.trazabilidad)}</TableCell>
                            <TableCell className="text-center">
                              <span className={`font-semibold ${getValorColor(Number(getValorPromedio(asset)))}`}>
                                {getValorPromedio(asset)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(asset)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteAsset(asset.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="tarjetas" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {assets.map((asset) => (
                        <Card key={asset.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{asset.nombre}</CardTitle>
                                <Badge variant="outline">{asset.tipo}</Badge>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(asset)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteAsset(asset.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">{asset.descripcion}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Disponibilidad:</span>
                                {getDimensionBadge(asset.disponibilidad)}
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Integridad:</span>
                                {getDimensionBadge(asset.integridad)}
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Confidencialidad:</span>
                                {getDimensionBadge(asset.confidencialidad)}
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Autenticidad:</span>
                                {getDimensionBadge(asset.autenticidad)}
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Trazabilidad:</span>
                                {getDimensionBadge(asset.trazabilidad)}
                              </div>
                              <div className="flex items-center justify-between border-t pt-2 font-semibold">
                                <span>Valor Promedio:</span>
                                <span className={getValorColor(Number(getValorPromedio(asset)))}>
                                  {getValorPromedio(asset)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          {assets.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Leyenda de Dimensiones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 hover:bg-green-600">D</Badge>
                      <span className="text-sm font-medium">Disponibilidad</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Acceso cuando se necesita</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 hover:bg-green-600">I</Badge>
                      <span className="text-sm font-medium">Integridad</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Datos sin alteraciones</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 hover:bg-green-600">C</Badge>
                      <span className="text-sm font-medium">Confidencialidad</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Acceso solo autorizado</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 hover:bg-green-600">A</Badge>
                      <span className="text-sm font-medium">Autenticidad</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Identidad verificada</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 hover:bg-green-600">T</Badge>
                      <span className="text-sm font-medium">Trazabilidad</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Registro de acciones</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="font-medium">Escala de valoración:</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 hover:bg-green-600">0-3</Badge>
                    <span className="text-muted-foreground">Bajo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">4-5</Badge>
                    <span className="text-muted-foreground">Medio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500 hover:bg-orange-600">6-7</Badge>
                    <span className="text-muted-foreground">Alto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">8-10</Badge>
                    <span className="text-muted-foreground">Crítico</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
