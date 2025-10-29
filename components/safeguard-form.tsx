"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Threat, Safeguard } from "@/app/analisis/page"

const safeguardSchema = z.object({
  threatId: z.string().min(1, "Debes seleccionar una amenaza"),
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  tipo: z.enum(["Preventiva", "Detectiva", "Correctiva"]),
  eficacia: z.number().min(0).max(100),
  madurez: z.number().min(0).max(100),
})

type SafeguardFormValues = z.infer<typeof safeguardSchema>

interface SafeguardFormProps {
  threats: Threat[]
  onSubmit: (data: Omit<Safeguard, "id">) => void
  onCancel: () => void
  initialData?: Safeguard
}

export function SafeguardForm({ threats, onSubmit, onCancel, initialData }: SafeguardFormProps) {
  const form = useForm<SafeguardFormValues>({
    resolver: zodResolver(safeguardSchema),
    defaultValues: initialData || {
      threatId: "",
      nombre: "",
      tipo: "Preventiva",
      eficacia: 70,
      madurez: 50,
    },
  })

  const handleSubmit = (data: SafeguardFormValues) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="threatId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenaza a Proteger</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la amenaza" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {threats.map((threat) => (
                    <SelectItem key={threat.id} value={threat.id}>
                      {threat.nombre} - {threat.assetName}
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
              <FormLabel>Nombre de la Salvaguarda</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Firewall perimetral" {...field} />
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
              <FormLabel>Tipo de Salvaguarda</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Preventiva">Preventiva</SelectItem>
                  <SelectItem value="Detectiva">Detectiva</SelectItem>
                  <SelectItem value="Correctiva">Correctiva</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Preventiva: reduce frecuencia | Detectiva: identifica incidentes | Correctiva: reduce impacto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eficacia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eficacia (%)</FormLabel>
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
              <FormDescription>Porcentaje de reducción del riesgo que proporciona la salvaguarda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="madurez"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nivel de Madurez (%)</FormLabel>
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
              <FormDescription>Grado de implementación y efectividad actual de la salvaguarda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? "Guardar Cambios" : "Añadir Salvaguarda"}</Button>
        </div>
      </form>
    </Form>
  )
}
