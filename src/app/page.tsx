"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { X } from "lucide-react"

const periodsSchema = z.number().min(30, "Período mínimo 30 dias").max(365, "Período máximo: 365 dias");

export default function MultipleInput() {
  const [inputPeriods, setInputPeriods] = useState("")
  const [periods, setPeriods] = useState<number[]>([])
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null)

  // Função "Adicionar"
  const handleAdd = () => {
    setMessage(null)

    // Valida o valor inserido usando Zod (converter string para número)
    const parsed = z.coerce.number().pipe(periodsSchema).safeParse(inputPeriods)

    if (!parsed.success) {
      setMessage({ text: parsed.error.errors[0].message, type: "error" })
      return
    }

    const periodValue = parsed.data

    // Verifica se o valor já foi adicionado anteriormente
    if (periods.includes(periodValue)) {
      setMessage({ text: "Este período já foi adicionado.", type: "error" });
      return
    }

    // Se estiver tudo certo, adiona o período no array
    setPeriods((prev) => [...prev, periodValue])
    setInputPeriods("")
    setMessage({ text: `Período ${inputPeriods} dias adicionado com sucesso`, type: "success" })
  }

  const handleRemove = (periodToRemove: number) => {
    setPeriods((prev) => prev.filter((n) => n !== periodToRemove))
    if (periods.length === 0) {
      setMessage({ text: "", type: "info" })
    }
    setMessage({ text: `Período ${periodToRemove} removido`, type: "info" })
  }

  const handleSave = () => {
    if (periods.length === 0) {
      setMessage({ text: "Adicione ao menos um período antes de salvar", type: "info" })
      return
    }

    setMessage({ text: `Períodos salvos: ${periods.join(", ")}`, type: "success" })
    setPeriods([])
  }
  console.log(periods)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className=" bg-white p-6 rounded-lg shadow-md w-full max-w-[900px] space-y-4">
        <h2 className="text-xl font-semibold text-center">Cadastro de Períodos</h2>
        <div>
          <Input
            type="number"
            value={inputPeriods}
            onChange={(e) => setInputPeriods(e.target.value)}
            placeholder="Digite um período"
          />
          <Button
            className="mt-2"
            onClick={handleAdd}
            disabled={!inputPeriods}
          >
            Adicionar
          </Button>
        </div>
        {message && (
          <p
            className={`text-sm 
              ${message.type === "error"
                ? "text-red-600"
                : message.type === "success"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
          >
            {message.text}
          </p>
        )}
        <div className="grid grid-cols-8 gap-2">
          {periods.map((v) => (
            <div
              key={v}
              className="flex items-center justify-between bg-muted p-1 ps-2 rounded-lg text-sm border border-gray-300"
            >
              {v} dias
              <button
                onClick={() => handleRemove(v)}
                className="flex items-center justify-between text-red-600 rounded-full w-5 h-5 "
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <Button
          onClick={handleSave}
          disabled={periods.length === 0}
          className="w-full"
        >
          Salvar todos
        </Button>
      </div>
    </div>
  )
}
