import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">MAGERIT</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/metodologia"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Metodología
          </Link>
          <Link
            href="/clasificacion"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Clasificación
          </Link>
          <Link
            href="/analisis"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Análisis
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <Button asChild>
          <Link href="/clasificacion">Comenzar</Link>
        </Button>
      </div>
    </header>
  )
}
