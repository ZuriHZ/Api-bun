export interface ModelConfig {
    id: string;
    label: string;
}

const Models = [
    "nvidia/nemotron-3-super-120b-a12b:free",
    "minimax/minimax-m2.5:free",
    "openrouter/free",
    "stepfun/step-3.5-flash:free",
    "arcee-ai/trinity-large-preview:free",
    "liquid/lfm-2.5-1.2b-thinking:free",
    "liquid/lfm-2.5-1.2b-instruct:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "arcee-ai/trinity-mini:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "openai/gpt-oss-120b:free",
    "openai/gpt-oss-20b:free",
    "z-ai/glm-4.5-air:free",
    "qwen/qwen3-coder:free",
    "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    "google/gemma-3n-e2b-it:free",
    "google/gemma-3n-e4b-it:free",
    "qwen/qwen3-4b:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "google/gemma-3-4b-it:free",
    "google/gemma-3-12b-it:free",
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
];

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
    {
        id: "nvidia/nemotron-3-super-120b-a12b:free",
        label: "NVIDIA Nemotron 3 Super",
    },
    { id: "stepfun/step-3.5-flash:free", label: "StepFun 3.5 Flash" },
    {
        id: "arcee-ai/trinity-large-preview:free",
        label: "Arcee AI Trinity Large",
    },
    {
        id: "liquid/lfm-2.5-1.2b-thinking:free",
        label: "Liquid LFM 2.5 Thinking",
    },
    {
        id: "liquid/lfm-2.5-1.2b-instruct:free",
        label: "Liquid LFM 2.5 Instruct",
    },
    {
        id: "nvidia/nemotron-3-nano-30b-a3b:free",
        label: "NVIDIA Nemotron 3 Nano 30B",
    },
    { id: "arcee-ai/trinity-mini:free", label: "Arcee AI Trinity Mini" },
    {
        id: "nvidia/nemotron-nano-12b-v2-vl:free",
        label: "NVIDIA Nemotron Nano 12B V2 VL",
    },
    { id: "qwen/qwen3-next-80b-a3b-instruct:free", label: "Qwen 3 Next 80B" },
    {
        id: "nvidia/nemotron-nano-9b-v2:free",
        label: "NVIDIA Nemotron Nano 9B V2",
    },
    { id: "openai/gpt-oss-120b:free", label: "OpenAI GPT-OSS 120B" },
    { id: "openai/gpt-oss-20b:free", label: "OpenAI GPT-OSS 20B" },
    { id: "z-ai/glm-4.5-air:free", label: "Z-AI GLM-4.5 Air" },
    { id: "qwen/qwen3-coder:free", label: "Qwen 3 Coder" },
    {
        id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        label: "Dolphin Mistral 24B",
    },
    { id: "google/gemma-3n-e2b-it:free", label: "Google Gemma 3n E2B" },
    { id: "google/gemma-3n-e4b-it:free", label: "Google Gemma 3n E4B" },
    { id: "qwen/qwen3-4b:free", label: "Qwen 3 4B" },
    {
        id: "mistralai/mistral-small-3.1-24b-instruct:free",
        label: "Mistral Small 3.1 24B",
    },
    { id: "google/gemma-3-4b-it:free", label: "Google Gemma 3 4B" },
    { id: "google/gemma-3-12b-it:free", label: "Google Gemma 3 12B" },
    { id: "meta-llama/llama-3.2-3b-instruct:free", label: "Meta LLaMA 3.2 3B" },
    {
        id: "nousresearch/hermes-3-llama-3.1-405b:free",
        label: "Hermes 3 LLaMA 3.1 405B",
    },
];
