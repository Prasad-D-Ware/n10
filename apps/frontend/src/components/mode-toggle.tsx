import { Moon, Sun, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme}>
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${
        theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
      }`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
        theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
      }`} />
      <Monitor className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
        theme === "system" ? "scale-100" : "scale-0"
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}