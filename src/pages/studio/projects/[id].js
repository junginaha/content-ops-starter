import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StudioShell from '../../../components/studio/StudioShell';
import Tabs from '../../../components/studio/ui/Tabs';
import Badge from '../../../components/studio/ui/Badge';
import EmptyState from '../../../components/studio/ui/EmptyState';
import { useProjects } from '../../../utils/studio/store';
import OverviewTab from '../../../components/studio/project/OverviewTab';
import ResearchTab from '../../../components/studio/project/ResearchTab';
import ScriptTab from '../../../components/studio/project/ScriptTab';
import StoryboardTab from '../../../components/studio/project/StoryboardTab';
import ImagesTab from '../../../components/studio/project/ImagesTab';
import VoiceTab from '../../../components/studio/project/VoiceTab';
import MusicTab from '../../../components/studio/project/MusicTab';
import ThumbnailTab from '../../../components/studio/project/ThumbnailTab';
import SEOTab from '../../../components/studio/project/SEOTab';
import ExportTab from '../../../components/studio/project/ExportTab';

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'research', label: 'Research' },
    { key: 'script', label: 'Script' },
    { key: 'storyboard', label: 'Scenes' },
    { key: 'images', label: 'Images' },
    { key: 'voice', label: 'Voice' },
    { key: 'music', label: 'Music' },
    { key: 'thumbnail', label: 'Thumbnail' },
    { key: 'seo', label: 'SEO' },
    { key: 'export', label: 'Assets' }
];

export default function ProjectWorkspace() {
    const router = useRouter();
    const { id, tab } = router.query;
    const { items: projects, hydrated, update } = useProjects();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (tab) setActiveTab(tab);
    }, [tab]);

    const project = projects.find((p) => p.id === id);

    function handleUpdate(patch) {
        update(id, patch);
    }

    function changeTab(key) {
        setActiveTab(key);
        router.replace({ pathname: router.pathname, query: { ...router.query, tab: key } }, undefined, { shallow: true });
    }

    if (!hydrated) {
        return (
            <StudioShell pageTitle="Loading">
                <p className="text-studio-muted">Loading…</p>
            </StudioShell>
        );
    }

    if (!project) {
        return (
            <StudioShell pageTitle="Project not found" eyebrow="Studio" title="Project not found">
                <EmptyState
                    title="This project doesn't exist yet"
                    description="It may have been removed, or you're viewing this on a different browser session."
                    actionLabel="Create Documentary"
                    actionHref="/studio/projects/new"
                />
            </StudioShell>
        );
    }

    const tabProps = { project, onUpdate: handleUpdate };

    return (
        <StudioShell
            pageTitle={project.input.question}
            eyebrow={project.input.trend}
            title={project.input.question}
            actions={<Badge tone="gold">{project.status}</Badge>}
        >
            <div className="mb-8">
                <Tabs tabs={TABS} active={activeTab} onChange={changeTab} />
            </div>

            {activeTab === 'overview' && <OverviewTab {...tabProps} />}
            {activeTab === 'research' && <ResearchTab {...tabProps} />}
            {activeTab === 'script' && <ScriptTab {...tabProps} />}
            {activeTab === 'storyboard' && <StoryboardTab {...tabProps} />}
            {activeTab === 'images' && <ImagesTab {...tabProps} />}
            {activeTab === 'voice' && <VoiceTab {...tabProps} />}
            {activeTab === 'music' && <MusicTab {...tabProps} />}
            {activeTab === 'thumbnail' && <ThumbnailTab {...tabProps} />}
            {activeTab === 'seo' && <SEOTab {...tabProps} />}
            {activeTab === 'export' && <ExportTab {...tabProps} />}
        </StudioShell>
    );
}
