import React, { useState } from 'react';
import Button from './Button';

export default function CopyButton({ text, label = 'Copy', className }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            // clipboard unavailable, ignore
        }
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleCopy} className={className} type="button">
            {copied ? 'Copied' : label}
        </Button>
    );
}
