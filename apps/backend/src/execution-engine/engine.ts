import { Resend } from "resend";
import prisma from "../db/prisma";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const getCredentials = async (data : any) => {
    const credentialId = data.config.credential;
    if (!credentialId){
        return new Error("No credentials added!");
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

const executeNodes = async (workflowId : string, nodes : any ) => {
    const actionNodes = nodes.filter((node : any) => node.type !== 'trigger');
    
    actionNodes.forEach(async (node : any) => {
        const { data } = node;
        const credentialData = await getCredentials(data);
       
        switch(data.type){
            case 'resend':
                await executeResend(data , credentialData);
                break;
            case 'telegram':
                await executeTelegram(data,credentialData);
                break;
            case 'whatsapp':
                await executeWhatsapp(data,credentialData);
                break;
            case 'openai':
                await executeOpenai(data);
                break;
            case 'agent':
                await executeAgent(data);
                break;
            case "default" : 
                console.log("No Action executed")
        }
    });
}

const executeResend = async (data : any, credentialData:any ) => {
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
        return error;
    }

    return emailData;
}

const executeTelegram = async (data : any, credentialData : any) => {
    // console.log("Executing telegram", data);

    const { chatId, message } = data.config;
    const { apikey } = credentialData;

    const bot = new TelegramBot(apikey);

    await bot.sendMessage(chatId, message);
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