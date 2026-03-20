export interface ModelConfig {
    id: string;
    label: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
    { id: "openrouter/free", label: "OpenRouter (Mejor Carga Disponible)" },
    { id: "google/gemma-3-27b-it:free", label: "Google Gemma 3 (27B)" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Meta LLaMA 3.3 (70B)" },
    { id: "mistralai/mistral-small-3.1-24b-instruct:free", label: "Mistral Small 3.1 (24B)" },
    { id: "minimax/minimax-m2.5:free", label: "Minimax 2.5" }
];
