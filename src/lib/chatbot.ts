import axios from 'axios';
import { queryVectorProject } from './actions';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

function arrayToString(array: any[]) {
    return array.map((item, index) => `result${index + 1}{${item}}`).join(', ');
}

class Chatbot {
    private apiKey: string;
    private baseUrl: string = 'https://api.openai.com/v1/chat/completions';
    private model: string = 'gpt-3.5-turbo';
    private conversationHistory: Message[] = [];

    constructor() {
        this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('VITE_OPENAI_API_KEY is not set in the environment variables');
        }
        this.conversationHistory.push({
            role: 'system',
            content: 'You are a helpful assistant.'
        });
    }

    async getRelevantContext(query: string, projectId: string): Promise<string> {
        const context = await queryVectorProject(query, projectId);

        const contextString = arrayToString(context.results);
        return `Relevant context for: ${contextString}`;
    }

    async sendMessage(userMessage: string, projectId: string): Promise<string> {
        const context = await this.getRelevantContext(userMessage, projectId);
        
        this.conversationHistory.push({
            role: 'system',
            content: `Use the following context to inform your response: ${context}`
        });

        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        try {
            const response = await axios.post(
                this.baseUrl,
                {
                    model: this.model,
                    messages: this.conversationHistory,
                    max_tokens: 150
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const assistantReply = response.data.choices[0].message.content;
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantReply
            });

            return assistantReply;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return 'I apologize, but I encountered an error while processing your request.';
        }
    }

    getConversationHistory(): Message[] {
        return this.conversationHistory;
    }

    clearConversationHistory(): void {
        this.conversationHistory = [{
            role: 'system',
            content: 'You are a helpful assistant.'
        }];
    }
}

export default Chatbot;