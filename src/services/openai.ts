import axios from "axios";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generateUIComponent = async (prompt: string): Promise<string> => {
    const messages = [
        {
            role: "system",
            content: [
                "You are a UI generator.",
                "Respond only using function call format.",
                "Return valid HTML and complete CSS.",
                "Do not include any explanation, notes, or descriptions.",
                "If an image is required, use open-source URLs such as: - https://picsum.photos/400/300",
                "Do not use placeholder strings like 'path_to_image.jpg'. Always provide fully qualified image URLs in the img tag."
            ].join(" "),
        },
        {
            role: "user",
            content: prompt,
        },
    ];
    const functions = [
        {
            name: "generateUI",
            description: "Generate full HTML layout and CSS styles for the given UI prompt.",
            parameters: {
                type: "object",
                properties: {
                    head: {
                        type: "string",
                        description: "HTML <head> content including <title>, <meta>, <style>, etc.",
                    },
                    body: {
                        type: "string",
                        description: "HTML <body> content — visible layout structure.",
                    }
                },
                required: ["head", "body"],
            }
        }
    ];


    try {
        const response = await axios.post(
            API_URL,
            {
                model: "gpt-4-0613", // function-calling capable
                messages,
                functions,
                function_call: { name: "generateUI" },
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const fnCall = response.data.choices?.[0]?.message?.function_call?.arguments;
        if (!fnCall) throw new Error("Function call failed: No arguments returned.");

        const parsed = JSON.parse(fnCall);
        const { head, body } = parsed;

        return `<!DOCTYPE html>
<html lang="en">
  <head>
${head.trim()}
  </head>
  <body>
${body.trim()}
  </body>
</html>`;


    } catch (error) {
        console.error("OpenAI function call failed:", error);
        throw new Error("Failed to generate UI. Please try again.");
    }
};
