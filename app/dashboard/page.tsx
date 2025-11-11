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
import Link from "next/link"
import { Button } from "@/components/ui/button"

type ThreatRow = {
  code: string
  name: string
  cells: {
    D: number
    I: number
    C: number
    A: number
    T: number
    RD: number
    RI: number
    RC: number
    RA: number
    RT: number
  }
}

type AssetGroup = {
  name: string
  threats: ThreatRow[]
}

type DashboardStats = {
  totalAssets: number
  totalThreats: number
  averageImpact: number
  averageRisk: number
  criticalRisks: number
  highRisks: number
  mediumRisks: number
  lowRisks: number
}

export default function DashboardPage() {
  const [matrixData, setMatrixData] = useState<AssetGroup[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    totalThreats: 0,
    averageImpact: 0,
    averageRisk: 0,
    criticalRisks: 0,
    highRisks: 0,
    mediumRisks: 0,
    lowRisks: 0,
  })

  useEffect(() => {
    const stored = localStorage.getItem("magerit-matrix")
    if (stored) {
      const data: AssetGroup[] = JSON.parse(stored)
      setMatrixData(data)

      // Calculate statistics
      let totalThreatsWithValues = 0
      let totalImpact = 0
      let totalRisk = 0
      let critical = 0
      let high = 0
      let medium = 0
      let low = 0

      data.forEach((assetGroup) => {
        assetGroup.threats.forEach((threat) => {
          const avgImpact = (threat.cells.D + threat.cells.I + threat.cells.C + threat.cells.A + threat.cells.T) / 5
          const riskDimensionsSum =
            threat.cells.RD + threat.cells.RI + threat.cells.RC + threat.cells.RA + threat.cells.RT
          const avgRisk = riskDimensionsSum > 0 ? riskDimensionsSum / 5 : avgImpact // Use impact as fallback

          if (avgImpact > 0) {
            totalThreatsWithValues++
            totalImpact += avgImpact
            totalRisk += avgRisk

            if (avgImpact >= 8) critical++
            else if (avgImpact >= 6) high++
            else if (avgImpact >= 4) medium++
            else if (avgImpact > 0) low++
          }
        })
      })

      setStats({
        totalAssets: data.length,
        totalThreats: totalThreatsWithValues,
        averageImpact: totalThreatsWithValues > 0 ? totalImpact / totalThreatsWithValues : 0,
        averageRisk: totalThreatsWithValues > 0 ? totalRisk / totalThreatsWithValues : 0,
        criticalRisks: critical,
        highRisks: high,
        mediumRisks: medium,
        lowRisks: low,
      })
    }
  }, [])

  const dimensionData =
    matrixData.length > 0
      ? (() => {
          const totals = { D: 0, I: 0, C: 0, A: 0, T: 0, count: 0 }

          matrixData.forEach((assetGroup) => {
            assetGroup.threats.forEach((threat) => {
              if (threat.cells.D + threat.cells.I + threat.cells.C + threat.cells.A + threat.cells.T > 0) {
                totals.D += threat.cells.D
                totals.I += threat.cells.I
                totals.C += threat.cells.C
                totals.A += threat.cells.A
                totals.T += threat.cells.T
                totals.count++
              }
            })
          })

          return [
            { dimension: "Disponibilidad", promedio: totals.count > 0 ? (totals.D / totals.count).toFixed(1) : "0" },
            { dimension: "Integridad", promedio: totals.count > 0 ? (totals.I / totals.count).toFixed(1) : "0" },
            { dimension: "Confidencialidad", promedio: totals.count > 0 ? (totals.C / totals.count).toFixed(1) : "0" },
            { dimension: "Autenticidad", promedio: totals.count > 0 ? (totals.A / totals.count).toFixed(1) : "0" },
            { dimension: "Trazabilidad", promedio: totals.count > 0 ? (totals.T / totals.count).toFixed(1) : "0" },
          ]
        })()
      : []

  const radarData = dimensionData.map((d) => ({
    dimension: d.dimension.charAt(0),
    value: Number(d.promedio),
  }))

  const assetTypeData = matrixData
    .map((assetGroup) => {
      const threatsWithValues = assetGroup.threats.filter((t) => {
        const total =
          t.cells.D +
          t.cells.I +
          t.cells.C +
          t.cells.A +
          t.cells.T +
          t.cells.RD +
          t.cells.RI +
          t.cells.RC +
          t.cells.RA +
          t.cells.RT
        return total > 0
      }).length

      return {
        name: assetGroup.name,
        value: threatsWithValues,
      }
    })
    .filter((item) => item.value > 0)

  const topCritical = (() => {
    const items: Array<{ assetType: string; threatName: string; avgImpact: number }> = []

    matrixData.forEach((assetGroup) => {
      assetGroup.threats.forEach((threat) => {
        const avgImpact = (threat.cells.D + threat.cells.I + threat.cells.C + threat.cells.A + threat.cells.T) / 5
        if (avgImpact > 0) {
          items.push({
            assetType: assetGroup.name,
            threatName: threat.name,
            avgImpact,
          })
        }
      })
    })

    return items.sort((a, b) => b.avgImpact - a.avgImpact).slice(0, 5)
  })()

  const COLORS = [
    "oklch(0.6 0.2 250)",
    "oklch(0.7 0.15 180)",
    "oklch(0.65 0.18 140)",
    "oklch(0.68 0.16 90)",
    "oklch(0.72 0.14 60)",
  ]

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

          {stats.totalThreats === 0 ? (
            <Card>
              <CardContent className="py-12">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Activity />
                    </EmptyMedia>
                    <EmptyTitle>No hay datos disponibles</EmptyTitle>
                    <EmptyDescription>
                      Comienza clasificando activos y amenazas en la matriz para ver las estadísticas y visualizaciones
                      del dashboard.
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
                    <CardTitle className="text-sm font-medium">Tipos de Activos</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAssets}</div>
                    <p className="text-xs text-muted-foreground">Categorías MAGERIT</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Amenazas Valoradas</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalThreats}</div>
                    <p className="text-xs text-muted-foreground">Con valores asignados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Impacto Promedio</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageImpact.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Valoración D-I-C-A-T</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Riesgo Promedio</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageRisk.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Riesgo residual</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Asset Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amenazas por Tipo de Activo</CardTitle>
                    <CardDescription>Distribución de amenazas valoradas por categoría</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={assetTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name.split(" ")[0]}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {assetTypeData.map((_entry, index) => (
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

              {/* Radar Chart and Top Critical */}
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

                {/* Top Critical Threats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amenazas Más Críticas</CardTitle>
                    <CardDescription>Top 5 combinaciones activo-amenaza con mayor riesgo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCritical.map((item, index) => {
                        const percentage = (item.avgImpact / 10) * 100
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{item.threatName}</p>
                                <p className="text-xs text-muted-foreground">{item.assetType}</p>
                              </div>
                              <Badge
                                variant={
                                  item.avgImpact >= 8 ? "destructive" : item.avgImpact >= 6 ? "default" : "outline"
                                }
                              >
                                {item.avgImpact.toFixed(1)}
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
                        Gestionar Matriz
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/analisis">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Ver Análisis Detallado
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
