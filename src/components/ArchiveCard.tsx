import Image from 'next/image';
import Link from 'next/link';

export function ArchiveCard({ href, image, title, subtitle }: { href: string; image: string; title: string; subtitle: string }) {
    return (
        <Link href={href} className="group block">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-line bg-beige shadow-soft">
                <Image src={image} alt={title} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]" />
                <div className="pointer-events-none absolute inset-0 bg-ink/10 transition-colors duration-500 group-hover:bg-ink/25" />
            </div>
            <div className="mt-3">
                <p className="font-serif text-xl text-ink">{title}</p>
                <p className="text-xs uppercase tracking-widest2 text-stone">{subtitle}</p>
            </div>
        </Link>
    );
}
