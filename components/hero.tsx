import { Button } from "@/components/ui/button"
import { Shield, FileText } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/50 transition-all">
            <span className="font-semibold text-primary">Metodología Oficial</span> de España para Gestión de Riesgos
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-balance">
          Gestión de Riesgos de Seguridad de la Información
        </h1>

        <p className="text-lg text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto">
          Herramienta completa basada en MAGERIT para identificar, analizar y gestionar los riesgos de seguridad de la
          información en tu organización de manera sistemática y profesional.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/clasificacion">
              <Shield className="mr-2 h-5 w-5" />
              Clasificar Activos
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/metodologia">
              <FileText className="mr-2 h-5 w-5" />
              Ver Metodología
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
