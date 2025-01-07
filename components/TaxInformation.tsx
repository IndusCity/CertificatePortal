'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UseFormRegister, UseFormSetValue, Control, Controller } from 'react-hook-form'
import { FormData } from './application-form-types'
import { Card } from '@/components/ui/card'

interface TaxInformationProps {
  register: UseFormRegister<FormData>
  setValue: UseFormSetValue<FormData>
  control: Control<FormData>
  handleInputFocus: (fieldName: string) => void
  handleInputBlur: () => void
}

export function TaxInformation({
  register,
  setValue,
  control,
  handleInputFocus,
  handleInputBlur
}: TaxInformationProps) {
  // Generate years for dropdowns
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Tax Information</h3>
      <div className="space-y-6">
        {/* Number of Employees */}
        <div>
          <Label htmlFor="numEmployees" className="flex items-center">
            Number of Employees
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="numEmployees"
            type="number"
            min="0"
            {...register('numEmployees', { 
              required: "Number of employees is required",
              min: { value: 0, message: "Number of employees cannot be negative" }
            })}
            onFocus={() => handleInputFocus('numEmployees')}
            onBlur={handleInputBlur}
            className="max-w-[200px]"
          />
        </div>

        {/* Business Establishment Year */}
        <div>
          <Label className="block mb-2">
            In what year was your business established?
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Controller
            name="businessEstablishmentYear"
            control={control}
            rules={{ required: "Business establishment year is required" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                onOpenChange={() => handleInputFocus('businessEstablishmentYear')}
              >
                <SelectTrigger className="max-w-[200px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Annual Gross Receipts */}
        <div>
          <h4 className="text-lg font-medium mb-2">Annual Gross Receipts for last 3 years</h4>
          <p className="text-sm text-gray-500 mb-4">
            If your business is newer than 3 years, you may not have annual gross receipts. 
            If this is the case, enter 0 for years that you didn't file taxes.
          </p>
          <p className="text-sm text-gray-500 mb-4">Rounded off to the nearest dollar.</p>

          {/* Most Recent Year */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="mostRecentReceipts">
                Most Recent Year
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="mostRecentReceipts"
                  type="number"
                  min="0"
                  {...register('annualReceipts.mostRecent.amount', {
                    required: "Amount is required",
                    min: { value: 0, message: "Amount cannot be negative" }
                  })}
                  onFocus={() => handleInputFocus('annualReceipts.mostRecent.amount')}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
            <div>
              <Label>Year</Label>
              <Controller
                name="annualReceipts.mostRecent.year"
                control={control}
                rules={{ required: "Year is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.slice(0, 3).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* 2 Years Ago */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="twoYearsAgoReceipts">
                2 years ago
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="twoYearsAgoReceipts"
                  type="number"
                  min="0"
                  {...register('annualReceipts.twoYearsAgo.amount', {
                    required: "Amount is required",
                    min: { value: 0, message: "Amount cannot be negative" }
                  })}
                  onFocus={() => handleInputFocus('annualReceipts.twoYearsAgo.amount')}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
            <div>
              <Label>Year</Label>
              <Controller
                name="annualReceipts.twoYearsAgo.year"
                control={control}
                rules={{ required: "Year is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.slice(1, 4).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* 3 Years Ago */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="threeYearsAgoReceipts">
                3 years ago
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="threeYearsAgoReceipts"
                  type="number"
                  min="0"
                  {...register('annualReceipts.threeYearsAgo.amount', {
                    required: "Amount is required",
                    min: { value: 0, message: "Amount cannot be negative" }
                  })}
                  onFocus={() => handleInputFocus('annualReceipts.threeYearsAgo.amount')}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
            <div>
              <Label>Year</Label>
              <Controller
                name="annualReceipts.threeYearsAgo.year"
                control={control}
                rules={{ required: "Year is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.slice(2, 5).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

