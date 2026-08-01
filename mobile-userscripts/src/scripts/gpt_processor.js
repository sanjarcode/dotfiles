import OpenAI from 'openai';

// Tasker global functions are available globally in the browser sandbox environment
const apiKey = global('OpenaiApiKey'); 

async function runPrompt() {
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    // Your LLM logic here...
}
