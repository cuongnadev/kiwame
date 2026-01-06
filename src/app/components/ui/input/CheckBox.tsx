import { HelpCircle } from "lucide-react"
import { ChangeEvent } from "react"

export interface CheckBoxPros {
    checked: boolean,
    onCheckedChange: (e: ChangeEvent<HTMLInputElement>) => void,
    label?: string,
    className?: string,
    all?: boolean
}

export function CheckBox(
    { checked, onCheckedChange, label, className, all }: CheckBoxPros
) {
    return (
        <label className={`flex items-start gap-3 cursor-pointer group ${className}`}>
            <div className="relative flex-shrink-0 mt-0.5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onCheckedChange}
                    className={`w-5 h-5 appearance-none rounded border-2 cursor-pointer transition-all ${checked
                        ? 'bg-white border-white'
                        : 'bg-transparent border-gray-400'
                        }`}
                />
                {checked && (
                    all ? (
                        < svg
                            className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5 10H15"
                                stroke="black"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 10L8.5 12.5L14 7"
                                stroke="black"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )
                )}

            </div>
            {
                label && (<div className="flex items-center gap-2 flex-1">
                    <span className="text-white">{label}</span>
                    <button className="hover:bg-gray-700 rounded-full p-1 transition-colors">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                    </button>
                </div>)
            }
        </label >
    )
}
