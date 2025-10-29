import { Header } from "@/components/header"
import { BookOpen, Target, Shield, AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12">
        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Metodología MAGERIT</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty">
              MAGERIT (Metodología de Análisis y Gestión de Riesgos de los Sistemas de Información) es la metodología
              oficial de España para el análisis y gestión de riesgos de seguridad de la información.
            </p>
          </div>

          {/* Overview Alert */}
          <Alert className="mb-8">
            <Shield className="h-4 w-4" />
            <AlertTitle>Metodología Oficial</AlertTitle>
            <AlertDescription>
              Desarrollada por el Ministerio de Hacienda y Administraciones Públicas de España, MAGERIT es de uso
              obligatorio en la Administración Pública y ampliamente adoptada en el sector privado.
            </AlertDescription>
          </Alert>

          {/* Main Content Tabs */}
          <Tabs defaultValue="introduccion" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="introduccion">Introducción</TabsTrigger>
              <TabsTrigger value="fases">Fases</TabsTrigger>
              <TabsTrigger value="conceptos">Conceptos</TabsTrigger>
              <TabsTrigger value="dimensiones">Dimensiones</TabsTrigger>
            </TabsList>

            {/* Introducción Tab */}
            <TabsContent value="introduccion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>¿Qué es MAGERIT?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed">
                    MAGERIT es un método formal para investigar los riesgos que soportan los sistemas de información, y
                    para recomendar las medidas apropiadas que deberían adoptarse para controlar estos riesgos.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Objetivos principales:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Concienciar sobre la existencia de riesgos y la necesidad de gestionarlos</li>
                      <li>Ofrecer un método sistemático para analizar los riesgos</li>
                      <li>
                        Ayudar a descubrir y planificar las medidas oportunas para mantener los riesgos bajo control
                      </li>
                      <li>Preparar a la organización para procesos de evaluación, auditoría o certificación</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estructura de MAGERIT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold">Libro I: Método</h4>
                      <p className="text-sm text-muted-foreground">
                        Describe el método de análisis y gestión de riesgos
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold">Libro II: Catálogo</h4>
                      <p className="text-sm text-muted-foreground">
                        Catálogo de elementos: activos, amenazas y salvaguardas
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold">Libro III: Guía</h4>
                      <p className="text-sm text-muted-foreground">Técnicas y prácticas para el análisis de riesgos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fases Tab */}
            <TabsContent value="fases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Proceso de Análisis y Gestión de Riesgos</CardTitle>
                  <CardDescription>
                    MAGERIT estructura el proceso en cinco fases principales que se ejecutan de forma iterativa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="fase1">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Fase 1</Badge>
                          <span>Identificación de Activos</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <p className="text-muted-foreground">
                          Determinar qué activos componen el sistema de información y cuál es su valor para la
                          organización.
                        </p>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-sm">Actividades:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Inventariar los activos del sistema</li>
                            <li>Determinar las dependencias entre activos</li>
                            <li>Valorar los activos en función de su importancia</li>
                            <li>Identificar las dimensiones de seguridad relevantes (D, I, C, A, T)</li>
                          </ul>
                        </div>
                        <Alert>
                          <Target className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Los activos se clasifican en: datos/información, servicios, aplicaciones software, equipos
                            informáticos, redes de comunicaciones, soportes de información, equipamiento auxiliar,
                            instalaciones y personal.
                          </AlertDescription>
                        </Alert>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="fase2">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Fase 2</Badge>
                          <span>Identificación de Amenazas</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <p className="text-muted-foreground">
                          Determinar las amenazas que pueden afectar a cada activo y con qué frecuencia pueden
                          materializarse.
                        </p>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-sm">Actividades:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Identificar las amenazas relevantes para cada activo</li>
                            <li>Estimar la frecuencia de ocurrencia de cada amenaza</li>
                            <li>Determinar la degradación causada por cada amenaza</li>
                            <li>Evaluar el impacto potencial sobre las dimensiones de seguridad</li>
                          </ul>
                        </div>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Las amenazas se clasifican en: desastres naturales, de origen industrial, errores y fallos
                            no intencionados, y ataques intencionados.
                          </AlertDescription>
                        </Alert>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="fase3">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Fase 3</Badge>
                          <span>Evaluación de Salvaguardas</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <p className="text-muted-foreground">
                          Determinar las salvaguardas existentes y su eficacia frente a las amenazas identificadas.
                        </p>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-sm">Actividades:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Inventariar las salvaguardas implementadas</li>
                            <li>Evaluar la eficacia de cada salvaguarda</li>
                            <li>Determinar el nivel de madurez de las salvaguardas</li>
                            <li>Identificar carencias en la protección</li>
                          </ul>
                        </div>
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Las salvaguardas pueden ser preventivas (reducen la frecuencia), detectivas (identifican
                            incidentes) o correctivas (reducen el impacto).
                          </AlertDescription>
                        </Alert>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="fase4">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Fase 4</Badge>
                          <span>Cálculo del Riesgo</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <p className="text-muted-foreground">
                          Estimar el impacto y el riesgo que soporta el sistema de información.
                        </p>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-sm">Fórmulas básicas:</h5>
                          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                            <div>Impacto = Valor del Activo × Degradación</div>
                            <div>Riesgo Intrínseco = Impacto × Frecuencia</div>
                            <div>Riesgo Residual = Riesgo Intrínseco × (1 - Eficacia Salvaguardas)</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-sm">Escalas de valoración:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Valor de activos: 0-10 (muy bajo a muy alto)</li>
                            <li>Frecuencia: 0-100 (muy baja a muy alta)</li>
                            <li>Degradación: 0-100% (ninguna a total)</li>
                            <li>Eficacia: 0-100% (nula a total)</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="fase5">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Fase 5</Badge>
                          <span>Tratamiento del Riesgo</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <p className="text-muted-foreground">
                          Decidir qué hacer con los riesgos identificados y planificar las acciones necesarias.
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm">Estrategias de tratamiento:</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              <li>
                                <strong>Mitigar:</strong> Implementar salvaguardas para reducir el riesgo
                              </li>
                              <li>
                                <strong>Transferir:</strong> Contratar seguros o externalizar servicios
                              </li>
                              <li>
                                <strong>Evitar:</strong> Eliminar la actividad que genera el riesgo
                              </li>
                              <li>
                                <strong>Aceptar:</strong> Asumir el riesgo cuando es tolerable
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm">Plan de seguridad:</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              <li>Priorizar los riesgos a tratar</li>
                              <li>Seleccionar salvaguardas apropiadas</li>
                              <li>Estimar costes y beneficios</li>
                              <li>Planificar la implementación</li>
                              <li>Establecer métricas de seguimiento</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conceptos Tab */}
            <TabsContent value="conceptos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conceptos Fundamentales</CardTitle>
                  <CardDescription>Definiciones clave de la metodología MAGERIT</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Activo
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Componente o funcionalidad de un sistema de información susceptible de ser atacado deliberada o
                        accidentalmente con consecuencias para la organización. Incluye información, datos, servicios,
                        aplicaciones, equipos, comunicaciones, recursos administrativos, recursos físicos y recursos
                        humanos.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        Amenaza
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Eventos que pueden desencadenar un incidente en la organización, produciendo daños materiales o
                        pérdidas inmateriales en sus activos. Las amenazas pueden ser naturales, industriales, errores
                        humanos o ataques deliberados.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Vulnerabilidad
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Debilidad de un activo o control que puede ser explotada por una amenaza. Las vulnerabilidades
                        pueden ser técnicas, organizativas o humanas.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Salvaguarda
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Procedimiento o mecanismo tecnológico que reduce el riesgo. Las salvaguardas pueden prevenir
                        incidentes, detectarlos cuando ocurren, o corregir sus consecuencias. También se denominan
                        contramedidas o controles.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        Impacto
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Consecuencia sobre un activo derivada de la materialización de una amenaza. Se mide considerando
                        el valor del activo y la degradación que sufre. El impacto puede ser directo (sobre el activo
                        afectado) o indirecto (propagado a otros activos dependientes).
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Riesgo
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Estimación del grado de exposición a que una amenaza se materialice sobre uno o más activos
                        causando daños a la organización. El riesgo indica lo que le podría pasar a los activos si no se
                        protegieran adecuadamente. Se calcula como el producto del impacto por la frecuencia.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Riesgo Residual
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Riesgo remanente después de aplicar las salvaguardas. Es el riesgo que la organización debe
                        aceptar o tratar con medidas adicionales. Nunca se puede eliminar completamente el riesgo,
                        siempre existe un riesgo residual.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dimensiones Tab */}
            <TabsContent value="dimensiones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dimensiones de Seguridad</CardTitle>
                  <CardDescription>
                    MAGERIT considera cinco dimensiones fundamentales para valorar los activos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <span className="font-bold text-primary">D</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Disponibilidad</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Propiedad de que los activos estén accesibles y utilizables cuando lo requieran las
                            entidades autorizadas. La pérdida de disponibilidad impide el acceso a la información o
                            servicios cuando se necesitan.
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            Ejemplo: Un ataque DDoS que deja inaccesible un servicio web crítico.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <span className="font-bold text-primary">I</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Integridad</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Propiedad de que los activos no sean alterados de forma no autorizada. La pérdida de
                            integridad puede ser accidental o deliberada, y afecta a la exactitud y completitud de la
                            información.
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            Ejemplo: Modificación no autorizada de registros en una base de datos financiera.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <span className="font-bold text-primary">C</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Confidencialidad</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Propiedad de que la información no esté disponible ni sea revelada a individuos, entidades o
                            procesos no autorizados. La pérdida de confidencialidad supone que personas no autorizadas
                            acceden a información sensible.
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            Ejemplo: Filtración de datos personales de clientes por un acceso no autorizado.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <span className="font-bold text-primary">A</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Autenticidad</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Propiedad de que una entidad es quien dice ser o que garantiza la fuente de la que proceden
                            los datos. La pérdida de autenticidad permite la suplantación de identidad o el repudio de
                            acciones.
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            Ejemplo: Un correo de phishing que suplanta la identidad del director general.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <span className="font-bold text-primary">T</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">Trazabilidad</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Propiedad de que las acciones de una entidad puedan ser imputadas exclusivamente a dicha
                            entidad. La pérdida de trazabilidad impide determinar quién hizo qué y cuándo, dificultando
                            la auditoría y la respuesta a incidentes.
                          </p>
                          <p className="text-sm text-muted-foreground italic">
                            Ejemplo: Ausencia de logs que impide identificar quién modificó información crítica.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Valoración por Dimensiones</AlertTitle>
                <AlertDescription>
                  Cada activo debe valorarse independientemente en cada dimensión relevante. Un activo puede tener alto
                  valor en confidencialidad pero bajo en disponibilidad, o viceversa. Esta valoración diferenciada
                  permite un análisis más preciso de los riesgos.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Comienza tu Análisis de Riesgos</CardTitle>
              <CardDescription>
                Aplica la metodología MAGERIT en tu organización utilizando nuestras herramientas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/clasificacion">
                    <Shield className="mr-2 h-5 w-5" />
                    Clasificar Activos
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/analisis">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Analizar Riesgos
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
