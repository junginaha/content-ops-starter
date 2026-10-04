import Link from 'next/link';

export interface Crumb {
    label: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-widest2 text-stone">
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    {item.href ? (
                        <Link href={item.href} className="transition-colors hover:text-ink">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-ink">{item.label}</span>
                    )}
                    {i < items.length - 1 && <span aria-hidden="true">/</span>}
                </span>
            ))}
        </nav>
    );
}
