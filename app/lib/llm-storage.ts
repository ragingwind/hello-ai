export type LLMConfig = {
  provider: string;
  modelId: string;
  apiKey: string;
  baseURL?: string;
};

type StoredLLMData = {
  apiKeys: Record<string, string>;
  baseURLs: Record<string, string>;
  models: Record<string, string>;
  currentModel: {
    id: string;
    provider: string;
  } | null;
};

const STORAGE_KEYS = {
  API_KEYS: 'llm-api-keys',
  BASE_URLS: 'llm-base-urls',
  MODELS: 'llm-models',
  CURRENT_MODEL: 'llm-current-model',
} as const;

// biome-ignore lint/complexity/noStaticOnlyClass: This class is designed to be static for easy access
export class LLMStorage {
  private static isClient = typeof window !== 'undefined';

  static getStoredData(): StoredLLMData {
    if (!LLMStorage.isClient) {
      return {
        apiKeys: {},
        baseURLs: {},
        models: {},
        currentModel: null,
      };
    }

    const apiKeys = LLMStorage.getItem(STORAGE_KEYS.API_KEYS);
    const baseURLs = LLMStorage.getItem(STORAGE_KEYS.BASE_URLS);
    const models = LLMStorage.getItem(STORAGE_KEYS.MODELS);
    const currentModel = LLMStorage.getItem(STORAGE_KEYS.CURRENT_MODEL);

    return {
      apiKeys: apiKeys ? JSON.parse(apiKeys) : {},
      baseURLs: baseURLs ? JSON.parse(baseURLs) : {},
      models: models ? JSON.parse(models) : {},
      currentModel: currentModel ? JSON.parse(currentModel) : null,
    };
  }

  static saveApiKey(provider: string, apiKey: string): void {
    if (!LLMStorage.isClient) return;

    const data = LLMStorage.getStoredData();
    data.apiKeys[provider] = apiKey;
    LLMStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(data.apiKeys));
  }

  static saveBaseURL(provider: string, baseURL: string): void {
    if (!LLMStorage.isClient) return;

    const data = LLMStorage.getStoredData();
    data.baseURLs[provider] = baseURL;
    LLMStorage.setItem(STORAGE_KEYS.BASE_URLS, JSON.stringify(data.baseURLs));
  }

  static saveModel(provider: string, modelId: string): void {
    if (!LLMStorage.isClient) return;

    const data = LLMStorage.getStoredData();
    data.models[provider] = modelId;
    LLMStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(data.models));
  }

  static saveCurrentModel(provider: string, modelId: string): void {
    if (!LLMStorage.isClient) return;

    const currentModel = { id: modelId, provider };
    LLMStorage.setItem(STORAGE_KEYS.CURRENT_MODEL, JSON.stringify(currentModel));
  }

  static getApiKey(provider: string): string | null {
    const data = LLMStorage.getStoredData();
    return data.apiKeys[provider] || null;
  }

  static getBaseURL(provider: string): string | null {
    const data = LLMStorage.getStoredData();
    return data.baseURLs[provider] || null;
  }

  static getModel(provider: string): string | null {
    const data = LLMStorage.getStoredData();
    return data.models[provider] || null;
  }

  static getCurrentModel(): { id: string; provider: string } | null {
    const data = LLMStorage.getStoredData();
    return data.currentModel;
  }

  static hasApiKey(provider: string): boolean {
    const apiKey = LLMStorage.getApiKey(provider);
    return apiKey !== null && apiKey.trim().length > 0;
  }

  static getLLMConfig(): LLMConfig | null {
    const currentModel = LLMStorage.getCurrentModel();
    if (!currentModel) return null;

    const apiKey = LLMStorage.getApiKey(currentModel.provider);
    if (!apiKey) return null;

    return {
      provider: currentModel.provider,
      modelId: currentModel.id,
      apiKey,
      baseURL: LLMStorage.getBaseURL(currentModel.provider) || undefined,
    };
  }

  static clearProviderData(provider: string): void {
    if (!LLMStorage.isClient) return;

    const data = LLMStorage.getStoredData();
    delete data.apiKeys[provider];
    delete data.baseURLs[provider];
    delete data.models[provider];

    LLMStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(data.apiKeys));
    LLMStorage.setItem(STORAGE_KEYS.BASE_URLS, JSON.stringify(data.baseURLs));
    LLMStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(data.models));

    // Clear current model if it belongs to this provider
    if (data.currentModel?.provider === provider) {
      LLMStorage.removeItem(STORAGE_KEYS.CURRENT_MODEL);
    }
  }

  static clearAllData(): void {
    if (!LLMStorage.isClient) return;

    Object.values(STORAGE_KEYS).forEach((key) => {
      LLMStorage.removeItem(key);
    });
  }

  private static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail on storage errors
    }
  }

  private static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail on storage errors
    }
  }
}

// Hook for React components
export function useLLMStorage() {
  const data = LLMStorage.getStoredData();

  return {
    ...data,
    saveApiKey: LLMStorage.saveApiKey,
    saveBaseURL: LLMStorage.saveBaseURL,
    saveModel: LLMStorage.saveModel,
    saveCurrentModel: LLMStorage.saveCurrentModel,
    getApiKey: LLMStorage.getApiKey,
    getBaseURL: LLMStorage.getBaseURL,
    getModel: LLMStorage.getModel,
    getCurrentModel: LLMStorage.getCurrentModel,
    hasApiKey: LLMStorage.hasApiKey,
    getLLMConfig: LLMStorage.getLLMConfig,
    clearProviderData: LLMStorage.clearProviderData,
    clearAllData: LLMStorage.clearAllData,
  };
}
