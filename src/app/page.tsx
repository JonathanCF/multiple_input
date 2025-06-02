"use client"

import React, { useState } from "react";
import { DatePickerBase } from '@/components/DateRangePicker'
import YearSelect from "@/components/year-select"
import { isAfter } from "date-fns";

export default function MultipleInput() {

  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()

  const isInvalidRange = !!startDate && !!endDate && isAfter(startDate, endDate)

  return (

    <div className="flex gap-4">
      <DatePickerBase
        label="Data Início"
        date={startDate}
        onDateSelect={setStartDate}
        maxDate={endDate}
        showError={isInvalidRange}
      />

      <DatePickerBase
        label="Data Fim"
        date={endDate}
        onDateSelect={setEndDate}
        minDate={startDate}
        showError={isInvalidRange}
      />

      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-2xl font-bold text-center">Seletor de Ano</h1>
          <YearSelect
            onYearChange={(year) => console.log(`Ano selecionado: ${year}`)}
            label="Ano"
            placeholder="Selecione o ano"
          />
        </div>
      </main>
    </div>
  )
}
