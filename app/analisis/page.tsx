"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AlertTriangle, Calculator, Shield, TrendingUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThreatAnalysis } from "@/components/threat-analysis"
import { RiskCalculator } from "@/components/risk-calculator"
import { SafeguardEvaluation } from "@/components/safeguard-evaluation"

export type Threat = {
  id: string
  assetId: string
  assetName: string
  nombre: string
  tipo: string
  frecuencia: number
  degradacionD: number
  degradacionI: number
  degradacionC: number
  degradacionA: number
  degradacionT: number
}

export type Safeguard = {
  id: string
  threatId: string
  nombre: string
  tipo: "Preventiva" | "Detectiva" | "Correctiva"
  eficacia: number
  madurez: number
}

export default function AnalisisPage() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [safeguards, setSafeguards] = useState<Safeguard[]>([])

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
              Identifica amenazas, evalúa salvaguardas y calcula el riesgo residual según la metodología MAGERIT.
            </p>
          </div>

          {/* Info Alert */}
          <Alert className="mb-8">
            <Calculator className="h-4 w-4" />
            <AlertTitle>Cálculo de Riesgos MAGERIT</AlertTitle>
            <AlertDescription>
              El riesgo se calcula como: <strong>Riesgo = Impacto × Frecuencia</strong>, donde el Impacto = Valor del
              Activo × Degradación. Las salvaguardas reducen el riesgo según su eficacia.
            </AlertDescription>
          </Alert>

          {/* Main Tabs */}
          <Tabs defaultValue="amenazas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="amenazas">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Amenazas
              </TabsTrigger>
              <TabsTrigger value="salvaguardas">
                <Shield className="mr-2 h-4 w-4" />
                Salvaguardas
              </TabsTrigger>
              <TabsTrigger value="calculo">
                <TrendingUp className="mr-2 h-4 w-4" />
                Cálculo de Riesgos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="amenazas">
              <ThreatAnalysis threats={threats} setThreats={setThreats} />
            </TabsContent>

            <TabsContent value="salvaguardas">
              <SafeguardEvaluation threats={threats} safeguards={safeguards} setSafeguards={setSafeguards} />
            </TabsContent>

            <TabsContent value="calculo">
              <RiskCalculator threats={threats} safeguards={safeguards} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
