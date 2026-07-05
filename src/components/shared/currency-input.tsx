"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

interface CurrencyInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  value: number;
  onChange: (value: number) => void;
}

/** Rupiah input: shows thousand-separated digits, reports a plain number. */
export function CurrencyInput({
  value,
  onChange,
  inputMode = "numeric",
  placeholder = "0",
  ...props
}: CurrencyInputProps) {
  const display = value ? new Intl.NumberFormat("id-ID").format(value) : "";

  return (
    <Input
      {...props}
      type="text"
      inputMode={inputMode}
      placeholder={placeholder}
      value={display}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, "");
        onChange(digits ? Number(digits) : 0);
      }}
    />
  );
}
