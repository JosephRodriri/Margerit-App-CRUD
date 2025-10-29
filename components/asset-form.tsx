"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Asset } from "@/app/clasificacion/page"

const assetSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria").max(500, "Máximo 500 caracteres"),
  disponibilidad: z.number().min(0).max(10),
  integridad: z.number().min(0).max(10),
  confidencialidad: z.number().min(0).max(10),
  autenticidad: z.number().min(0).max(10),
  trazabilidad: z.number().min(0).max(10),
})

type AssetFormValues = z.infer<typeof assetSchema>

interface AssetFormProps {
  onSubmit: (data: Omit<Asset, "id">) => void
  onCancel: () => void
  initialData?: Asset
}

const tiposActivo = [
  "Datos/Información",
  "Servicios",
  "Aplicaciones Software",
  "Equipos Informáticos",
  "Redes de Comunicaciones",
  "Soportes de Información",
  "Equipamiento Auxiliar",
  "Instalaciones",
  "Personal",
]

export function AssetForm({ onSubmit, onCancel, initialData }: AssetFormProps) {
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: initialData || {
      nombre: "",
      tipo: "",
      descripcion: "",
      disponibilidad: 5,
      integridad: 5,
      confidencialidad: 5,
      autenticidad: 5,
      trazabilidad: 5,
    },
  })

  const handleSubmit = (data: AssetFormValues) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información Básica</CardTitle>
            <CardDescription>Datos identificativos del activo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Activo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Base de datos de clientes" {...field} />
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
                  <FormLabel>Tipo de Activo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de activo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposActivo.map((tipo) => (
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
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el activo, su función y ubicación..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Valoración de Dimensiones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Valoración de Dimensiones de Seguridad</CardTitle>
            <CardDescription>Valora cada dimensión de 0 (sin valor) a 10 (valor crítico)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="disponibilidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad (D)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        className="flex-1"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      <span className="w-12 text-center font-semibold">{field.value}</span>
                    </div>
                  </FormControl>
                  <FormDescription>¿Qué impacto tiene que el activo no esté disponible?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="integridad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integridad (I)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        className="flex-1"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      <span className="w-12 text-center font-semibold">{field.value}</span>
                    </div>
                  </FormControl>
                  <FormDescription>¿Qué impacto tiene que el activo sea modificado incorrectamente?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confidencialidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confidencialidad (C)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        className="flex-1"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      <span className="w-12 text-center font-semibold">{field.value}</span>
                    </div>
                  </FormControl>
                  <FormDescription>¿Qué impacto tiene que personas no autorizadas accedan al activo?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autenticidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autenticidad (A)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        className="flex-1"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      <span className="w-12 text-center font-semibold">{field.value}</span>
                    </div>
                  </FormControl>
                  <FormDescription>¿Qué impacto tiene la suplantación de identidad sobre este activo?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trazabilidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trazabilidad (T)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        className="flex-1"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                      <span className="w-12 text-center font-semibold">{field.value}</span>
                    </div>
                  </FormControl>
                  <FormDescription>¿Qué impacto tiene no poder auditar las acciones sobre este activo?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? "Guardar Cambios" : "Añadir Activo"}</Button>
        </div>
      </form>
    </Form>
  )
}
