'use client';

import { useEffect, useState } from 'react';
import { Calendar, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { Project } from '@/lib/types';
import { getProjects } from '@/lib/api';
import { mockProjects } from '@/lib/mockData';
import { useInView } from '@/hooks/useInView';

interface ProjectsProps {
  demoMode: boolean;
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const description = project.description || '';
  const isLong = description.length > 200;

  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-bg-secondary/50 dark:border-dark-bg/50 group">
      {project.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {project.category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-accent-secondary/90 text-white text-xs font-medium rounded-full">
              {project.category}
            </span>
          )}
        </div>
      )}
      {!project.image_url && project.category && (
        <div className="px-6 pt-5">
          <span className="inline-block px-3 py-1 bg-accent-secondary/10 text-accent-secondary text-xs font-medium rounded-full">
            {project.category}
          </span>
        </div>
      )}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-accent-primary dark:text-white mb-2">
          {project.title}
        </h3>
        {(project.start_date || project.end_date) && (
          <div className="flex items-center gap-1.5 text-xs text-text-main/50 dark:text-dark-text/40 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {project.start_date}
              {project.end_date && ` — ${project.end_date}`}
            </span>
          </div>
        )}
        <p className="text-sm text-text-main/70 dark:text-dark-text/60 leading-relaxed whitespace-pre-line">
          {isLong && !expanded ? description.substring(0, 200) + '...' : description}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-accent-secondary hover:text-accent-secondary/80 transition-colors min-h-[44px]"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Projects({ demoMode }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { ref, isVisible } = useInView();

  useEffect(() => {
    async function load() {
      if (demoMode) {
        setProjects(mockProjects);
        setLoading(false);
        return;
      }
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [demoMode]);

  if (loading || projects.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-primary dark:text-accent-secondary mb-3 text-center">
            Projects
          </h2>
          <p className="text-text-main/60 dark:text-dark-text/50 text-sm sm:text-base text-center mb-8 max-w-2xl mx-auto">
            A selection of mining engineering projects spanning open-pit, underground, and consulting engagements.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 min-h-[44px] ${
                  activeCategory === cat
                    ? 'bg-accent-primary dark:bg-accent-secondary text-white'
                    : 'bg-bg-secondary dark:bg-dark-bg-secondary text-text-main/60 dark:text-dark-text/50 hover:bg-accent-secondary/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
