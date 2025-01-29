"use client";

import { Input } from "./input";
import { useState } from "react";

interface NumberInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function NumberInput({ id, label, value, onChange }: NumberInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <Input
      id={id}
      type="number"
      inputMode="decimal"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="text-lg h-12"
    />
  );
}
