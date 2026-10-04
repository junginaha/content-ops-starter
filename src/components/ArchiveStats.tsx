const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

function Stat({ value, label }: { value: number; label: string }) {
    return (
        <div className="text-center">
            <p className="font-serif text-4xl text-ink sm:text-5xl">{NUMBER_FORMAT.format(value)}</p>
            <p className="eyebrow mt-2">{label}</p>
        </div>
    );
}

export function ArchiveStats({ totalPosters, totalViewpoints, totalCities }: { totalPosters: number; totalViewpoints: number; totalCities: number }) {
    return (
        <section className="border-y border-line bg-beige">
            <div className="container-editorial grid grid-cols-1 gap-10 py-16 sm:grid-cols-3 sm:gap-6">
                <Stat value={totalPosters} label="Posters" />
                <Stat value={totalViewpoints} label="Researched Viewpoints" />
                <Stat value={totalCities} label="Destinations" />
            </div>
        </section>
    );
}
