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
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/login", {
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
      localStorage.setItem("token" , data.token);
      navigate("/dashboard");
      // console.log("Login successful:", response.data)
      // Handle successful login here (e.g., redirect, store token, etc.)
    } catch (error) {
      console.error("Login failed:", error)
      // Handle login error here
    }
  }

  return (
    <div className="h-screen flex items-center justify-center w-screen">
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
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
        <Button type="submit" className="w-full" onClick={handleLogin}>
          Login
        </Button>
        <div className="text-sm text-gray-500 mt-2">Dont have a account? <a href="/signup" className="hover:underline text-black">SignUp</a></div>
      </CardFooter>
    </Card>
    </div>
  )
}
