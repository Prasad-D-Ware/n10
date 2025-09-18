import { Resend } from "resend";
import prisma from "../db/prisma";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { ExecutionStatus } from "../generated/prisma";
import { executionEvents } from "../index";

const getCredentials = async (data : any) => {
    const credentialId = data.config.credential;
    if (!credentialId){
        throw new Error("No credentials added!");
    }
    const credential = await prisma.credential.findUnique({
        where: { id: credentialId  },
        select : {
            data : true
        },
    });

    if(!credential?.data){
        throw new Error("Credential not found");
    }

    return credential.data;
}

const executeNodes = async (workflowId : string, nodes : any, executionId : string, triggerNodeId? : string ) => {
    const actionNodes = nodes.filter((node : any) => node.type !== 'trigger');

    if (actionNodes.length === 0) {
        return;
    }

    let triggerSuccessEmitted = false;

    for (const node of actionNodes) {
        const { id : nodeId, data } = node;
        const credentialData = await getCredentials(data);

        // Emit start event for node
        executionEvents.emit("update", { executionId, nodeId, status: "RUNNING", ts: Date.now() });

        // Mark trigger as SUCCESS when the first action starts running
        if (!triggerSuccessEmitted && triggerNodeId) {
            executionEvents.emit("update", { executionId, nodeId: triggerNodeId, status: "SUCCESS", ts: Date.now() });
            triggerSuccessEmitted = true;
        }

        switch (data.type) {
            case 'resend': {
                const emailData = await executeResend(data, credentialData, executionId, nodeId);
                if (!emailData.success) {
                    throw new Error(emailData.error || 'Resend execution failed');
                }
                break;
            }
            case 'telegram':
                const telegramData = await executeTelegram(data, credentialData, executionId, nodeId);
                if (!telegramData.success) {
                    throw new Error(telegramData.error || 'Telegram execution failed');
                }
                break;
            case 'whatsapp':
                await executeWhatsapp(data, credentialData);
                break;
            case 'openai':
                await executeOpenai(data);
                break;
            case 'agent':
                await executeAgent(data);
                break;
            default:
                console.log("No Action executed");
        }

        // Emit success for node
        executionEvents.emit("update", { executionId, nodeId, status: "SUCCESS", ts: Date.now() });
    }
}

const executeResend = async (data : any, credentialData:any, executionId : string, nodeId : string ) => {

    const nodeExecution = await prisma.nodeExecution.create({
        data : {
            execution_id : executionId,
            node_id : nodeId,
            status : ExecutionStatus.RUNNING
        }
    })

    if(!nodeExecution){
        return { error : "Failed to create node execution" , success : false };
    }

    // console.log("Executing resend", data);
    const { to , body , subject } = data.config;
    const { apikey } = credentialData;

    const resend = new Resend(apikey);

    const { data : emailData , error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: to,
        subject: subject,
        text: body
    });
    
    if(error) {
        await prisma.nodeExecution.update({
            where : { id : nodeExecution.id },
            data : {
                status : ExecutionStatus.FAILED,
                ended_at : new Date(),
                error : error.message
            }
        })
        executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: error.message });
        return { error : error.message , success : false };
    }

    const updatedNodeExecution = await prisma.nodeExecution.update({
        where : { id : nodeExecution.id },
        data : {
            status : ExecutionStatus.SUCCESS,
            ended_at : new Date(),
            output : emailData as any
        }
    })

    if(!updatedNodeExecution){
        return { error : "Failed to update node execution" , success : false };
    }

    return { data : emailData , success : true };
}

const executeTelegram = async (data : any, credentialData : any, executionId : string, nodeId : string) => {
    // console.log("Executing telegram", data);

    const nodeExecution = await prisma.nodeExecution.create({
        data : {
            execution_id : executionId,
            node_id : nodeId,
            status : ExecutionStatus.RUNNING
        }
    })

    if(!nodeExecution){
        return { error : "Failed to create node execution" , success : false };
    }

    const { chatId, message } = data.config;
    const { apikey } = credentialData;

    const bot = new TelegramBot(apikey);
    let telegramData : any;
    try {
        telegramData = await bot.sendMessage(chatId, message);
        // console.log(telegramData);
    } catch (error) {
        await prisma.nodeExecution.update({
            where : { id : nodeExecution.id },
            data : {
                status : ExecutionStatus.FAILED,
                ended_at : new Date(),
                error : "Failed to send message"
            }
        })
        executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: "Failed to send message" });
        return { error : "Failed to send message" , success : false };
    }

    const updatedNodeExecution = await prisma.nodeExecution.update({
        where : { id : nodeExecution.id },
        data : {
            status : ExecutionStatus.SUCCESS,
            ended_at : new Date(),
            output : telegramData as any
        }
    })

    if(!updatedNodeExecution){
        return { error : "Failed to update node execution" , success : false };
    }

    return { data : telegramData , success : true };
}

const executeWhatsapp = async (data : any,  credentialData : any) => {
    console.log("Executing whatsapp", data);

    const { phone, message } = data;
    const { accessToken , businessAccountId } = credentialData.config;

    const url = `https://graph.facebook.com/v20.0/${businessAccountId}/messages`;

    const payload = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: {
          body: message
        }
    };

    try {
        const response = await axios.post(url, payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (response.status !== 200 || !response.data.messages) {
          throw new Error(`WhatsApp API error: ${response.data.error?.message || 'Unknown error'}`);
        }
        
        console.log('WhatsApp message sent successfully:', response.data);
    } catch (error : any) {
        console.error('WhatsApp send error:', error.response?.data || error.message);
        throw error; // Propagate to engine for failure status
    }
}

const executeOpenai = async (data : any) => {
    console.log("Executing openai", data);
}

const executeAgent = async (data : any) => {
    console.log("Executing agent", data);
}

export default executeNodes;