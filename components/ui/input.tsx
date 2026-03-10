import * as React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, ...props }, ref) => (
    <input
      type={type}
      className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-base font-normal text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
