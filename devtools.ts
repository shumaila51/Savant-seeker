
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';
import { sha256 } from 'js-sha256';

export const runCpuBenchmark = (): string => {
    const text = 'Savant Seeker Benchmark'.repeat(100);
    const iterations = 5000;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        sha256(text + i);
    }
    const end = performance.now();
    const duration = (end - start).toFixed(2);
    return `Completed ${iterations} SHA-256 hashes in ${duration} ms.`;
};

export const camelToSnake = (text: string): string => {
    if (!text) return '';
    return text.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, '');
};

export const snakeToCamel = (text: string): string => {
    if (!text) return '';
    return text.toLowerCase().replace(/(_\w)/g, m => m.toUpperCase().substr(1));
};

export const findDuplicateLines = (fileContent: string): { duplicates: string[], count: number } => {
    const lines = fileContent.split('\n');
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    lines.forEach(line => {
        if (line.trim() !== '') {
            if (seen.has(line)) {
                duplicates.add(line);
            } else {
                seen.add(line);
            }
        }
    });
    return { duplicates: Array.from(duplicates), count: duplicates.size };
};

export const generateStrongPassword = (length: number = 16): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?";
    let password = "";
    // Ensure at least one of each character type for strength
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*()-_=+[]{}|;:,.<>?"[Math.floor(Math.random() * 28)];

    for (let i = 4; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    // Shuffle the password to randomize character positions
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export const prettyJson = (data: string): { success: boolean, result: string } => {
    try {
        const parsed = JSON.parse(data);
        return { success: true, result: JSON.stringify(parsed, null, 4) };
    } catch (error) {
        if (error instanceof Error) {
           return { success: false, result: `Invalid JSON: ${error.message}` };
        }
        return { success: false, result: 'An unknown error occurred while parsing JSON.'};
    }
};

export const downloadLog = (logContent: string, filename: string = "savant-seeker-log.txt") => {
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


export const checkInternetConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
        // Use a reliable, CORS-friendly endpoint for the check.
        // A 204 response is lightweight and indicates success without transferring data.
        const response = await fetch('https://www.google.com/generate_204', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
        });
        // Note: With no-cors, we can't read status, but a successful fetch promise resolution is a good sign.
        return { success: true, message: "Internet connection appears to be online." };
    } catch (error) {
        return { success: false, message: "Internet connection appears to be offline." };
    }
};

export const getFileSize = (size: number): string => {
    if (size === 0) return '0 Bytes';
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${parseFloat((size / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
};

export const highlightDiff = (text1: string, text2: string): { html: string, hasDiff: boolean } => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diff);

    let hasDiff = false;
    const html = diff.map(([op, data]) => {
        const escapedData = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        switch (op) {
            case DIFF_INSERT:
                hasDiff = true;
                return `<span class="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">${escapedData}</span>`;
            case DIFF_DELETE:
                 hasDiff = true;
                return `<span class="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 line-through">${escapedData}</span>`;
            case DIFF_EQUAL:
                return `<span>${escapedData}</span>`;
            default:
                return '';
        }
    }).join('');

    return { html, hasDiff };
};
