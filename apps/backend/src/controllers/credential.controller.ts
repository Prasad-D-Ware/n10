import { type Request, type Response } from "express";
import { z } from "zod";
import prisma from "../db/prisma";

const createCredentialSchema = z.object({
    name : z.string(),
    application : z.string(),
    data : z.object()
})

const createCredential = async(req : Request,res : Response) => {
    try {
        const { data , error } = createCredentialSchema.safeParse(req.body);
        
        // TODO : get the userid from the token
        const user_id = "";

        if(error){
            res.json({
                success : false,
                message : "Provide Correct Inputs!",
                error
            })
            return;
        }

        const credential = await prisma.credential.create({
            data : {
                user_id,
                name : data.name,
                application : data.application,
                data: data.data
            }
        })

        if(!credential){
            res.json({
                success : false,
                message : "Credential adding failed!"
            })
            return;
        }

        res.status(200).json({
            success : true,
            message : "Credentials added Successfully!"
        })

    } catch (error: any) {
        res.status(500).json({
            success : false,
            message : "Error while creating credential",
            error : error?.message
        })
        return;
    }
}

const getAllCredentials = async(req : Request,res : Response) => {
    try {

        // TODO : get the userid from the token
        const user_id = ""

        const credentials = await prisma.credential.findMany({
            where : {
                user_id
            }
        })

        if(credentials.length === 0){
            res.json({
                success : false,
                message : "No credentials yet!"
            })
            return;
        }

        res.status(200).json({
            success : true,
            message : "User created Successfully!",
            credentials
        })

    } catch (error: any) {
        res.status(500).json({
            success : false,
            message : "Error while getting credentials",
            error : error?.message
        })
        return;
    }
}



export {
    createCredential,
    getAllCredentials
}