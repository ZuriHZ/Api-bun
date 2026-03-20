export interface ModelConfig {
    id: string;
    label: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
    { id: "openrouter/free", label: "✨ Auto Elige (Recomendado)" },
    { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1 (Raciocinio)" },
    { id: "deepseek/deepseek-chat:free", label: "DeepSeek V3 (Chat)" },
    { id: "google/gemma-3-27b-it:free", label: "Google Gemma 3 (27B)" },
    {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        label: "Meta LLaMA 3.3 (70B)",
    },
    { id: "qwen/qwen-2.5-72b-instruct:free", label: "Qwen 2.5 (72B)" },
    {
        id: "mistralai/mistral-small-24b-instruct-2501:free",
        label: "Mistral Small 3.1",
    },
    {
        id: "microsoft/phi-3-medium-4k-instruct:free",
        label: "Microsoft Phi-3 Medium",
    },
    { id: "minimax/minimax-m2.5:free", label: "MiniMax M2.5" },
];
