import { PosterForm } from '@/app/admin/(protected)/posters/PosterForm';

export default function NewPosterPage() {
    return (
        <div>
            <h1 className="font-serif text-3xl text-ink">New Poster</h1>
            <PosterForm />
        </div>
    );
}
