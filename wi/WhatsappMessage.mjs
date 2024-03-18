import { dirname } from "node:path"; // buildin module from `node:` schema
import { fileURLToPath } from 'node:url';

// import got from "got";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// __filename & __dirname not available in es6 files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default class WhatsappMessage {
    static httpHeaders = {
        Authorization: `Bearer ${process.env.WHATSAPP_AUTH_TOKEN}`,
        "Content-Type": "application/json"
    };
    
    constructor() {
        this.httpBody = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: process.env.WHATSAPP_TO,
            type: "template",
            template: {
                name: "test_template",
                language: {
                    code: "en_US"
                },
                components: []
            }
        };
    }

    async sendTemplateMessage({ template, to, messageHeader, messageBody, messageButton}) {
        if(template) this.httpBody.template.name = template;
        if(to) this.httpBody.to = to;
        
        if(messageHeader) this.httpBody.template.components.push(messageHeader);
        if(messageBody) this.httpBody.template.components.push(messageBody);
        if(messageButton) this.httpBody.template.components.push(messageButton);
        

        try {
            // console.log(JSON.stringify(this.httpBody));
            const result = await axios.post(process.env.WHATSAPP_URL, JSON.stringify(this.httpBody), { headers: WhatsappMessage.httpHeaders });
            return [result.data, null];
        }catch(err) {
            return [null, err.response.data];
        }
    }
}