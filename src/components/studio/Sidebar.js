import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { SIDEBAR_GROUPS } from '../../utils/studio/constants';
import Icon from './ui/Icon';

export default function Sidebar({ open, onClose }) {
    const router = useRouter();

    return (
        <>
            {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
            <aside
                className={classNames(
                    'fixed lg:sticky top-0 left-0 h-screen w-72 shrink-0 bg-studio-black border-r border-studio-line z-50 transition-transform duration-300 flex flex-col',
                    open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="px-7 pt-8 pb-6">
                    <Link href="/studio" className="block group">
                        <span className="block font-studio-serif text-xl tracking-wide text-studio-ivory group-hover:text-studio-gold transition-colors">
                            Question Studio
                        </span>
                        <span className="block text-[10px] tracking-[0.25em] text-studio-muted mt-1 uppercase">Documentary OS</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-8">
                    {SIDEBAR_GROUPS.map((group) => (
                        <div key={group.label}>
                            <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-studio-muted/70">{group.label}</div>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={classNames(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-studio-sans transition-colors',
                                                isActive ? 'bg-studio-panel text-studio-ivory' : 'text-studio-muted hover:text-studio-ivory hover:bg-studio-panel/60'
                                            )}
                                        >
                                            <Icon name={item.icon} className="w-4 h-4 shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="px-7 py-6 border-t border-studio-line">
                    <p className="text-xs text-studio-muted leading-relaxed">
                        &ldquo;Books are evidence. Questions are the destination.&rdquo;
                    </p>
                </div>
            </aside>
        </>
    );
}
