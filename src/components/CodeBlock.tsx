import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import { Check, Copy } from 'lucide-react';
import { cn } from '../lib/utils';

// Register languages
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);

// Catppuccin Macchiato Theme Definition
const catppuccinMacchiato = {
    "code[class*=\"language-\"]": {
        "color": "#cad3f5",
        "background": "none",
        "textShadow": "none",
        "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
        "fontSize": "1em",
        "textAlign": "left",
        "whiteSpace": "pre",
        "wordSpacing": "normal",
        "wordBreak": "normal",
        "lineHeight": "1.5",
        "MozTabSize": "4",
        "OTabSize": "4",
        "tabSize": "4",
        "WebkitHyphens": "none",
        "MozHyphens": "none",
        "msHyphens": "none",
        "hyphens": "none"
    },
    "pre[class*=\"language-\"]": {
        "color": "#cad3f5",
        "background": "#24273a",
        "textShadow": "none",
        "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
        "fontSize": "1em",
        "textAlign": "left",
        "whiteSpace": "pre",
        "wordSpacing": "normal",
        "wordBreak": "normal",
        "lineHeight": "1.5",
        "MozTabSize": "4",
        "OTabSize": "4",
        "tabSize": "4",
        "WebkitHyphens": "none",
        "MozHyphens": "none",
        "msHyphens": "none",
        "hyphens": "none",
        "padding": "1em",
        "margin": ".5em 0",
        "overflow": "auto"
    },
    ":not(pre) > code[class*=\"language-\"]": {
        "background": "#24273a",
        "padding": ".1em",
        "borderRadius": ".3em",
        "whiteSpace": "normal"
    },
    "comment": {
        "color": "#9399b2",
        "fontStyle": "italic"
    },
    "block-comment": {
        "color": "#9399b2",
        "fontStyle": "italic"
    },
    "prolog": {
        "color": "#9399b2"
    },
    "doctype": {
        "color": "#9399b2"
    },
    "cdata": {
        "color": "#9399b2"
    },
    "punctuation": {
        "color": "#9399b2"
    },
    "tag": {
        "color": "#c6a0f6"
    },
    "attr-name": {
        "color": "#8aadf4"
    },
    "namespace": {
        "color": "#c6a0f6"
    },
    "deleted": {
        "color": "#ed8796"
    },
    "function-name": {
        "color": "#8aadf4"
    },
    "boolean": {
        "color": "#f5a97f"
    },
    "number": {
        "color": "#f5a97f"
    },
    "function": {
        "color": "#8aadf4"
    },
    "property": {
        "color": "#cad3f5"
    },
    "class-name": {
        "color": "#eed49f"
    },
    "constant": {
        "color": "#f5a97f"
    },
    "symbol": {
        "color": "#f5a97f"
    },
    "selector": {
        "color": "#f5bde6"
    },
    "important": {
        "color": "#c6a0f6",
        "fontWeight": "bold"
    },
    "atrule": {
        "color": "#c6a0f6"
    },
    "keyword": {
        "color": "#c6a0f6"
    },
    "builtin": {
        "color": "#8aadf4"
    },
    "string": {
        "color": "#a6da95"
    },
    "char": {
        "color": "#a6da95"
    },
    "attr-value": {
        "color": "#a6da95"
    },
    "regex": {
        "color": "#a6da95"
    },
    "variable": {
        "color": "#cad3f5"
    },
    "operator": {
        "color": "#8aadf4"
    },
    "url": {
        "color": "#8aadf4"
    },
    "bold": {
        "fontWeight": "bold"
    },
    "italic": {
        "fontStyle": "italic"
    },
    "inserted": {
        "color": "#a6da95"
    }
};

interface CodeBlockProps {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
    className?: string;
    maxHeight?: string;
}

export const CodeBlock = ({
    code,
    language = 'tsx',
    showLineNumbers = false,
    className,
    maxHeight
}: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("relative group rounded-xl overflow-hidden bg-[#24273a] border border-white/10 shadow-xl", className)}>
            {/* Header / Actions */}
            <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white backdrop-blur-md transition-all border border-white/5"
                    title="Copy code"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            <div className={cn("text-sm scrollbar-thin", maxHeight ? "overflow-y-auto" : "")} style={{ maxHeight }}>
                <SyntaxHighlighter
                    language={language}
                    style={catppuccinMacchiato as any}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    }}
                    showLineNumbers={showLineNumbers}
                    lineNumberStyle={{
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        color: '#6e738d',
                        textAlign: 'right'
                    }}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
