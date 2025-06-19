import { useState } from 'react'

import './App.css'
import {generateUIComponent} from "./services/openai.ts";
import PromptInput from "./PromptInput.tsx";
import CodePanel from "./CodePanel.tsx";
import LivePreview from "./LivePreview";



export default function App() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedToast, setCopiedToast] = useState(false);
    const [prompt, setPrompt] = useState("");



    const handleGenerate = async (prompt: string) => {
        if (!prompt.trim()) {
            alert("Please enter a prompt");
            return;
        }

        setLoading(true);

        try {
            const result = await generateUIComponent(prompt);
            const jsxOnly = result.match(/```jsx([\s\S]*?)```/)?.[1]?.trim() || result;

            setCode(jsxOnly);
            setPrompt(""); // ✅ Clear the input textarea
        } catch (error) {
            console.error("Generation failed:", error);
            alert("Something went wrong while generating the UI.");
        } finally {
            setLoading(false);
        }
    };

    const copyHTMLToClipboard = () => {
        if (!code) return;

        // Extract raw HTML
        const rawHTML = code.replace(/```html|```/g, '').trim();

        // Extract <style> content (preserve original CSS)
        const styleMatch = rawHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const cssContent = styleMatch ? styleMatch[1].trim() : '';

        // Extract body content
        const bodyMatch = rawHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';

        // Validate extracted CSS and HTML
        const hasValidCSS = cssContent.length > 0 && /{[^{}]+}/.test(cssContent);
        const hasValidHTML = bodyContent.length > 0;

        if (!hasValidCSS || !hasValidHTML) {
            console.warn("CSS:", cssContent);
            console.warn("Body:", bodyContent);
            alert("Generated code appears to be incomplete or invalid. Please regenerate.");
            return;
        }

        // Final cleaned HTML output
        const finalHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Generated UI</title>
    <style>
${cssContent}
    </style>
  </head>
  <body>
${bodyContent}
  </body>
</html>`;

        // Copy to clipboard
        navigator.clipboard.writeText(finalHTML).then(() => {
            setCopiedToast(true);
            setTimeout(() => setCopiedToast(false), 3000);
        });
    };






    return (
        <div className="min-h-screen bg-transparent text-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-transparent p-8 rounded-lg">
                <span className="text-2xl font-bold mb-4">Sketch it with words.</span>
                <PromptInput onSubmit={handleGenerate} loading={loading}/>
                {code && (
                    <LivePreview html={code.replace(/```html|```/g, '').trim()} />
                )}

                {code && (
                    <CodePanel
                        code={code.replace(/```html|```/g, '')}
                        onCopy={copyHTMLToClipboard}
                    />
                )}

            </div>
            {copiedToast && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 text-sm">
                    ✅ HTML copied! Open Figma → run the "HTML to Figma" plugin → Paste (Ctrl/Cmd + V)
                </div>
            )}

        </div>

    );
}
