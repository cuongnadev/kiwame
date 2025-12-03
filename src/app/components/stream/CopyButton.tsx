'use client'
import { Button } from "@/app/components/ui/button/Button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonPros {
  value?: string
}

export default function CopyButton({ value }: CopyButtonPros) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    if (!value) return

    setIsCopied(true)

    navigator.clipboard.writeText(value)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }
  return (
    <Button
      icon={isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      variant="dark"
      size="sm"
      onClick={handleCopy}
      className="p-2.5!"
    />
  )
}

