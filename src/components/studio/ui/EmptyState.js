import React from 'react';
import Button from './Button';

export default function EmptyState({ title, description, actionLabel, actionHref, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6 border border-dashed border-studio-line rounded-2xl">
            <h3 className="font-studio-serif text-2xl text-studio-ink mb-3">{title}</h3>
            {description && <p className="text-studio-muted max-w-md mb-8 font-studio-sans text-sm leading-relaxed">{description}</p>}
            {(actionHref || onAction) && actionLabel && (
                <Button href={actionHref} onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
