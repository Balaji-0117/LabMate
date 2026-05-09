const {
    askGroq,
    askOpenRouter
} = require("../services/aiService");

const chatWithAI = async (req, res) => {

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            error: "Message is required"
        });
    }

    try {

        // PRIMARY → GROQ
        const groqReply = await askGroq(message);

        return res.json({
            provider: "Groq",
            reply: groqReply
        });

    } catch (groqError) {

        console.log("Groq Failed -> Switching to OpenRouter");

        try {

            // FALLBACK → OPENROUTER
            const openRouterReply = await askOpenRouter(message);

            return res.json({
                provider: "OpenRouter",
                reply: openRouterReply
            });

        } catch (openRouterError) {

            console.log(openRouterError);

            return res.status(500).json({
                error: "Both Groq and OpenRouter failed"
            });
        }
    }
};

module.exports = {
    chatWithAI
};