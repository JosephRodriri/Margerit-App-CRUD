"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AlertTriangle, Calculator, Package } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

type ThreatAnalysis = {
  assetType: string
  threatCode: string
  threatName: string
  impactoIntrinseco: number
  riesgoResidual: number
  criticidad: "Crítico" | "Alto" | "Medio" | "Bajo"
}

export default function AnalisisPage() {
  const [matrixData, setMatrixData] = useState<AssetGroup[]>([])
  const [analysis, setAnalysis] = useState<ThreatAnalysis[]>([])
  const [stats, setStats] = useState({
    totalThreats: 0,
    criticalThreats: 0,
    highThreats: 0,
    mediumThreats: 0,
    lowThreats: 0,
  })

  useEffect(() => {
    const stored = localStorage.getItem("magerit-matrix")
    if (stored) {
      const data: AssetGroup[] = JSON.parse(stored)
      setMatrixData(data)

      // Calculate threat analysis
      const analysisResults: ThreatAnalysis[] = []

      data.forEach((assetGroup) => {
        assetGroup.threats.forEach((threat) => {
          // Calculate average intrinsic impact (D, I, C, A, T)
          const impactoIntrinseco =
            (threat.cells.D + threat.cells.I + threat.cells.C + threat.cells.A + threat.cells.T) / 5

          // Calculate average residual risk (RD, RI, RC, RA, RT)
          const riskDimensionsSum =
            threat.cells.RD + threat.cells.RI + threat.cells.RC + threat.cells.RA + threat.cells.RT
          const riesgoResidual = riskDimensionsSum > 0 ? riskDimensionsSum / 5 : impactoIntrinseco // Use intrinsic impact as fallback

          if (impactoIntrinseco > 0) {
            let criticidad: "Crítico" | "Alto" | "Medio" | "Bajo"
            if (impactoIntrinseco >= 8) criticidad = "Crítico"
            else if (impactoIntrinseco >= 6) criticidad = "Alto"
            else if (impactoIntrinseco >= 4) criticidad = "Medio"
            else criticidad = "Bajo"

            analysisResults.push({
              assetType: assetGroup.name,
              threatCode: threat.code,
              threatName: threat.name,
              impactoIntrinseco,
              riesgoResidual,
              criticidad,
            })
          }
        })
      })

      // Sort by intrinsic impact (highest first)
      analysisResults.sort((a, b) => b.impactoIntrinseco - a.impactoIntrinseco)
      setAnalysis(analysisResults)

      // Calculate stats
      setStats({
        totalThreats: analysisResults.length,
        criticalThreats: analysisResults.filter((a) => a.criticidad === "Crítico").length,
        highThreats: analysisResults.filter((a) => a.criticidad === "Alto").length,
        mediumThreats: analysisResults.filter((a) => a.criticidad === "Medio").length,
        lowThreats: analysisResults.filter((a) => a.criticidad === "Bajo").length,
      })
    }
  }, [])

  const getBadgeVariant = (criticidad: string) => {
    switch (criticidad) {
      case "Crítico":
        return "destructive"
      case "Alto":
        return "default"
      case "Medio":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Análisis de Amenazas y Riesgos</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty">
              Análisis automático de amenazas basado en la clasificación de la matriz MAGERIT.
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="mb-8">
            <Calculator className="h-4 w-4" />
            <AlertTitle>Cálculo de Riesgos MAGERIT</AlertTitle>
            <AlertDescription>
              El análisis se genera automáticamente desde la matriz de clasificación. El{" "}
              <strong>Impacto Intrínseco</strong> es el promedio de las dimensiones D-I-C-A-T, y se usa para{" "}
              <strong>clasificar la criticidad</strong>. El <strong>Riesgo Residual</strong> muestra el efecto de las
              salvaguardas (RD-RI-RC-RA-RT).
            </AlertDescription>
          </Alert>

          {analysis.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <AlertTriangle />
                    </EmptyMedia>
                    <EmptyTitle>No hay amenazas clasificadas</EmptyTitle>
                    <EmptyDescription>
                      Comienza clasificando activos y amenazas en la matriz para ver el análisis de riesgos.
                    </EmptyDescription>
                  </EmptyHeader>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/clasificacion">
                        <Package className="mr-2 h-4 w-4" />
                        Ir a Clasificación
                      </Link>
                    </Button>
                  </div>
                </Empty>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-5 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Amenazas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalThreats}</div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Críticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">{stats.criticalThreats}</div>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Altas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{stats.highThreats}</div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-500/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Medias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-500">{stats.mediumThreats}</div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Bajas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{stats.lowThreats}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Analysis Table */}
              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">Todas ({stats.totalThreats})</TabsTrigger>
                  <TabsTrigger value="critico">Críticas ({stats.criticalThreats})</TabsTrigger>
                  <TabsTrigger value="alto">Altas ({stats.highThreats})</TabsTrigger>
                  <TabsTrigger value="medio">Medias ({stats.mediumThreats})</TabsTrigger>
                  <TabsTrigger value="bajo">Bajas ({stats.lowThreats})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardHeader>
                      <CardTitle>Todas las Amenazas Identificadas</CardTitle>
                      <CardDescription>Lista completa de amenazas ordenadas por riesgo residual</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo de Activo</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Amenaza</TableHead>
                            <TableHead className="text-center">Impacto Intrínseco</TableHead>
                            <TableHead className="text-center">Riesgo Residual</TableHead>
                            <TableHead className="text-center">Criticidad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analysis.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.assetType}</TableCell>
                              <TableCell className="font-mono text-xs">{item.threatCode}</TableCell>
                              <TableCell>{item.threatName}</TableCell>
                              <TableCell className="text-center font-semibold">
                                {item.impactoIntrinseco.toFixed(1)}
                              </TableCell>
                              <TableCell className="text-center font-semibold">
                                {item.riesgoResidual.toFixed(1)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant={getBadgeVariant(item.criticidad)}>{item.criticidad}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {["critico", "alto", "medio", "bajo"].map((level) => (
                  <TabsContent key={level} value={level}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Amenazas de Nivel {level.charAt(0).toUpperCase() + level.slice(1)}</CardTitle>
                        <CardDescription>Amenazas clasificadas como {level}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tipo de Activo</TableHead>
                              <TableHead>Código</TableHead>
                              <TableHead>Amenaza</TableHead>
                              <TableHead className="text-center">Impacto Intrínseco</TableHead>
                              <TableHead className="text-center">Riesgo Residual</TableHead>
                              <TableHead className="text-center">Criticidad</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {analysis
                              .filter(
                                (item) =>
                                  item.criticidad.toLowerCase() === level.charAt(0).toUpperCase() + level.slice(1),
                              )
                              .map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{item.assetType}</TableCell>
                                  <TableCell className="font-mono text-xs">{item.threatCode}</TableCell>
                                  <TableCell>{item.threatName}</TableCell>
                                  <TableCell className="text-center font-semibold">
                                    {item.impactoIntrinseco.toFixed(1)}
                                  </TableCell>
                                  <TableCell className="text-center font-semibold">
                                    {item.riesgoResidual.toFixed(1)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant={getBadgeVariant(item.criticidad)}>{item.criticidad}</Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
