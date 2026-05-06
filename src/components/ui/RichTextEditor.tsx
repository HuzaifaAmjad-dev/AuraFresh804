"use client"

import { useRef, useEffect, useCallback } from "react"

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

interface Command {
  cmd: string
  label?: string
  style?: React.CSSProperties
  icon?: string
}

const COMMANDS: Command[] = [
  { cmd: "bold",                label: "B",  style: { fontWeight: 700 } },
  { cmd: "italic",              label: "I",  style: { fontStyle: "italic" } },
  { cmd: "underline",           label: "U",  style: { textDecoration: "underline" } },
  { cmd: "insertUnorderedList", icon: "ti-list" },
  { cmd: "insertOrderedList",   icon: "ti-list-numbers" },
  { cmd: "justifyLeft",         icon: "ti-align-left" },
  { cmd: "justifyCenter",       icon: "ti-align-center" },
  { cmd: "undo",                icon: "ti-arrow-back-up" },
  { cmd: "redo",                icon: "ti-arrow-forward-up" },
]

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [])

  const execCmd = useCallback((cmd: string) => {
    document.execCommand(cmd, false, undefined)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML ?? "")
  }, [onChange])

  return (
    <div className="rounded-lg border border-stone-200 overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-stone-50 border-b border-stone-200 flex-wrap">
        {COMMANDS.map(({ cmd, label, icon, style }) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCmd(cmd) }}
            className="w-8 h-8 flex items-center justify-center rounded border border-transparent
                       hover:bg-white hover:border-stone-200 text-stone-600 transition-colors text-sm"
          >
            {icon
              ? <i className={`ti ${icon}`} style={{ fontSize: 15 }} />
              : <span style={style}>{label}</span>
            }
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        data-placeholder={placeholder ?? "Describe the perfume..."}
        className="min-h-[140px] p-3 text-sm text-stone-700 leading-relaxed outline-none
                   focus:ring-2 focus:ring-amber-300 focus:ring-inset
                   empty:before:content-[attr(data-placeholder)] empty:before:text-stone-400"
      />
    </div>
  )
}