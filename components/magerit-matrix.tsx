"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Download, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

const INITIAL_THREATS = {
  natural: [
    { code: "N.1", name: "Fuego" },
    { code: "N.2", name: "Daños por agua" },
    { code: "N.*", name: "Desastres naturales" },
  ],
  industrial: [
    { code: "I.1", name: "Fuego" },
    { code: "I.2", name: "Daños por agua" },
    { code: "I.3", name: "Contaminación mecánica" },
    { code: "I.4", name: "Contaminación electromagnética" },
    { code: "I.5", name: "Avería de origen físico o lógico" },
    { code: "I.*", name: "Desastres industriales" },
  ],
  errors: [
    { code: "E.1", name: "Errores de los usuarios" },
    { code: "E.2", name: "Errores del administrador" },
    { code: "E.3", name: "Errores de monitorización (log)" },
    { code: "E.4", name: "Errores de configuración" },
    { code: "E.7", name: "Deficiencias en la organización" },
    { code: "E.8", name: "Difusión de software dañino" },
    { code: "E.9", name: "Errores de [re-]encaminamiento" },
    { code: "E.10", name: "Errores de secuencia" },
    { code: "E.14", name: "Escapes de información" },
    { code: "E.15", name: "Alteración de la información" },
    { code: "E.18", name: "Destrucción de información" },
    { code: "E.19", name: "Fugas de información" },
    { code: "E.20", name: "Vulnerabilidades de los programas (software)" },
    { code: "E.21", name: "Errores de mantenimiento / actualización de programas (software)" },
    { code: "E.23", name: "Errores de mantenimiento / actualización de equipos (hardware)" },
    { code: "E.24", name: "Caída del sistema por agotamiento de recursos" },
    { code: "E.25", name: "Pérdida de equipos" },
    { code: "E.28", name: "Indisponibilidad del personal" },
  ],
  attacks: [
    { code: "A.3", name: "Manipulación de los registros de actividad (log)" },
    { code: "A.4", name: "Manipulación de la configuración" },
    { code: "A.5", name: "Suplantación de la identidad del usuario" },
    { code: "A.6", name: "Abuso de privilegios de acceso" },
    { code: "A.7", name: "Uso no previsto" },
    { code: "A.8", name: "Difusión de software dañino" },
    { code: "A.9", name: "[Re-]encaminamiento de mensajes" },
    { code: "A.10", name: "Alteración de secuencia" },
    { code: "A.11", name: "Acceso no autorizado" },
    { code: "A.12", name: "Análisis de tráfico" },
    { code: "A.13", name: "Repudio" },
    { code: "A.14", name: "Interceptación de información (escucha)" },
    { code: "A.15", name: "Modificación de información" },
    { code: "A.18", name: "Destrucción de información" },
    { code: "A.19", name: "Divulgación de información" },
    { code: "A.22", name: "Manipulación de programas" },
    { code: "A.23", name: "Manipulación de los equipos" },
    { code: "A.24", name: "Denegación de servicio" },
    { code: "A.25", name: "Robo" },
    { code: "A.26", name: "Ataque destructivo" },
    { code: "A.27", name: "Ocupación enemiga" },
    { code: "A.28", name: "Indisponibilidad del personal" },
    { code: "A.29", name: "Extorsión" },
    { code: "A.30", name: "Ingeniería social (picaresca)" },
  ],
}

const ASSET_TYPES = [
  "Datos / Información",
  "Claves criptográficas",
  "Servicios",
  "Software - Aplicaciones",
  "Software - Sistema operativo",
  "Software - Aplicaciones ofimáticas",
  "Equipamiento - Servidores",
  "Equipamiento - Equipos de usuario",
  "Redes de comunicaciones",
  "Soportes de información",
  "Equipamiento auxiliar",
  "Instalaciones",
  "Personal",
]

const createEmptyCell = () => ({ D: 0, I: 0, C: 0, A: 0, T: 0, RD: 0, RI: 0, RC: 0, RA: 0, RT: 0 })

const createInitialData = (): AssetGroup[] => {
  return ASSET_TYPES.map((assetName) => ({
    name: assetName,
    threats: [
      ...INITIAL_THREATS.natural.map((t) => ({ ...t, cells: createEmptyCell() })),
      ...INITIAL_THREATS.industrial.map((t) => ({ ...t, cells: createEmptyCell() })),
      ...INITIAL_THREATS.errors.map((t) => ({ ...t, cells: createEmptyCell() })),
      ...INITIAL_THREATS.attacks.map((t) => ({ ...t, cells: createEmptyCell() })),
    ],
  }))
}

export function MageritMatrix() {
  const [matrixData, setMatrixData] = useState<AssetGroup[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("magerit-matrix")
    if (stored) {
      setMatrixData(JSON.parse(stored))
      const savedTime = localStorage.getItem("magerit-matrix-saved")
      if (savedTime) setLastSaved(new Date(savedTime))
    } else {
      setMatrixData(createInitialData())
    }
  }, [])

  const handleCellChange = (assetIndex: number, threatIndex: number, dimension: string, value: string) => {
    const numValue = Math.max(0, Math.min(10, Number.parseInt(value) || 0))
    const newData = [...matrixData]
    const cellKey = dimension as keyof ThreatRow["cells"]
    newData[assetIndex].threats[threatIndex].cells[cellKey] = numValue
    setMatrixData(newData)
  }

  const handleSave = () => {
    localStorage.setItem("magerit-matrix", JSON.stringify(matrixData))
    const now = new Date()
    localStorage.setItem("magerit-matrix-saved", now.toISOString())
    setLastSaved(now)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(matrixData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `magerit-matrix-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          setMatrixData(imported)
          handleSave()
        } catch (error) {
          alert("Error al importar el archivo")
        }
      }
      reader.readAsText(file)
    }
  }

  const getCellColor = (value: number) => {
    if (value === 0) return "bg-background"
    if (value <= 3) return "bg-green-500/20 hover:bg-green-500/30"
    if (value <= 5) return "bg-yellow-500/20 hover:bg-yellow-500/30"
    if (value <= 7) return "bg-orange-500/20 hover:bg-orange-500/30"
    return "bg-red-500/20 hover:bg-red-500/30"
  }

  const getCellTextColor = (value: number) => {
    if (value === 0) return "text-muted-foreground"
    if (value <= 3) return "text-green-600 dark:text-green-400"
    if (value <= 5) return "text-yellow-600 dark:text-yellow-400"
    if (value <= 7) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Alert role="alert">
          <AlertDescription>
            {lastSaved
              ? `Última actualización: ${lastSaved.toLocaleString("es-ES")}`
              : "No se han guardado cambios aún"}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="default">
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Importar
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </Button>
        </div>
      </div>

      {matrixData.map((assetGroup, assetIndex) => (
        <Card key={assetIndex}>
          <CardHeader>
            <CardTitle className="text-lg">{assetGroup.name}</CardTitle>
            <CardDescription>Valoración de amenazas para este tipo de activo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="sticky left-0 z-10 bg-card p-2 text-left font-semibold">Código</th>
                    <th className="sticky left-[60px] z-10 bg-card p-2 text-left font-semibold min-w-[250px]">
                      Amenaza
                    </th>
                    <th className="bg-muted p-2 text-center font-semibold">D</th>
                    <th className="bg-muted p-2 text-center font-semibold">I</th>
                    <th className="bg-muted p-2 text-center font-semibold">C</th>
                    <th className="bg-muted p-2 text-center font-semibold">A</th>
                    <th className="bg-muted p-2 text-center font-semibold">T</th>
                    <th className="bg-muted/50 p-2 text-center font-semibold">RD</th>
                    <th className="bg-muted/50 p-2 text-center font-semibold">RI</th>
                    <th className="bg-muted/50 p-2 text-center font-semibold">RC</th>
                    <th className="bg-muted/50 p-2 text-center font-semibold">RA</th>
                    <th className="bg-muted/50 p-2 text-center font-semibold">RT</th>
                  </tr>
                </thead>
                <tbody>
                  {assetGroup.threats.map((threat, threatIndex) => (
                    <tr key={threatIndex} className="border-b hover:bg-muted/50" data-threat-index={threatIndex}>
                      <td className="sticky left-0 z-10 bg-card p-2 font-mono text-xs">{threat.code}</td>
                      <td className="sticky left-[60px] z-10 bg-card p-2 text-xs">{threat.name}</td>
                      {(["D", "I", "C", "A", "T", "RD", "RI", "RC", "RA", "RT"] as const).map((dim, dimIndex) => (
                        <td key={dim} className={`p-1 ${getCellColor(threat.cells[dim])}`} data-dimension={dim}>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={threat.cells[dim] || ""}
                            onChange={(e) => handleCellChange(assetIndex, threatIndex, dim, e.target.value)}
                            className={`h-8 w-12 border-0 bg-transparent text-center text-xs font-semibold ${getCellTextColor(threat.cells[dim])}`}
                            data-testid={`cell-${assetIndex}-${threatIndex}-${dim}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">Dimensiones de Valoración</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>D:</strong> Disponibilidad
                </li>
                <li>
                  <strong>I:</strong> Integridad
                </li>
                <li>
                  <strong>C:</strong> Confidencialidad
                </li>
                <li>
                  <strong>A:</strong> Autenticidad
                </li>
                <li>
                  <strong>T:</strong> Trazabilidad
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Dimensiones de Riesgo</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>RD:</strong> Riesgo en Disponibilidad
                </li>
                <li>
                  <strong>RI:</strong> Riesgo en Integridad
                </li>
                <li>
                  <strong>RC:</strong> Riesgo en Confidencialidad
                </li>
                <li>
                  <strong>RA:</strong> Riesgo en Autenticidad
                </li>
                <li>
                  <strong>RT:</strong> Riesgo en Trazabilidad
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="mb-2 font-semibold">Escala de Colores</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 rounded bg-green-500/20 border" />
                <span>0-3: Bajo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 rounded bg-yellow-500/20 border" />
                <span>4-5: Medio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 rounded bg-orange-500/20 border" />
                <span>6-7: Alto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 rounded bg-red-500/20 border" />
                <span>8-10: Crítico</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
