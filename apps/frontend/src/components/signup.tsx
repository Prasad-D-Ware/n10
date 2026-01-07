import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import logo from "../assets/n10-logo.png"
import { BACKEND_URL } from "@/lib/config"
import { Loader2 } from "lucide-react"

export function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
        email: email,
        password: password
      })

      const data = response.data;

      if(!data.success){
        toast.error(data.message)
        console.log(data.error)
        return;
      }

      toast.success(data.message);
      navigate("/login");
      // console.log("Signup successful:", response.data)
      // Handle successful signup here (e.g., redirect, store token, etc.)
    } catch (error) {
      console.error("Signup failed:", error)
      // Handle signup error here
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if(token){
        navigate("/dashboard", { replace: true })
      } else {
        setIsCheckingAuth(false)
      }
    }
    
    checkAuth()
  },[navigate])

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center w-screen px-4">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center w-screen px-4">
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <img src={logo} alt="Logo" className="h-30 self-center mx-auto"/>
        <CardTitle>Signup to your account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a> */}
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleSignup} disabled={isLoading}>
          {isLoading ? "Creating account..." : "SignUp"}
        </Button>
        <div className="text-sm text-gray-500 mt-2">Already have a account? <a href="/login" className="hover:underline text-black dark:text-white">Login</a></div>
      </CardFooter>
    </Card>
    </div>
  )
}
