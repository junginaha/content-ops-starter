export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center" role="status" aria-label="불러오는 중">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-action" />
        </div>
    );
}
