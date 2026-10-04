'use client';

import Image from 'next/image';
import { useState } from 'react';
import { savePosterAction } from '@/app/admin/actions';
import type { Poster } from '@/types/database';

const CONTINENTS = ['Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Africa'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-stone">{label}</span>
            <div className="mt-1.5">{children}</div>
        </label>
    );
}

const inputClass = 'w-full rounded border border-line bg-transparent px-3 py-2 text-sm text-ink focus:border-ink';

export function PosterForm({ poster }: { poster?: Poster }) {
    const [submitting, setSubmitting] = useState(false);
    const action = savePosterAction.bind(null, poster?.id ?? null);

    return (
        <form
            action={async (formData) => {
                setSubmitting(true);
                try {
                    await action(formData);
                } finally {
                    setSubmitting(false);
                }
            }}
            className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
            <input type="hidden" name="existingPreviewUrl" defaultValue={poster?.preview_image_url ?? ''} />
            <input type="hidden" name="existingOriginalPath" defaultValue={poster?.original_storage_path ?? ''} />
            <input type="hidden" name="existingOriginalFilename" defaultValue={poster?.original_filename ?? ''} />

            <div className="space-y-5">
                <Field label="Continent">
                    <select name="continent" defaultValue={poster?.continent ?? 'Asia'} className={inputClass} required>
                        {CONTINENTS.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Country">
                    <input name="country" defaultValue={poster?.country} className={inputClass} required />
                </Field>
                <Field label="City">
                    <input name="city" defaultValue={poster?.city} className={inputClass} required />
                </Field>
                <Field label="Viewpoint">
                    <input name="viewpoint" defaultValue={poster?.viewpoint} className={inputClass} required />
                </Field>
                <Field label="Slug (leave blank to auto-generate)">
                    <input name="slug" defaultValue={poster?.slug} className={inputClass} placeholder="seoul-banpo-bridge" />
                </Field>
                <Field label="Description (researched)">
                    <textarea name="description" defaultValue={poster?.description} rows={4} className={inputClass} required />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Latitude">
                        <input name="latitude" type="number" step="any" defaultValue={poster?.latitude} className={inputClass} required />
                    </Field>
                    <Field label="Longitude">
                        <input name="longitude" type="number" step="any" defaultValue={poster?.longitude} className={inputClass} required />
                    </Field>
                </div>
                <Field label="Map query">
                    <input name="mapQuery" defaultValue={poster?.map_query} className={inputClass} placeholder="Banpo Bridge, Seoul" />
                </Field>
            </div>

            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Researched viewpoints">
                        <input name="researchedViewpointCount" type="number" min={1} defaultValue={poster?.researched_viewpoint_count ?? 1} className={inputClass} />
                    </Field>
                    <Field label="Price (KRW)">
                        <input name="priceKrw" type="number" min={0} defaultValue={poster?.price_krw ?? 990} className={inputClass} />
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Width (px)">
                        <input name="width" type="number" defaultValue={poster?.width ?? 4000} className={inputClass} />
                    </Field>
                    <Field label="Height (px)">
                        <input name="height" type="number" defaultValue={poster?.height ?? 5600} className={inputClass} />
                    </Field>
                </div>
                <Field label="Sort order">
                    <input name="sortOrder" type="number" defaultValue={poster?.sort_order ?? 0} className={inputClass} />
                </Field>
                <Field label="Status">
                    <select name="status" defaultValue={poster?.status ?? 'draft'} className={inputClass}>
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                        <option value="unpublished">unpublished</option>
                    </select>
                </Field>

                <Field label="Preview image (public, ~900px webp)">
                    <input name="previewFile" type="file" accept="image/*" className={inputClass} />
                    {poster?.preview_image_url && (
                        <div className="relative mt-2 aspect-[5/7] w-32 overflow-hidden rounded border border-line">
                            <Image src={poster.preview_image_url} alt="Current preview" fill className="object-cover" />
                        </div>
                    )}
                </Field>
                <Field label="Original image (private, high-resolution)">
                    <input name="originalFile" type="file" accept="image/*" className={inputClass} />
                    {poster?.original_storage_path && <p className="mt-1 text-xs text-stone">현재 파일: {poster.original_filename}</p>}
                </Field>

                <button type="submit" disabled={submitting} className="btn-charcoal">
                    {submitting ? '저장 중…' : '저장'}
                </button>
            </div>
        </form>
    );
}
