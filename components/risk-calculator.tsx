"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { TrendingUp, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Threat, Safeguard } from "@/app/analisis/page"
import type { Asset } from "@/app/clasificacion/page"

interface RiskCalculatorProps {
  threats: Threat[]
  safeguards: Safeguard[]
}

type RiskCalculation = {
  threatId: string
  threatName: string
  assetName: string
  dimension: string
  valorActivo: number
  degradacion: number
  frecuencia: number
  impacto: number
  riesgoIntrinseco: number
  eficaciaSalvaguardas: number
  riesgoResidual: number
}

export function RiskCalculator({ threats, safeguards }: RiskCalculatorProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [calculations, setCalculations] = useState<RiskCalculation[]>([])

  useEffect(() => {
    const storedAssets = localStorage.getItem("magerit-assets")
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets))
    }
  }, [])

  useEffect(() => {
    if (assets.length === 0 || threats.length === 0) {
      setCalculations([])
      return
    }

    const newCalculations: RiskCalculation[] = []

    threats.forEach((threat) => {
      const asset = assets.find((a) => a.id === threat.assetId)
      if (!asset) return

      const threatSafeguards = safeguards.filter((s) => s.threatId === threat.id)
      const eficaciaTotal =
        threatSafeguards.length > 0
          ? threatSafeguards.reduce((acc, s) => acc + (s.eficacia * s.madurez) / 100, 0) / threatSafeguards.length
          : 0

      const dimensions = [
        { name: "Disponibilidad", value: asset.disponibilidad, degradacion: threat.degradacionD },
        { name: "Integridad", value: asset.integridad, degradacion: threat.degradacionI },
        { name: "Confidencialidad", value: asset.confidencialidad, degradacion: threat.degradacionC },
        { name: "Autenticidad", value: asset.autenticidad, degradacion: threat.degradacionA },
        { name: "Trazabilidad", value: asset.trazabilidad, degradacion: threat.degradacionT },
      ]

      dimensions.forEach((dim) => {
        if (dim.degradacion > 0) {
          const impacto = (dim.value * dim.degradacion) / 100
          const riesgoIntrinseco = (impacto * threat.frecuencia) / 100
          const riesgoResidual = riesgoIntrinseco * (1 - eficaciaTotal / 100)

          newCalculations.push({
            threatId: threat.id,
            threatName: threat.nombre,
            assetName: asset.nombre,
            dimension: dim.name,
            valorActivo: dim.value,
            degradacion: dim.degradacion,
            frecuencia: threat.frecuencia,
            impacto: Number(impacto.toFixed(2)),
            riesgoIntrinseco: Number(riesgoIntrinseco.toFixed(2)),
            eficaciaSalvaguardas: Number(eficaciaTotal.toFixed(0)),
            riesgoResidual: Number(riesgoResidual.toFixed(2)),
          })
        }
      })
    })

    newCalculations.sort((a, b) => b.riesgoResidual - a.riesgoResidual)
    setCalculations(newCalculations)
  }, [assets, threats, safeguards])

  const getRiskColor = (risk: number) => {
    if (risk >= 7) return "text-red-500"
    if (risk >= 5) return "text-orange-500"
    if (risk >= 3) return "text-yellow-500"
    return "text-green-500"
  }

  const getRiskBadge = (risk: number) => {
    if (risk >= 7) return <Badge variant="destructive">Crítico</Badge>
    if (risk >= 5) return <Badge className="bg-orange-500 hover:bg-orange-600">Alto</Badge>
    if (risk >= 3) return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medio</Badge>
    return <Badge className="bg-green-500 hover:bg-green-600">Bajo</Badge>
  }

  const totalRiesgoResidual = calculations.reduce((acc, calc) => acc + calc.riesgoResidual, 0)
  const riesgoCritico = calculations.filter((c) => c.riesgoResidual >= 7).length
  const riesgoAlto = calculations.filter((c) => c.riesgoResidual >= 5 && c.riesgoResidual < 7).length
  const riesgoMedio = calculations.filter((c) => c.riesgoResidual >= 3 && c.riesgoResidual < 5).length

  return (
    <div className="space-y-6">
      {calculations.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TrendingUp />
                </EmptyMedia>
                <EmptyTitle>No hay datos para calcular riesgos</EmptyTitle>
                <EmptyDescription>
                  Necesitas clasificar activos e identificar amenazas para realizar el cálculo de riesgos.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Riesgo Total Residual</CardDescription>
                <CardTitle className={`text-3xl ${getRiskColor(totalRiesgoResidual / calculations.length)}`}>
                  {totalRiesgoResidual.toFixed(1)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Riesgos Críticos</CardDescription>
                <CardTitle className="text-3xl text-red-500">{riesgoCritico}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Riesgos Altos</CardDescription>
                <CardTitle className="text-3xl text-orange-500">{riesgoAlto}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Riesgos Medios</CardDescription>
                <CardTitle className="text-3xl text-yellow-500">{riesgoMedio}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Formula Alert */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Fórmulas de Cálculo MAGERIT</AlertTitle>
            <AlertDescription className="space-y-1 text-sm">
              <div>
                <strong>Impacto</strong> = Valor Activo × (Degradación / 100)
              </div>
              <div>
                <strong>Riesgo Intrínseco</strong> = Impacto × (Frecuencia / 100)
              </div>
              <div>
                <strong>Riesgo Residual</strong> = Riesgo Intrínseco × (1 - Eficacia Salvaguardas / 100)
              </div>
            </AlertDescription>
          </Alert>

          {/* Detailed Table */}
          <Card>
            <CardHeader>
              <CardTitle>Cálculo Detallado de Riesgos</CardTitle>
              <CardDescription>Análisis completo por amenaza, activo y dimensión de seguridad</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amenaza</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Dimensión</TableHead>
                    <TableHead className="text-center">Valor</TableHead>
                    <TableHead className="text-center">Degrad.</TableHead>
                    <TableHead className="text-center">Frec.</TableHead>
                    <TableHead className="text-center">Impacto</TableHead>
                    <TableHead className="text-center">R. Intrínseco</TableHead>
                    <TableHead className="text-center">Efic. Salv.</TableHead>
                    <TableHead className="text-center">R. Residual</TableHead>
                    <TableHead className="text-center">Nivel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculations.map((calc, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{calc.threatName}</TableCell>
                      <TableCell>{calc.assetName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{calc.dimension.charAt(0)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{calc.valorActivo}</TableCell>
                      <TableCell className="text-center">{calc.degradacion}%</TableCell>
                      <TableCell className="text-center">{calc.frecuencia}%</TableCell>
                      <TableCell className="text-center font-semibold">{calc.impacto}</TableCell>
                      <TableCell className="text-center font-semibold">{calc.riesgoIntrinseco}</TableCell>
                      <TableCell className="text-center">{calc.eficaciaSalvaguardas}%</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-bold ${getRiskColor(calc.riesgoResidual)}`}>{calc.riesgoResidual}</span>
                      </TableCell>
                      <TableCell className="text-center">{getRiskBadge(calc.riesgoResidual)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
