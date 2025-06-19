import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

type CodePanelProps = {
    code: string;
    onCopy?: () => void;
};

export default function CodePanel({ code, onCopy }: CodePanelProps) {
    return (
        <div className="relative bg-transparent border border-gray-50 p-4 rounded mt-6">
            <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">Generated Code</h2>

            <h2 className="text-lg font-semibold mb-4 text-white">Generated Code</h2>

            {onCopy && (
                <button
                    onClick={onCopy}
                    className="absolute top-4 right-4 text-sm text-gray-50 px-3 py-1 rounded"
                >
                    Copy HTML for Figma
                </button>
            )}
            </div>

            <SyntaxHighlighter language="html" style={nightOwl} wrapLongLines customStyle={{ background: 'transparent', padding: 0 }}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
