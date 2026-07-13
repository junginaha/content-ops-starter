export default function BrowseLoading() {
    return (
        <div className="container-editorial py-16 sm:py-20">
            <div className="mb-10">
                <div className="h-3 w-32 animate-pulse rounded bg-line" />
                <div className="mt-3 h-10 w-48 animate-pulse rounded bg-line" />
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-[5/7] w-full rounded-sm bg-beige" />
                        <div className="mt-3 h-4 w-2/3 rounded bg-line" />
                        <div className="mt-2 h-3 w-1/2 rounded bg-line" />
                    </div>
                ))}
            </div>
        </div>
    );
}
