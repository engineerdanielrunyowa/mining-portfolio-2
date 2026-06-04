'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SpecialisationForm from '@/components/admin/SpecialisationForm';
import {
  getAdminSpecialisations,
  createAdminSpecialisation,
  updateAdminSpecialisation,
  deleteAdminSpecialisation,
} from '@/lib/adminApi';
import type { Specialisation } from '@/lib/types';

export default function AdminSpecialisationsPage() {
  const [specs, setSpecs] = useState<Specialisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editing, setEditing] = useState<Specialisation | null>(null);

  const loadSpecs = async () => {
    setLoading(true);
    try {
      const res = await getAdminSpecialisations();
      setSpecs(res.data);
    } catch {
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecs();
  }, []);

  const handleCreate = async (data: Omit<Specialisation, 'id'>) => {
    await createAdminSpecialisation(data);
    setMode('list');
    loadSpecs();
  };

  const handleUpdate = async (data: Omit<Specialisation, 'id'>) => {
    if (!editing) return;
    await updateAdminSpecialisation(editing.id, data);
    setMode('list');
    setEditing(null);
    loadSpecs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this specialisation?')) return;
    await deleteAdminSpecialisation(id);
    loadSpecs();
  };

  return (
    <div className="min-h-screen bg-[#0F1923]">
      <AdminSidebar activePage="specialisations" />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Specialisations</h1>
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
              <h2 className="text-lg font-semibold text-white mb-4">Add Specialisation</h2>
              <SpecialisationForm
                onSubmit={handleCreate}
                onCancel={() => setMode('list')}
                submitLabel="Create"
              />
            </div>
          )}

          {mode === 'edit' && editing && (
            <div className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Edit Specialisation</h2>
              <SpecialisationForm
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
              {specs.map((spec) => (
                <div
                  key={spec.id}
                  className="bg-[#1A2A3A] rounded-xl p-4 border border-[#2A3A4A] flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0F1923] flex items-center justify-center">
                    {spec.icon_url ? (
                      <img src={spec.icon_url} alt="" className="w-5 h-5" />
                    ) : (
                      <span className="text-xs text-white/30">—</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{spec.title}</p>
                      {!spec.visible && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{spec.description}</p>
                  </div>
                  <span className="text-xs text-white/30 font-mono">#{spec.display_order}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(spec); setMode('edit'); }}
                      className="p-2 text-white/50 hover:text-accent-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(spec.id)}
                      className="p-2 text-white/50 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {specs.length === 0 && (
                <p className="text-center text-white/30 py-8 text-sm">
                  No specialisations yet. Add your first one.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}