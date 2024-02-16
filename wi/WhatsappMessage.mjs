import { dirname } from "node:path"; // buildin module from `node:` schema
import { fileURLToPath } from 'node:url';

// import got from "got";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// __filename & __dirname not available in es6 files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// HTTP HEADER
// const httpHeaders = {
//     Authorization: `Bearer ${process.env.WHATSAPP_AUTH_TOKEN}`,
//     "Content-Type": "application/json"
// }

// HTTP BODY
const httpBody = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: process.env.WHATSAPP_TO,
    type: "template",
    template: {
        name: "test_template",
        language: {
            code: "en_US"
        },
        components: [
            // {
            //     type: "header",
            //     parameters: [
            //         {
            //             type: "text",
            //             text: "" // Product's Name
            //         }
            //     ]
            // },
            // {
            //     type: "body",
            //     parameters: [
            //         {
            //             type: "text",
            //             text: "" // User's Name
            //         },
            //         {
            //             type: "text",
            //             text: "" // Product's description
            //         }
            //     ]
            // },
            // {
            //     type: "button",
            //     sub_type: "url", // Type of button
            //     index: 0, // Index of button
            //     parameters: [
            //         {
            //             type: "text",
            //             text: "" // Product's slug
            //         }
            //     ]
            // }
        ]
    }
}

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

    // static messageHeader = {
    //     type: "header",
    //     parameters: messageHeaderParams
    // };
    // static messageBody = {
    //     type: "body",
    //     parameters: messageBodyParams
    // };
    // static messageButton = {
    //     type: "button",
    //     sub_type: "url", // Button Type
    //     index: 0, // Button Index
    //     parameters: messageButtonParams
    // };

    async sendTemplateMessage({ template, to, messageHeader, messageBody, messageButton}) {
        if(template) this.httpBody.template.name = template;
        if(to) this.httpBody.to = to;
        
        if(messageHeader) this.httpBody.template.components.push(messageHeader);
        if(messageBody) this.httpBody.template.components.push(messageBody);
        if(messageButton) this.httpBody.template.components.push(messageButton);
        

        try {
            const result = await axios.post(process.env.WHATSAPP_URL, JSON.stringify(this.httpBody), { headers: WhatsappMessage.httpHeaders });
            return [result.data, null];
        }catch(err) {
            return [null, err.response.data];
        }


        // return new Promise(async (resolve, reject) => {
        //     try{
        //         const result = await axios.post(process.env.WHATSAPP_URL, JSON.stringify(this.httpBody), { headers: WhatsappMessage.httpHeaders })
        //         resolve(result.data);
        //     }catch(err) {
        //         reject(err.response.data);
        //     }
        // });
        
    }
}



export async function sendMessage (product) {
    const username = "Salman";
    const { slug, name, description } = product;

    const messageHeader = {
        type: "header",
        parameters: [
            {
                type: "text",
                text: name // Product name
            }
        ]
    };
    const messageBody = {
        type: "body",
        parameters: [
            {
                type: "text",
                text: username // User name
            },
            {
                type: "text",
                text: description.join("\\n") // Product Description
            }
        ]
    };
    const messageButton = {
        type: "button",
        sub_type: "url", // Button Type
        index: 0, // Button Index
        parameters: [
            {
                type: "text",
                text: slug 
            }
        ]
    };

    httpBody.template.components.push(messageHeader);
    httpBody.template.components.push(messageBody);
    httpBody.template.components.push(messageButton);

    return new Promise(async (resolve, reject) => {
        try{
            const result = await axios.post(process.env.WHATSAPP_URL, JSON.stringify(httpBody), { headers: httpHeaders })
            resolve(result.data);
        }catch(err) {
            reject(err.response.data);
        }
    });

    // try {

    //     axios.post(process.env.WHATSAPP_URL, JSON.stringify(httpBody), {
    //       headers: httpHeaders
    //     })
    //       .then(response => console.log(response.data))
    //       .catch(err => {
    //         console.log(err.response);
    //     });

    //     console.log(response.data);
        
    //     // const response = await got.post(process.env.WHATSAPP_URL, {
    //     //     json: httpBody
    //     // });
    //     // console.log("write");
    //     // console.log(process.cwd());
    //     // // await fs.writeFile("./../request.json", JSON.stringify(httpBody, null, 2));
    //     // fs.writeFileSync(path.join(__dirname, "./../data/response.json"), JSON.stringify(httpBody, null, 2));
    //     // console.log(process.cwd());
    //     // console.log("Done writing");
   
    // }catch(err){
    //     console.log(`Error: ${err.message}`);
    //     console.log(err);
    // }
};