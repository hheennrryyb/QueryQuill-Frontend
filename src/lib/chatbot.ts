import axios from 'axios';
import { queryVectorProject } from './actions';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

function arrayToString(array: any[]) {
    return array.map((item, index) => `\n\nContext ${index + 1}: {${item.content}}`).join(', ');
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
        return contextString;
    }

    async sendMessage(userMessage: string, projectId: string): Promise<string> {
        const context = await this.getRelevantContext(userMessage, projectId);
        console.log("The following context for the query '" + userMessage + "' was found: \n\n" + context);
        this.conversationHistory.push({
            role: 'system',
            content: `You are an AI assistant with access to a knowledge base. Your primary role is to provide accurate and helpful responses based on the context provided for each query. Please follow these guidelines:
                1. Always use the provided context to inform your answers.
                2. If the context doesn't contain relevant information, rely on your general knowledge but make it clear that you're doing so.
                3. If you're unsure or the information seems incomplete, don't hesitate to say so.
                4. Provide concise answers unless asked for more detail.
                5. If asked about source information, refer to the context but don't invent specific sources.
                6. Maintain a helpful and professional tone throughout the conversation.
                7. Context is given the the order of relevance, so the most relevant context is given first.
                Context: ${context}`
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
                    max_tokens: 250
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
            content: `You are an AI assistant with access to a knowledge base. Your primary role is to provide accurate and helpful responses based on the context provided for each query. Please follow these guidelines:
                1. Always use the provided context to inform your answers.
                2. If the context doesn't contain relevant information, rely on your general knowledge but make it clear that you're doing so.
                3. If you're unsure or the information seems incomplete, don't hesitate to say so.
                4. Provide concise answers unless asked for more detail.
                5. If asked about source information, refer to the context but don't invent specific sources.
                6. Maintain a helpful and professional tone throughout the conversation.`
        }];
    }
}

export default Chatbot;