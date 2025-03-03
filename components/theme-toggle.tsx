"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-0 rotate-0 scale-100" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100 rotate-90 scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

