import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateShortsRequestBody {
  bookTitle?: string;
  author?: string;
  topic?: string;
  fileData?: string; // base64
  fileName?: string;
  fileType?: string;
  rawText?: string;
  count?: number;
  tone?: string;
  viralTrend?: string;
  useWebSearch?: boolean;
}

// Endpoint to research trending reels and viral formats on the web with Google Search Grounding
app.post('/api/search-viral-trends', async (req, res) => {
  try {
    const { topic = 'finanzas personales y habitos', bookTitle = 'El hombre más rico de Babilonia' } = req.body;

    const prompt = `Investiga en la web las tendencias virales, audios populares, formatos de edición rápida y ganchos de alto impacto más usados hoy en TikTok, Instagram Reels y YouTube Shorts (en particular nichos de #BookTok, superación personal, finanzas y libros de desarrollo como "${bookTitle}").

Devuelve un JSON estrictamente válido con este formato:
{
  "summary": "Resumen de cómo se consumen reels virales de este tema en internet hoy",
  "trends": [
    {
      "id": "trend_1",
      "trendName": "Nombre del formato viral (ej: POV Brutal, Regla de los 3 Segundos, Cuenta Regresiva Inversa)",
      "hookTemplate": "Plantilla exacta de gancho para el inicio del reel",
      "whyViral": "Por qué este formato retiene al usuario",
      "suggestedPacing": "Rápido (CapCut) / Pausado con tensión / Cinematográfico",
      "formatCategory": "POV | Cuenta Regresiva | Pregunta Incómoda | Desafío Mental | Storytelling"
    }
  ],
  "soundVibe": "Estilo de audio recomendado (ej: Lo-Fi Chillwave, Synthwave tenso, Beat cinemático)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback structured trends if parsing failed
      parsed = {
        summary: `Tendencias actuales de alta retención para "${bookTitle}"`,
        trends: [
          {
            id: 'trend_pov',
            trendName: 'POV: La lección que el 99% ignora',
            hookTemplate: 'POV: Tienes 30 años y sigues cometiendo este error con tu dinero...',
            whyViral: 'Apela al miedo a perder el tiempo y a la curiosidad inmediata.',
            suggestedPacing: 'Rápido con subtítulos cinéticos grandes',
            formatCategory: 'POV',
          },
          {
            id: 'trend_countdown',
            trendName: 'La Regla de Oro que nadie te enseñó en la escuela',
            hookTemplate: 'El libro de 100 años que predijo por qué sigues sin dinero a fin de mes...',
            whyViral: 'Conecta sabiduría clásica con dolor financiero moderno.',
            suggestedPacing: 'Tensión creciente con beat lo-fi',
            formatCategory: 'Storytelling',
          },
          {
            id: 'trend_challenge',
            trendName: 'Desafío del 10% en 24 Horas',
            hookTemplate: 'Si ganas $1000 hoy, haz esto antes de que caiga el primer recibo.',
            whyViral: 'Acción instantánea y comprobable.',
            suggestedPacing: 'Enérgico y directo',
            formatCategory: 'Desafío Mental',
          },
        ],
        soundVibe: 'Lo-Fi Chill & Synthwave Focus',
      };
    }

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error searching viral trends:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Error al buscar tendencias virales en la web',
    });
  }
});

// Endpoint to generate educational shorts from a PDF or Book/Document with video scenes and viral web inspiration
app.post('/api/generate-shorts', async (req, res) => {
  try {
    const {
      bookTitle,
      author,
      topic,
      fileData,
      fileName,
      fileType,
      rawText,
      count = 5,
      tone = 'dinámico y productivo',
      viralTrend,
      useWebSearch = false,
    }: GenerateShortsRequestBody = req.body;

    const shortsCount = Math.min(Math.max(Number(count) || 5, 2), 10);

    const systemPrompt = `Eres un director y creador élite de Video Reels virales de YouTube Shorts e Instagram Reels (estilo MrBeast, Alex Hormozi y Ali Abdaal).
Tu misión es transformar el PDF o libro provisto en una serie de ${shortsCount} Video Reels educativos ultra-adictivos, visualmente diseñados para retención del 100%.

Cada Reel debe contener un guión completo, lección práctica, quiz de retención, y además un STORYBOARD DE ESCENAS DE VIDEO estructurado en 3 a 4 escenas visuales para animación en pantalla completa.

Devuelve estrictamente un JSON que contenga:
{
  "bookTitle": "Título del libro o documento",
  "author": "Autor identificado o estimado",
  "summary": "Resumen de 2 oraciones del libro/documento",
  "trendInspiration": "Tendencia viral de la web aplicada",
  "shorts": [
    {
      "id": "short_1",
      "title": "Título corto y llamativo con emoji (máximo 6 palabras)",
      "hook": "Gancho verbal para los primeros 3 segundos que frena el scroll en seco",
      "viralFormat": "POV Viral / Cuenta Regresiva / Storytime Revelación / Desafío 24H",
      "trendSource": "Inspirado en tendencia viral de #BookTok y Reels educativos",
      "category": "Finanzas / Hábitos / Mentalidad / Productividad",
      "readTime": "35s",
      "coreInsight": "La revelación central en 2 oraciones memorables",
      "steps": [
        "Paso 1 o revelación clave",
        "Paso 2 o ejemplo práctico",
        "Paso 3 o aplicación inmediata"
      ],
      "actionableTakeaway": "Acción concreta y medible para hoy",
      "quote": "Cita memorable del autor o del texto",
      "visualTheme": "gold | emerald | violet | indigo | rose | amber | cyan",
      "keyPhrases": ["Frase impacto 1", "Frase impacto 2", "Frase impacto 3"],
      "fullNarration": "Guión completo de locución en español natural para video (35-50 segundos)",
      "scenes": [
        {
          "sceneNumber": 1,
          "durationSec": 8,
          "headline": "EL ERROR QUE ARRUINA TUS INGRESOS",
          "subtext": "Primeros 8 segundos: gancho de impacto que despierta la curiosidad",
          "visualPreset": "gold-cascade",
          "captionWords": ["Si", "ganas", "dinero", "y", "no", "te", "pagas", "primero", "eres", "esclavo"]
        },
        {
          "sceneNumber": 2,
          "durationSec": 14,
          "headline": "LA REGLA MILENARIA DE BABILONIA",
          "subtext": "Explicación del principio del 10% intocable",
          "visualPreset": "matrix-wealth",
          "captionWords": ["De", "cada", "diez", "monedas", "guarda", "una", "para", "tu", "libertad"]
        },
        {
          "sceneNumber": 3,
          "durationSec": 10,
          "headline": "ACCIÓN INMEDIATA",
          "subtext": "Llamado a la acción que cambia tu día",
          "visualPreset": "cyber-bars",
          "captionWords": ["Transfiere", "hoy", "tu", "10%", "antes", "de", "cualquier", "gasto"]
        }
      ],
      "quiz": {
        "question": "¿Pregunta desafiante sobre el concepto explicado?",
        "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
        "correctAnswerIndex": 0,
        "explanation": "Breve explicación de por qué es la respuesta correcta."
      }
    }
  ]
}`;

    const promptText = `Crea ${shortsCount} video reels educativos basados en el siguiente material:
Título: ${bookTitle || fileName || 'Documento / Libro'}
Autor: ${author || 'No especificado'}
Tema o contexto: ${topic || 'Optimización personal y sabiduría práctica'}
Tono deseado: ${tone}
${viralTrend ? `Tendencia viral de la web a emular: "${viralTrend}"` : ''}
${rawText ? `Contenido de texto extraído:\n"""\n${rawText.slice(0, 35000)}\n"""` : ''}`;

    let contentsParts: any[] = [];

    if (fileData && fileType === 'application/pdf') {
      contentsParts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: fileData,
        },
      });
    }

    contentsParts.push({
      text: promptText,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsParts.length === 1 ? contentsParts[0].text : { parts: contentsParts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating shorts:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Error al procesar el archivo con Gemini',
    });
  }
});

// Endpoint to generate voice narration using Gemini TTS
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text, voice = 'Fenrir' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Use Gemini 3.8 Flash Lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1000),
              speechMetadata: {
                style: 'Energetic, articulate educational short narrator in Spanish',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    }

    return res.json({
      success: false,
      message: 'No audio returned, client can use Web Speech API',
    });
  } catch (err: any) {
    console.warn('TTS error (falling back to Web Speech in client):', err?.message);
    return res.json({
      success: false,
      message: err?.message || 'TTS generation unavailable',
    });
  }
});

// Endpoint for AI Deep-Dive / Q&A on a specific Reel
app.post('/api/reel-explain', async (req, res) => {
  try {
    const { shortTitle, bookTitle, concept, userQuestion } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Contexto del Short/Reel:
Libro: "${bookTitle}"
Reel: "${shortTitle}"
Concepto explicado: "${concept}"

Pregunta del usuario: "${userQuestion || '¿Cómo aplico esto en mi vida diaria en 3 pasos rápidos?'}"

Responde en español de forma vibrante, directa, ultra-práctica y estimulante en máximo 150 palabras. Usa viñetas y un consejo final memorable.`,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({
      success: true,
      answer: response.text,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Error al generar explicación',
    });
  }
});

// Mount Vite or static server
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ScrollLearn server running on http://0.0.0.0:${PORT}`);
});
