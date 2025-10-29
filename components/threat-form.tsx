"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Threat } from "@/app/analisis/page"
import type { Asset } from "@/app/clasificacion/page"

const threatSchema = z.object({
  assetId: z.string().min(1, "Debes seleccionar un activo"),
  assetName: z.string(),
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
  frecuencia: z.number().min(0).max(100),
  degradacionD: z.number().min(0).max(100),
  degradacionI: z.number().min(0).max(100),
  degradacionC: z.number().min(0).max(100),
  degradacionA: z.number().min(0).max(100),
  degradacionT: z.number().min(0).max(100),
})

type ThreatFormValues = z.infer<typeof threatSchema>

interface ThreatFormProps {
  assets: Asset[]
  onSubmit: (data: Omit<Threat, "id">) => void
  onCancel: () => void
  initialData?: Threat
}

const tiposAmenaza = ["Desastres Naturales", "Origen Industrial", "Errores y Fallos", "Ataques Intencionados"]

export function ThreatForm({ assets, onSubmit, onCancel, initialData }: ThreatFormProps) {
  const form = useForm<ThreatFormValues>({
    resolver: zodResolver(threatSchema),
    defaultValues: initialData || {
      assetId: "",
      assetName: "",
      nombre: "",
      tipo: "",
      frecuencia: 25,
      degradacionD: 50,
      degradacionI: 50,
      degradacionC: 50,
      degradacionA: 50,
      degradacionT: 50,
    },
  })

  const handleSubmit = (data: ThreatFormValues) => {
    onSubmit(data)
    form.reset()
  }

  const handleAssetChange = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId)
    if (asset) {
      form.setValue("assetName", asset.nombre)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información de la Amenaza</CardTitle>
            <CardDescription>Identifica la amenaza y el activo afectado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activo Afectado</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleAssetChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el activo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.nombre} ({asset.tipo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Amenaza</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ataque de ransomware" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Amenaza</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposAmenaza.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Categoría según MAGERIT</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frecuencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia de Ocurrencia (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        className="flex-1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="w-16 text-center font-semibold">{field.value}%</span>
                    </div>
                  </FormControl>
                  <FormDescription>Probabilidad de que la amenaza se materialice</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Degradación por Dimensión</CardTitle>
            <CardDescription>
              Indica el porcentaje de degradación que causa la amenaza en cada dimensión
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="degradacionD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degradación de Disponibilidad (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        className="flex-1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="w-16 text-center font-semibold">{field.value}%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degradacionI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degradación de Integridad (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        className="flex-1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="w-16 text-center font-semibold">{field.value}%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degradacionC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degradación de Confidencialidad (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        className="flex-1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="w-16 text-center font-semibold">{field.value}%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degradacionA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degradación de Autenticidad (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        className="flex-1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="w-16 text-center font-semibold">{field.value}%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degradacionT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degradación de Trazabilidad (%)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        className="flex-1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <span className="w-16 text-center font-semibold">{field.value}%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? "Guardar Cambios" : "Añadir Amenaza"}</Button>
        </div>
      </form>
    </Form>
  )
}
