import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../auth/hooks/useAuth';
import { updateProfile, uploadAvatar } from '../../auth/services/auth.service';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(200).optional(),
});

export default function ProfileSettings() {
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { full_name: profile?.full_name ?? '', bio: profile?.bio ?? '' },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateProfile(profile.id, data);
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(profile.id, file);
      await updateProfile(profile.id, { avatar_url: url });
      await refreshProfile();
      toast.success('Avatar updated');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally { setUploading(false); }
  };

  return (
    <div className="max-w-[600px]">
      <h2 className="font-display font-bold text-2xl text-ink mb-8">PROFILE</h2>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-border bg-accent flex items-center justify-center text-white font-display font-bold text-2xl overflow-hidden">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              : (profile?.full_name?.[0]?.toUpperCase() ?? '?')
            }
          </div>
          <label className="absolute bottom-0 right-0 w-7 h-7 bg-surface border-2 border-border rounded-full flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
            <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} disabled={uploading} />
          </label>
        </div>
        <div>
          <p className="font-display font-semibold text-ink">{profile?.full_name}</p>
          <p className="text-meta text-ink-muted">{profile?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <label className="cf-label">Full Name</label>
          <input type="text" className={`cf-input ${errors.full_name ? 'border-danger' : ''}`} {...register('full_name')} />
          {errors.full_name && <p className="text-meta text-danger mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="cf-label">Email</label>
          <input type="email" value={profile?.email ?? ''} disabled className="cf-input opacity-60 cursor-not-allowed" />
          <p className="text-meta text-ink-muted mt-1">Email cannot be changed here.</p>
        </div>

        <div>
          <label className="cf-label">Bio <span className="text-ink-muted normal-case font-sans font-normal tracking-normal">(optional)</span></label>
          <textarea className="cf-textarea" rows={3} placeholder="Tell your team about yourself…" {...register('bio')} />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving || !isDirty} className="btn-primary gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> SAVING…</> : 'SAVE CHANGES'}
          </button>
        </div>
      </form>
    </div>
  );
}
