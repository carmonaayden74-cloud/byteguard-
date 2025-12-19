import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { messages, apiKey: clientApiKey } = await req.json();
        const apiKey = clientApiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                role: 'assistant',
                content: "⚠️ **Modo Demo**: No se detectó una API Key de OpenAI.\n\nPara activar mi inteligencia completa, puedes agregar tu API Key en la configuración (⚙️) del chat o en el archivo `.env.local`.\n\nPor ahora, soy **Ayden IA** en modo demostración. ¿En qué puedo ayudarte?"
            });
        }

        // 2. Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Or 'gpt-4o' if available
                messages: [
                    {
                        role: "system",
                        content: "Eres Ayden IA, un experto en ciberseguridad y programación. Tu objetivo es ayudar a los usuarios a aprender, protegerse y escribir mejor código. Responde siempre de manera profesional, útil y segura. Si te preguntan algo ilegal (como hackear sin permiso), explica los conceptos educativos pero niégate a dar herramientas ofensivas."
                    },
                    ...messages
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            throw new Error(data.error.message);
        }

        return NextResponse.json({
            role: 'assistant',
            content: data.choices[0].message.content
        });

    } catch (error) {
        console.error('AI Error:', error);
        return NextResponse.json(
            { error: 'Error procesando la solicitud IA.' },
            { status: 500 }
        );
    }
}
