"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { BarChart3, Package, AlertTriangle, Shield, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { Asset } from "@/app/clasificacion/page"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type DashboardStats = {
  totalAssets: number
  totalThreats: number
  totalSafeguards: number
  averageRisk: number
  criticalRisks: number
  highRisks: number
  mediumRisks: number
  lowRisks: number
}

export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    totalThreats: 0,
    totalSafeguards: 0,
    averageRisk: 0,
    criticalRisks: 0,
    highRisks: 0,
    mediumRisks: 0,
    lowRisks: 0,
  })

  useEffect(() => {
    const storedAssets = localStorage.getItem("magerit-assets")
    if (storedAssets) {
      const parsedAssets = JSON.parse(storedAssets)
      setAssets(parsedAssets)

      // Calculate stats
      setStats({
        totalAssets: parsedAssets.length,
        totalThreats: 0,
        totalSafeguards: 0,
        averageRisk: 0,
        criticalRisks: 0,
        highRisks: 0,
        mediumRisks: 0,
        lowRisks: 0,
      })
    }
  }, [])

  const assetsByType = assets.reduce(
    (acc, asset) => {
      acc[asset.tipo] = (acc[asset.tipo] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const assetTypeData = Object.entries(assetsByType).map(([name, value]) => ({
    name,
    value,
  }))

  const dimensionData =
    assets.length > 0
      ? [
          {
            dimension: "Disponibilidad",
            promedio: (assets.reduce((acc, a) => acc + a.disponibilidad, 0) / assets.length).toFixed(1),
          },
          {
            dimension: "Integridad",
            promedio: (assets.reduce((acc, a) => acc + a.integridad, 0) / assets.length).toFixed(1),
          },
          {
            dimension: "Confidencialidad",
            promedio: (assets.reduce((acc, a) => acc + a.confidencialidad, 0) / assets.length).toFixed(1),
          },
          {
            dimension: "Autenticidad",
            promedio: (assets.reduce((acc, a) => acc + a.autenticidad, 0) / assets.length).toFixed(1),
          },
          {
            dimension: "Trazabilidad",
            promedio: (assets.reduce((acc, a) => acc + a.trazabilidad, 0) / assets.length).toFixed(1),
          },
        ]
      : []

  const radarData = dimensionData.map((d) => ({
    dimension: d.dimension.charAt(0),
    value: Number(d.promedio),
  }))

  const COLORS = [
    "oklch(0.6 0.2 250)",
    "oklch(0.7 0.15 180)",
    "oklch(0.65 0.18 140)",
    "oklch(0.68 0.16 90)",
    "oklch(0.72 0.14 60)",
  ]

  const topAssets = [...assets]
    .sort((a, b) => {
      const avgA = (a.disponibilidad + a.integridad + a.confidencialidad + a.autenticidad + a.trazabilidad) / 5
      const avgB = (b.disponibilidad + b.integridad + b.confidencialidad + b.autenticidad + b.trazabilidad) / 5
      return avgB - avgA
    })
    .slice(0, 5)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Dashboard de Riesgos</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty">
              Visualización general del estado de seguridad y análisis de riesgos de tu organización.
            </p>
          </div>

          {assets.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Activity />
                    </EmptyMedia>
                    <EmptyTitle>No hay datos disponibles</EmptyTitle>
                    <EmptyDescription>
                      Comienza clasificando activos para ver las estadísticas y visualizaciones del dashboard.
                    </EmptyDescription>
                  </EmptyHeader>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/clasificacion">
                        <Package className="mr-2 h-4 w-4" />
                        Clasificar Activos
                      </Link>
                    </Button>
                  </div>
                </Empty>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Activos</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAssets}</div>
                    <p className="text-xs text-muted-foreground">Activos clasificados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Amenazas</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalThreats}</div>
                    <p className="text-xs text-muted-foreground">Amenazas identificadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Salvaguardas</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSafeguards}</div>
                    <p className="text-xs text-muted-foreground">Medidas implementadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Riesgo Promedio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageRisk.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Nivel de riesgo general</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Asset Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Activos por Tipo</CardTitle>
                    <CardDescription>Clasificación de activos según categorías MAGERIT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={assetTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {assetTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Dimension Averages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Valoración Promedio por Dimensión</CardTitle>
                    <CardDescription>Análisis de las dimensiones de seguridad D-I-C-A-T</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dimensionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dimension" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="promedio" fill="oklch(0.6 0.2 250)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Radar Chart and Top Assets */}
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Radar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Perfil de Seguridad</CardTitle>
                    <CardDescription>Vista radial de las dimensiones de seguridad</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" />
                        <PolarRadiusAxis domain={[0, 10]} />
                        <Radar
                          name="Valoración"
                          dataKey="value"
                          stroke="oklch(0.6 0.2 250)"
                          fill="oklch(0.6 0.2 250)"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Critical Assets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activos Más Críticos</CardTitle>
                    <CardDescription>Top 5 activos con mayor valoración promedio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topAssets.map((asset) => {
                        const avg =
                          (asset.disponibilidad +
                            asset.integridad +
                            asset.confidencialidad +
                            asset.autenticidad +
                            asset.trazabilidad) /
                          5
                        const percentage = (avg / 10) * 100
                        return (
                          <div key={asset.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{asset.nombre}</p>
                                <p className="text-xs text-muted-foreground">{asset.tipo}</p>
                              </div>
                              <Badge variant={avg >= 8 ? "destructive" : avg >= 6 ? "default" : "outline"}>
                                {avg.toFixed(1)}
                              </Badge>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Riesgos</CardTitle>
                  <CardDescription>Clasificación de riesgos por nivel de criticidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Crítico</span>
                        <Badge variant="destructive">{stats.criticalRisks}</Badge>
                      </div>
                      <Progress
                        value={(stats.criticalRisks / Math.max(stats.totalThreats, 1)) * 100}
                        className="h-2 [&>div]:bg-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Alto</span>
                        <Badge className="bg-orange-500 hover:bg-orange-600">{stats.highRisks}</Badge>
                      </div>
                      <Progress
                        value={(stats.highRisks / Math.max(stats.totalThreats, 1)) * 100}
                        className="h-2 [&>div]:bg-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Medio</span>
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">{stats.mediumRisks}</Badge>
                      </div>
                      <Progress
                        value={(stats.mediumRisks / Math.max(stats.totalThreats, 1)) * 100}
                        className="h-2 [&>div]:bg-yellow-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bajo</span>
                        <Badge className="bg-green-500 hover:bg-green-600">{stats.lowRisks}</Badge>
                      </div>
                      <Progress
                        value={(stats.lowRisks / Math.max(stats.totalThreats, 1)) * 100}
                        className="h-2 [&>div]:bg-green-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Continúa con el análisis de riesgos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                      <Link href="/clasificacion">
                        <Package className="mr-2 h-4 w-4" />
                        Gestionar Activos
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/analisis">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Analizar Amenazas
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/metodologia">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Ver Metodología
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
