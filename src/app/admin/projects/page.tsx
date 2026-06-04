'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProjectForm from '@/components/admin/ProjectForm';
import {
  getAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
} from '@/lib/adminApi';
import type { Project } from '@/lib/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editing, setEditing] = useState<Project | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminProjects();
      setProjects(res.data);
    } catch {
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (data: Omit<Project, 'id'>) => {
    await createAdminProject(data);
    setMode('list');
    load();
  };

  const handleUpdate = async (data: Omit<Project, 'id'>) => {
    if (!editing) return;
    await updateAdminProject(editing.id, data);
    setMode('list');
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteAdminProject(id);
    load();
  };

  return (
    <div className="min-h-screen bg-[#0F1923]">
      <AdminSidebar activePage="projects" />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            {mode === 'list' && (
              <button
                onClick={() => setMode('create')}
                className="flex items-center gap-2 px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors text-sm min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            )}
          </div>

          {mode === 'create' && (
            <div className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Add Project</h2>
              <ProjectForm onSubmit={handleCreate} onCancel={() => setMode('list')} submitLabel="Create" />
            </div>
          )}

          {mode === 'edit' && editing && (
            <div className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Edit Project</h2>
              <ProjectForm
                initialData={editing}
                onSubmit={handleUpdate}
                onCancel={() => { setMode('list'); setEditing(null); }}
                submitLabel="Save"
              />
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent-secondary" />
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-[#1A2A3A] rounded-xl p-4 border border-[#2A3A4A] flex items-center gap-4">
                  {proj.image_url && (
                    <img src={proj.image_url} alt="" className="w-16 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{proj.title}</p>
                      {proj.category && (
                        <span className="px-2 py-0.5 bg-accent-secondary/20 text-accent-secondary text-xs rounded">
                          {proj.category}
                        </span>
                      )}
                      {!proj.visible && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Hidden</span>
                      )}
                    </div>
                    <p className="text-xs text-white/40">
                      {proj.start_date}{proj.end_date && ` — ${proj.end_date}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(proj); setMode('edit'); }}
                      className="p-2 text-white/50 hover:text-accent-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-2 text-white/50 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-white/30 py-8 text-sm">No projects yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}