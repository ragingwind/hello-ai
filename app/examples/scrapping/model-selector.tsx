'use client';

import { Check, ChevronsUpDown, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLLMStorage } from '@/app/lib/llm-storage';
import { Providers } from '@/app/lib/providers';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Model = {
  id: string;
  name: string;
  provider: string;
  icon: string;
};

// Generate models from providers data
const models: Model[] = Object.entries(Providers).flatMap(([providerName, providerData]) =>
  providerData.models.map((modelId) => ({
    id: modelId,
    name: modelId.charAt(0).toUpperCase() + modelId.slice(1).replace(/-/g, ' '),
    provider: providerName,
    icon: providerData.icon,
  })),
);

// Get list of providers
const providers = Object.entries(Providers).map(([providerName, providerData]) => ({
  name: providerName,
  icon: providerData.icon,
}));

export function ModelSelector() {
  const {
    apiKeys,
    baseURLs,
    models: savedModels,
    currentModel,
    saveApiKey,
    saveBaseURL,
    saveModel,
    saveCurrentModel,
    hasApiKey,
  } = useLLMStorage();

  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [providerPopoverOpen, setProviderPopoverOpen] = useState(false);
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedModelInDialog, setSelectedModelInDialog] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (currentModel) {
      const foundModel = models.find((m) => m.id === currentModel.id);
      if (foundModel) {
        setSelectedModel(foundModel);
      }
    } else {
      // Set default model if none saved
      setSelectedModel(models[0]);
    }
  }, [currentModel]);

  // Open API key dialog
  const openApiKeyDialog = () => {
    // If there's a currently selected model, use its provider as initial
    const initialProvider = selectedModel?.provider || providers[0].name;
    setSelectedProvider(initialProvider);
    setApiKey(apiKeys[initialProvider] || '');
    setBaseURL(baseURLs[initialProvider] || '');

    // If there's a saved model for this provider, select it
    const savedModelId = savedModels[initialProvider];
    if (savedModelId) {
      setSelectedModelInDialog(savedModelId);
    } else if (selectedModel?.provider === initialProvider) {
      setSelectedModelInDialog(selectedModel.id);
    }

    setApiKeyDialogOpen(true);
  };

  // Handle provider selection change
  const handleProviderChange = (providerName: string) => {
    setSelectedProvider(providerName);
    setApiKey(apiKeys[providerName] || '');
    setBaseURL(baseURLs[providerName] || '');

    // Load saved model for this provider if exists
    const savedModelId = savedModels[providerName];
    if (savedModelId) {
      setSelectedModelInDialog(savedModelId);
    } else {
      setSelectedModelInDialog('');
    }

    setProviderPopoverOpen(false);
  };

  // Handle model selection change in dialog
  const handleModelChange = (modelId: string) => {
    setSelectedModelInDialog(modelId);
    setModelPopoverOpen(false);
  };

  // Get models for selected provider
  const getModelsForProvider = (providerName: string) => {
    return models.filter((model) => model.provider === providerName);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Provider Select Button */}
      <Button variant="outline" onClick={openApiKeyDialog} className="flex items-center gap-2">
        {selectedModel ? (
          <>
            <span
              className="w-4 h-4 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: selectedModel.icon }}
            />
            <span>{selectedModel.name}</span>
          </>
        ) : (
          <>
            <Settings className="h-4 w-4" />
            <span>Select Model</span>
          </>
        )}
      </Button>

      {/* Provider Select Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Provider</DialogTitle>
            <DialogDescription>
              Select a provider and enter your API key and optionally a custom base URL.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <Popover open={providerPopoverOpen} onOpenChange={setProviderPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={providerPopoverOpen}
                    className="col-span-3 justify-between"
                  >
                    {selectedProvider ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 flex items-center justify-center"
                          dangerouslySetInnerHTML={{
                            __html: providers.find((p) => p.name === selectedProvider)?.icon || '',
                          }}
                        />
                        <span>{selectedProvider}</span>
                      </span>
                    ) : (
                      'Select provider...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search providers..." />
                    <CommandList>
                      <CommandEmpty>No provider found.</CommandEmpty>
                      <CommandGroup>
                        {providers.map((provider) => (
                          <CommandItem
                            key={provider.name}
                            value={provider.name}
                            onSelect={() => handleProviderChange(provider.name)}
                            className="cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className="w-4 h-4 flex items-center justify-center"
                                dangerouslySetInnerHTML={{
                                  __html: provider.icon,
                                }}
                              />
                              <span>{provider.name}</span>
                            </span>
                            <Check
                              className={`ml-auto h-4 w-4 ${
                                selectedProvider === provider.name ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={modelPopoverOpen}
                    className="col-span-3 justify-between"
                    disabled={!selectedProvider}
                  >
                    {selectedModelInDialog && selectedProvider ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 flex items-center justify-center"
                          dangerouslySetInnerHTML={{
                            __html: providers.find((p) => p.name === selectedProvider)?.icon || '',
                          }}
                        />
                        <span>{models.find((m) => m.id === selectedModelInDialog)?.name}</span>
                      </span>
                    ) : selectedProvider ? (
                      'Select model...'
                    ) : (
                      'Select provider first...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search models..." />
                    <CommandList>
                      <CommandEmpty>No model found.</CommandEmpty>
                      <CommandGroup>
                        {selectedProvider &&
                          getModelsForProvider(selectedProvider).map((model) => (
                            <CommandItem
                              key={model.id}
                              value={model.id}
                              onSelect={() => handleModelChange(model.id)}
                              className="cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-4 h-4 flex items-center justify-center"
                                  dangerouslySetInnerHTML={{
                                    __html: model.icon,
                                  }}
                                />
                                <span>{model.name}</span>
                              </span>
                              <Check
                                className={`ml-auto h-4 w-4 ${
                                  selectedModelInDialog === model.id ? 'opacity-100' : 'opacity-0'
                                }`}
                              />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={
                  selectedProvider
                    ? `Enter your ${selectedProvider} API key...`
                    : 'Enter API key...'
                }
                className="col-span-3"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="baseURL" className="text-right">
                Base URL
              </Label>
              <Input
                id="baseURL"
                type="url"
                placeholder={`Enter custom base URL (optional)...`}
                className="col-span-3"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApiKeyDialogOpen(false);
                setApiKey('');
                setBaseURL('');
                setSelectedProvider('');
                setSelectedModelInDialog('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                if (apiKey.trim() && selectedProvider) {
                  saveApiKey(selectedProvider, apiKey.trim());
                  if (baseURL.trim()) {
                    saveBaseURL(selectedProvider, baseURL.trim());
                  }

                  // Save the selected model for this provider
                  if (selectedModelInDialog) {
                    saveModel(selectedProvider, selectedModelInDialog);

                    // Update the main selected model and save it as current
                    const newSelectedModel = models.find((m) => m.id === selectedModelInDialog);
                    if (newSelectedModel) {
                      setSelectedModel(newSelectedModel);
                      saveCurrentModel(selectedProvider, selectedModelInDialog);
                    }
                  }

                  setApiKeyDialogOpen(false);
                  setApiKey('');
                  setBaseURL('');
                  setSelectedProvider('');
                  setSelectedModelInDialog('');
                }
              }}
              disabled={!apiKey.trim() || !selectedProvider}
            >
              {selectedProvider && hasApiKey(selectedProvider) ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
