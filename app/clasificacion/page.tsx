"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Info, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MageritMatrix } from "@/components/magerit-matrix"

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
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Matriz de Clasificación MAGERIT</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty">
              Valora cada combinación de activo y amenaza según las dimensiones de seguridad y riesgo de MAGERIT.
            </p>
          </div>

          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Instrucciones de Uso</AlertTitle>
            <AlertDescription>
              Introduce valores del 0 al 10 en cada celda para valorar el impacto de cada amenaza sobre las dimensiones
              de seguridad (D-I-C-A-T) y las dimensiones de riesgo (RD-RI-RC-RA-RT). Los colores indican el nivel de
              criticidad: verde (bajo), amarillo (medio), naranja (alto), rojo (crítico).
            </AlertDescription>
          </Alert>

          <MageritMatrix />
        </div>
      </main>
    </div>
  )
}
