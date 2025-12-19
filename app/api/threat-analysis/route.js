import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { code, apiKey: clientApiKey } = await req.json();
        const apiKey = clientApiKey || process.env.OPENAI_API_KEY;

        if (!code) {
            return NextResponse.json({ error: 'Code or text to analyze is required' }, { status: 400 });
        }

        if (!apiKey) {
            return NextResponse.json({
                error: 'API Key Missing',
                message: 'No se detectó una API Key de OpenAI. Por favor configura tu API Key en el archivo .env.local o en la configuración de la app.'
            }, { status: 401 });
        }

        const systemPrompt = `You are an expert Cyber Security Analyst AI (Ayden IA). 
        Your task is to analyze the provided code snippet or text for security threats, malware patterns, obfuscation, or vulnerabilities.
        
        Analyze strict and professionally. Return a JSON object with the following structure (do NOT return markdown, just the JSON):
        {
            "riskScore": (integer 0-100),
            "threatLevel": ("LOW", "MEDIUM", "HIGH", "CRITICAL"),
            "threatColor": (hex color code),
            "summary": (brief string summary of findings),
            "detectedPatterns": [
                { "name": "Pattern Name", "severity": "low/medium/high/critical", "description": "Short explanation" }
            ],
            "recommendation": (string advice)
        }`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Analyze this code/text:\n\n${code.substring(0, 4000)}` } // Limit length
                ],
                temperature: 0.1, // Low temp for consistent analysis
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        let analysisResult;
        try {
            // Parse the JSON string from AI response
            analysisResult = JSON.parse(data.choices[0].message.content);
        } catch (e) {
            // Fallback if AI didn't return valid JSON
            analysisResult = {
                riskScore: 0,
                threatLevel: "UNKNOWN",
                threatColor: "#888",
                summary: "AI response format error. However, the content was: " + data.choices[0].message.content,
                detectedPatterns: [],
                recommendation: "Please try again."
            };
        }

        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error('Threat Analysis Error:', error);
        return NextResponse.json(
            { error: 'Analysis Failed', message: error.message },
            { status: 500 }
        );
    }
}
