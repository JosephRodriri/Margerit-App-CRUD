import { Shield, FileCheck, AlertTriangle, BarChart3, Lock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "Identificación de Activos",
    description:
      "Clasifica y valora tus activos de información según las dimensiones de seguridad: disponibilidad, integridad, confidencialidad, autenticidad y trazabilidad.",
  },
  {
    icon: AlertTriangle,
    title: "Análisis de Amenazas",
    description:
      "Identifica las amenazas potenciales que pueden afectar a tus activos y evalúa su probabilidad de ocurrencia e impacto.",
  },
  {
    icon: Lock,
    title: "Evaluación de Salvaguardas",
    description: "Determina las medidas de seguridad existentes y necesarias para proteger tus activos de información.",
  },
  {
    icon: BarChart3,
    title: "Cálculo de Riesgos",
    description:
      "Calcula automáticamente el nivel de riesgo basándose en la valoración de activos, amenazas y salvaguardas implementadas.",
  },
  {
    icon: FileCheck,
    title: "Cumplimiento Normativo",
    description:
      "Asegura el cumplimiento con la metodología oficial MAGERIT y las mejores prácticas en gestión de riesgos.",
  },
  {
    icon: CheckCircle,
    title: "Tratamiento de Riesgos",
    description: "Define estrategias de tratamiento: aceptar, mitigar, transferir o evitar los riesgos identificados.",
  },
]

export function Features() {
  return (
    <section className="container py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Gestión Integral de Riesgos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Todo lo que necesitas para implementar MAGERIT en tu organización
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
