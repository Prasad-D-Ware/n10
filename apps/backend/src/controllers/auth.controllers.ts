import type { Request, Response } from "express";
import { z } from "zod"; 
import prisma from "../db/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const AuthSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Provide minimum 8 characters long!")
})

const signup = async (req : Request ,res : Response ) => {
    try {
        const { data , error } = AuthSchema.safeParse(req.body);

        if(error){
            res.json({
                success : false,
                message : "Provide Correct Inputs!",
                error
            })
            return;
        }

        const hashedPassword = await bcrypt.hash(data.password,10)

        const user = await prisma.user.create({
            data : {
                email : data.email,
                password : hashedPassword
            }
        })

        if(!user){
            res.json({
                success : false,
                message : "User not created!"
            })
            return;
        }

        res.status(200).json({
            success : true,
            message : "User created Successfully!"
        })


    } catch (error : any) {
        console.log("Error while Signing Up", error.message)
        if(error?.code === 'P2002'){
            res.json({
                success : false,
                message : "Email already exists"
            })
            return;
        }
        res.status(500).json({
            success : false,
            message : "Error while signing up",
            error : error?.message
        })
        return;
    }
}

const login = async (req : Request ,res : Response ) => {
    try {
        const { data , error } = AuthSchema.safeParse(req.body);

        if(error){
            res.json({
                success : false,
                message : "Provide Correct Inputs!",
                error
            })
            return;
        }

        const user = await prisma.user.findUnique({
            where : {
                email : data.email,
            }
        })

        if(!user){
            res.json({
                success : false,
                message : "User doesn't exist. Try a different email!"
            })
            return;
        }

        const verifiedPassword = await bcrypt.compare(data.password,user.password);

        if(!verifiedPassword){
            res.json({
                success : false,
                message : "Password Incorrect",
            })
            return;
        }

        const payload = {
            id : user.id,
            email : user.email
        }

        const token = jwt.sign(payload , process.env.JWT_SECRET!);

        res.status(200).json({
            success : true,
            message : "User Logged In Successfully!",
            token
        })
        
    } catch (error : any) {
        console.log("Error while Loging In")
        res.json({
            success : false,
            message : "Error while Logging In",
            error : error.message
        })
        return;
    }
}


export {
    signup,
    login
}