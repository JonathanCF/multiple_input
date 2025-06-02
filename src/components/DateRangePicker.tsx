"use client"

import * as React from "react"
import { format, isBefore, isAfter, setMonth, setYear, getYear, getMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ArrowLeft, ArrowRight, X, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  label: string
  date?: Date
  onDateSelect: (date: Date | undefined) => void
  className?: string
  minDate?: Date
  maxDate?: Date
  showError?: boolean
}

export function DatePickerBase({
  label,
  date,
  onDateSelect,
  className,
  minDate,
  maxDate,
  showError,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date || new Date())

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) {
      onDateSelect(undefined)
      return
    }

    if (
      (minDate && isBefore(selected, minDate)) ||
      (maxDate && isAfter(selected, maxDate))
    ) {
      return
    }

    onDateSelect(selected)
    setOpen(false)
  }

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = setMonth(currentMonth, parseInt(monthIndex))
    setCurrentMonth(newMonth)
  }

  const handleYearChange = (year: string) => {
    const newYear = setYear(currentMonth, parseInt(year))
    setCurrentMonth(newYear)
  }

  const months = [
    "Janeiro", "Fevereiro", "Março",
    "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro",
    "Outubro", "Novembro", "Dezembro"
  ]

  const currentYear = getYear(new Date())
  const startYear = minDate ? getYear(minDate) : 2024
  const endYear = maxDate ? getYear(maxDate) : currentYear
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  ).reverse()

  const CustomCaption = ({ displayMonth }: { displayMonth: Date }) => (
    <div className="flex justify-center items-center gap-2 py-2">
      <Select
        value={getMonth(displayMonth).toString()}
        onValueChange={handleMonthChange}
        disabled={!months.length}
      >
        <SelectTrigger className="w-[130px] h-8 text-sm">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem
              key={month}
              value={index.toString()}
              disabled={
                (minDate && getYear(displayMonth) === getYear(minDate) && index < getMonth(minDate)) ||
                (maxDate && getYear(displayMonth) === getYear(maxDate) && index > getMonth(maxDate))
              }
            >
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={getYear(displayMonth).toString()}
        onValueChange={handleYearChange}
        disabled={!years.length}
      >
        <SelectTrigger className="w-[80px] h-8 text-sm">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              disabled={
                (minDate && year < getYear(minDate)) ||
                (maxDate && year > getYear(maxDate))
              }
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className={cn("w-fit border rounded-lg shadow-sm", className)}>
      <div className="pb-4 px-6 pt-4">
        <h3 className="text-lg font-medium text-gray-700">{label}</h3>
      </div>
      <div className="px-6 pb-6 space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  showError && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "dd/mm/aaaa"}
              </Button>
              {date && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDateSelect(undefined)
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Limpar data</span>
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                locale={ptBR}
                initialFocus
                fromDate={minDate}
                toDate={maxDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                classNames={{
                  root: "flex flex-col",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-blue-600",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-accent rounded-md",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-blue-600 w-9 font-medium text-[0.8rem] flex items-center justify-center",
                  row: "flex w-full mt-1",
                  cell: "text-center text-sm p-1 w-9 h-9 relative [&:has([aria-selected])]:bg-blue-100",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-600",
                  day_today: "border border-blue-500",
                  day_outside: "text-muted-foreground opacity-50",
                }}
                components={{
                  Caption: CustomCaption
                }}
              />
            </div>
          </PopoverContent>
        </Popover>

        {showError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Data inválida! Verifique o intervalo selecionado.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}