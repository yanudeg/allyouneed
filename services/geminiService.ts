
import { GoogleGenAI, Type } from "@google/genai";
import { StockItem, WasteItem } from "../types";

const getAI = () => {
  const key = process.env.API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

export const getInventoryInsights = async (stock: StockItem[], waste: WasteItem[]) => {
  try {
    const ai = getAI();
    if (!ai) return getDefaultInsights();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este inventario y genera 3 consejos cortos:
      Stock: ${JSON.stringify(stock.map(s => ({n: s.name, u: s.units, m: s.minStock})))}
      Mermas: ${JSON.stringify(waste)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ["title", "content"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Insight Error:", error);
    return getDefaultInsights();
  }
};

const getDefaultInsights = () => [
  { title: "Stock Inteligente", content: "Los niveles actuales son saludables. Mantén el monitoreo en perecederos." },
  { title: "Control de Mermas", content: "Registra cada merma para que la IA identifique patrones de pérdida semanal." },
  { title: "Recomendación", content: "Considera automatizar pedidos de secos para liberar tiempo en cocina." }
];

export const scanInvoice = async (base64Image: string) => {
  try {
    const ai = getAI();
    if (!ai) throw new Error("No API Key");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Extrae: nombre producto, cantidad (num), precio unitario (num). Devuelve JSON Array." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              price: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Invoice Scan Error:", error);
    return [];
  }
};
