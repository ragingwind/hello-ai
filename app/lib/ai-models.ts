import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

interface ModelConfig {
  apiKey: string;
  baseURL?: string;
}

// Individual create functions for each provider
function createOpenAIModel(modelId: string, config: ModelConfig): LanguageModel {
  const openaiProvider = createOpenAI({
    apiKey: config.apiKey,
    ...(config.baseURL && { baseURL: config.baseURL }),
  });
  return openaiProvider(modelId);
}

function createAnthropicModel(modelId: string, config: ModelConfig): LanguageModel {
  const anthropicProvider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: 'https://api.anthropic.com/v1',
  });
  return anthropicProvider(modelId);
}

function createGoogleModel(modelId: string, config: ModelConfig): LanguageModel {
  const googleProvider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  });
  return googleProvider(modelId);
}

function createMistralModel(modelId: string, config: ModelConfig): LanguageModel {
  const mistralProvider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: 'https://api.mistral.ai/v1',
  });
  return mistralProvider(modelId);
}

function createDeepSeekModel(modelId: string, config: ModelConfig): LanguageModel {
  const deepseekProvider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });
  return deepseekProvider(modelId);
}

function createGrokModel(modelId: string, config: ModelConfig): LanguageModel {
  const grokProvider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: 'https://api.x.ai/v1',
  });
  return grokProvider(modelId);
}

function createAlibabaModel(modelId: string, config: ModelConfig): LanguageModel {
  const alibabaProvider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  });
  return alibabaProvider(modelId);
}

function createCustomModel(modelId: string, config: ModelConfig): LanguageModel {
  if (!config.baseURL) {
    throw new Error('Custom provider requires a baseURL');
  }
  const customProvider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
  return customProvider(modelId);
}

// Main function to create model instance based on provider
export function createModel(
  provider: string,
  modelId: string,
  apiKey: string,
  baseURL?: string,
): LanguageModel {
  const config: ModelConfig = { apiKey, baseURL };

  switch (provider.toLowerCase()) {
    case 'openai':
      return createOpenAIModel(modelId, config);
    case 'anthropic':
      return createAnthropicModel(modelId, config);
    case 'google':
      return createGoogleModel(modelId, config);
    case 'mistral':
      return createMistralModel(modelId, config);
    case 'deepseek':
      return createDeepSeekModel(modelId, config);
    case 'grok':
      return createGrokModel(modelId, config);
    case 'alibaba':
      return createAlibabaModel(modelId, config);
    case 'custom':
      return createCustomModel(modelId, config);
    default:
      throw new Error(
        `Unsupported provider: ${provider}. Supported providers: OpenAI, Anthropic, Google, Mistral, DeepSeek, Grok, Alibaba, Custom`,
      );
  }
}

// Export individual create functions for direct use
export {
  createOpenAIModel,
  createAnthropicModel,
  createGoogleModel,
  createMistralModel,
  createDeepSeekModel,
  createGrokModel,
  createAlibabaModel,
  createCustomModel,
};
