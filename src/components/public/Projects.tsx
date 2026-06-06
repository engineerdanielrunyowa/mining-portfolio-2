'use client';

import { useEffect, useState } from 'react';
import { getProjects } from '@/lib/api';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        Loading projects...
      </div>
    );
  }

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4">Projects</h2>

      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project: any) => (
            <div key={project.id} className="border p-4 rounded">
              <h3 className="font-semibold">{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
