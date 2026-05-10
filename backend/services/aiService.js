const axios = require("axios");

// ===============================
// OPENROUTER API FUNCTION
// ===============================
async function askOpenRouter(prompt) {

    try {

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-oss-120b:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content
            .replace(/Powered by OpenRouter/gi, "")
            .trim();

    } catch (error) {

        console.log("OpenRouter Error:");
        console.log(error.response?.data || error.message);

        throw error;
    }
}

// ===============================
// GROQ FUNCTION
// ===============================
async function askGroq(prompt) {

    try {

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content
            .replace(/Powered by Groq/gi, "")
            .trim();

    } catch (error) {

        console.log("Groq Error:");
        console.log(error.response?.data || error.message);

        throw error;
    }
}

module.exports = {
    askGroq,
    askOpenRouter
};