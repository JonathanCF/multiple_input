"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface YearSelectProps {
  onYearChange?: (year: string) => void
  label?: string
  placeholder?: string
}

export default function YearSelect({
  onYearChange,
  label = "Selecione o ano",
  placeholder = "Selecione um ano",
}: YearSelectProps) {
  const currentYear = Number.parseInt(format(new Date(), "yyyy"))
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]

  const [selectedYear, setSelectedYear] = useState<string>("")

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    if (onYearChange) {
      onYearChange(value)
    }
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}