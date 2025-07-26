
import React, { useState, useCallback } from 'https://esm.sh/react@^19.1.0';
import Modal from './Modal.tsx';
import * as DevTools from '../utils/devtools.ts';

interface DevToolsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DevToolCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex-grow">{description}</p>
        <div className="mt-4">{children}</div>
    </div>
);

const ResultDisplay: React.FC<{ result: string, isError?: boolean }> = ({ result, isError = false }) => (
     <div className={`mt-3 p-3 rounded-md text-sm font-mono whitespace-pre-wrap break-all ${isError ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200' : 'bg-gray-200 dark:bg-gray-900/70 text-gray-800 dark:text-gray-200'}`}>
        {result}
    </div>
);

const DevToolsModal: React.FC<DevToolsModalProps> = ({ isOpen, onClose }) => {
    // State for each tool
    const [benchmarkResult, setBenchmarkResult] = useState('');
    const [caseConverterInput, setCaseConverterInput] = useState('helloWorldExample');
    const [caseConverterResult, setCaseConverterResult] = useState('');
    const [fileInspectorResult, setFileInspectorResult] = useState('');
    const [password, setPassword] = useState('');
    const [jsonInput, setJsonInput] = useState('{"key": "value", "number": 42}');
    const [jsonResult, setJsonResult] = useState({ success: true, result: '' });
    const [logLines, setLogLines] = useState<string[]>([]);
    const [newLog, setNewLog] = useState('');
    const [connectionStatus, setConnectionStatus] = useState({ checked: false, success: false, message: ''});
    const [diffText1, setDiffText1] = useState('The quick brown fox jumps over the lazy dog.');
    const [diffText2, setDiffText2] = useState('The quick brown cat leaps over the lazy dog.');
    const [diffResult, setDiffResult] = useState<{ html: string; hasDiff: boolean } | null>(null);

    const handleFileInspect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setFileInspectorResult('No file selected.');
            return;
        }
        const content = await file.text();
        const size = DevTools.getFileSize(file.size);
        const { duplicates, count } = DevTools.findDuplicateLines(content);
        let resultText = `File: ${file.name}\nSize: ${size}\n\n`;
        if (count > 0) {
            resultText += `Found ${count} duplicate line(s):\n- ${duplicates.join('\n- ')}`;
        } else {
            resultText += "No duplicate lines found.";
        }
        setFileInspectorResult(resultText);
    };
    
    const handleAddLog = () => {
        if(newLog.trim()){
            setLogLines(prev => [...prev, `${new Date().toISOString()}: ${newLog.trim()}`]);
            setNewLog('');
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
             <div className="flex flex-col h-full bg-white dark:bg-[#121212]">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Developer Tools</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A collection of utilities for technical tasks and code management.</p>
                </div>
                <div className="flex-grow p-4 md:p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CPU Benchmark */}
                        <DevToolCard title="CPU Benchmark" description="Measures client-side performance by running a series of hashing operations.">
                            <button onClick={() => setBenchmarkResult(DevTools.runCpuBenchmark())} className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Run Benchmark</button>
                            {benchmarkResult && <ResultDisplay result={benchmarkResult} />}
                        </DevToolCard>

                        {/* Case Converter */}
                        <DevToolCard title="Case Converter" description="Convert text between camelCase and snake_case.">
                           <input value={caseConverterInput} onChange={e => setCaseConverterInput(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm" />
                           <div className="flex gap-2 mt-2">
                               <button onClick={() => setCaseConverterResult(DevTools.camelToSnake(caseConverterInput))} className="w-full px-4 py-2 bg-blue-600/80 text-white text-sm font-semibold rounded-md hover:bg-blue-700/80">To snake_case</button>
                               <button onClick={() => setCaseConverterResult(DevTools.snakeToCamel(caseConverterInput))} className="w-full px-4 py-2 bg-blue-600/80 text-white text-sm font-semibold rounded-md hover:bg-blue-700/80">To CamelCase</button>
                           </div>
                           {caseConverterResult && <ResultDisplay result={caseConverterResult} />}
                        </DevToolCard>

                        {/* File Inspector */}
                        <DevToolCard title="File Inspector" description="Upload a text or log file to check its size and find any duplicate lines.">
                            <input type="file" onChange={handleFileInspect} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            {fileInspectorResult && <ResultDisplay result={fileInspectorResult} />}
                        </DevToolCard>
                        
                        {/* Password Generator */}
                        <DevToolCard title="Password Generator" description="Generate a strong, random password for your credentials.">
                            <button onClick={() => setPassword(DevTools.generateStrongPassword(16))} className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Generate Password</button>
                            {password && <ResultDisplay result={password} />}
                        </DevToolCard>

                        {/* JSON Formatter */}
                        <DevToolCard title="JSON Formatter" description="Paste in any JSON data to pretty-print and validate it.">
                            <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono"></textarea>
                            <button onClick={() => setJsonResult(DevTools.prettyJson(jsonInput))} className="mt-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Format JSON</button>
                            {jsonResult.result && <ResultDisplay result={jsonResult.result} isError={!jsonResult.success} />}
                        </DevToolCard>

                        {/* Simple Logger */}
                        <DevToolCard title="Simple Logger" description="A client-side logger. Add messages and download the log file.">
                             <div className="flex gap-2">
                                <input value={newLog} onChange={e => setNewLog(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddLog()} placeholder="Log message..." className="flex-1 w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm" />
                                <button onClick={handleAddLog} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Add</button>
                             </div>
                             {logLines.length > 0 && (
                                <>
                                 <div className="mt-3 p-2 h-24 overflow-y-auto bg-gray-200 dark:bg-gray-900/70 rounded-md text-xs font-mono">
                                     {logLines.join('\n')}
                                 </div>
                                 <button onClick={() => DevTools.downloadLog(logLines.join('\n'))} className="mt-2 w-full px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700">Download Log</button>
                                </>
                             )}
                        </DevToolCard>

                        {/* Connection Checker */}
                        <DevToolCard title="Connection Checker" description="Check if your internet connection is active.">
                             <button onClick={async () => { const status = await DevTools.checkInternetConnection(); setConnectionStatus({ ...status, checked: true }) }} className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Check Connection</button>
                             {connectionStatus.checked && <ResultDisplay result={connectionStatus.message} isError={!connectionStatus.success} />}
                        </DevToolCard>

                        {/* Text Diff Checker */}
                        <DevToolCard title="Text Diff Checker" description="Compare two blocks of text and highlight the differences.">
                            <div className="flex flex-col gap-2">
                                <textarea value={diffText1} onChange={e => setDiffText1(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm"></textarea>
                                <textarea value={diffText2} onChange={e => setDiffText2(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded-md text-sm"></textarea>
                            </div>
                            <button onClick={() => setDiffResult(DevTools.highlightDiff(diffText1, diffText2))} className="mt-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Compare Text</button>
                             {diffResult && (
                                 <div className={`mt-3 p-3 rounded-md text-sm ${!diffResult.hasDiff && 'text-center'}`} dangerouslySetInnerHTML={{ __html: diffResult.hasDiff ? diffResult.html : '<span class="text-gray-500">No differences found.</span>' }} />
                             )}
                        </DevToolCard>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DevToolsModal;
