import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { MetricsBar } from './components/MetricsBar';
import { AdvancedOptionsDrawer } from './components/AdvancedOptionsDrawer';
import { EditorPlayground } from './components/EditorPlayground';
import { SecuritySettingsModal } from './components/SecuritySettingsModal';
import { SAMPLE_CODES } from './config/sampleCodes';
import { getEffectiveConfig } from './config/presets';
import { obfuscatorClient } from './workers/workerBridge';
import type { PresetTier, ObfuscatorConfig, SecurityOptions, MetricsData } from './types/obfuscator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'batch'>('playground');
  const [inputCode, setInputCode] = useState<string>(SAMPLE_CODES.basic);
  const [outputCode, setOutputCode] = useState<string>('');
  const [preset, setPreset] = useState<PresetTier>('balanced');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<MetricsData | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // Security state
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [securityOptions, setSecurityOptions] = useState<SecurityOptions>({
    domainLock: [],
    selfDefending: false,
    debugProtection: false,
    debugProtectionInterval: 0,
  });

  // Advanced toggles
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [advancedOverrides, setAdvancedOverrides] = useState<Partial<ObfuscatorConfig>>({});

  const handleRunObfuscation = useCallback(async () => {
    setIsProcessing(true);
    setErrorMessage(undefined);

    const config = getEffectiveConfig(preset, securityOptions, advancedOverrides);

    try {
      const res = await obfuscatorClient.obfuscate(inputCode, config);
      if (res.success && res.code !== undefined) {
        setOutputCode(res.code);
        setMetrics(res.metrics);
      } else {
        setErrorMessage(res.error || 'Transformation failed.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(false);
    }
  }, [inputCode, preset, securityOptions, advancedOverrides]);

  const handleCancel = () => {
    obfuscatorClient.terminate();
    setIsProcessing(false);
    setErrorMessage('Transformation cancelled.');
  };

  const handlePresetSelect = (newPreset: PresetTier) => {
    setPreset(newPreset);
    setAdvancedOverrides({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenExport={() => alert('Export Config modal available in Task 7')}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onRunSandbox={() => alert('Sandbox Runner modal available in Task 7')}
        isProcessing={isProcessing}
        onObfuscate={handleRunObfuscation}
        onCancel={handleCancel}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col space-y-4">
        {activeTab === 'playground' ? (
          <>
            {/* Presets */}
            <PresetSelector
              currentPreset={preset}
              onSelect={handlePresetSelect}
              disabled={isProcessing}
            />

            {/* Advanced knobs */}
            <AdvancedOptionsDrawer
              config={getEffectiveConfig(preset, securityOptions, advancedOverrides)}
              onChange={(updates) => setAdvancedOverrides((prev) => ({ ...prev, ...updates }))}
              isOpen={isAdvancedOpen}
              onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
            />

            {/* Metrics */}
            <MetricsBar metrics={metrics} error={errorMessage} isProcessing={isProcessing} />

            {/* Editor Playground */}
            <EditorPlayground
              inputCode={inputCode}
              onInputChange={setInputCode}
              outputCode={outputCode}
              isProcessing={isProcessing}
              onSampleSelect={(key) => setInputCode(SAMPLE_CODES[key])}
            />
          </>
        ) : (
          <div className="border border-slate-800 rounded-2xl bg-slate-900/60 p-12 text-center text-slate-400">
            Batch Processor component is being wired in Task 6.
          </div>
        )}
      </main>

      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        security={securityOptions}
        onChange={setSecurityOptions}
      />
    </div>
  );
}
