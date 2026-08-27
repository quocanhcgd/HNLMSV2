import { api } from './api';

/**
 * T049–T052 — Learning Content API client (backend LearningController).
 * Contract: docs/05-api/api-spec.yaml §LEARNING (GET/POST /learning/content,
 * GET download) + DEVIATION PUT /learning/content/:id (T052).
 */

export interface LearningContentItem {
  id: string;
  title: string;
  contentType: 'document' | 'video' | 'audio' | 'presentation' | 'interactive' | 'ebook';
  accessScope: 'public' | 'class' | 'private';
  category: string | null;
  fileSizeBytes: string | null;
  mimeType: string | null;
  currentVersion: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  owner?: { id: string; fullName: string } | null;
  classLinks?: { classId: string; class?: { id: string; code: string; name: string } | null }[] | null;
}

export interface PagedContent {
  data: LearningContentItem[];
  meta: { page: number; pageSize: number; total: number };
}

export async function listContents(params: { page: number; pageSize: number; classId?: string; accessScope?: string }): Promise<PagedContent> {
  const { data } = await api.get<PagedContent>('/learning/content', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      class_id: params.classId || undefined,
      access_scope: params.accessScope || undefined,
    },
  });
  return data;
}

export async function uploadContent(payload: {
  title: string;
  accessScope?: string;
  classIds?: string[];
  contentType?: string;
  file: File;
}): Promise<LearningContentItem> {
  const fd = new FormData();
  fd.append('title', payload.title);
  if (payload.accessScope) fd.append('access_scope', payload.accessScope);
  if (payload.contentType) fd.append('content_type', payload.contentType);
  for (const cid of payload.classIds ?? []) fd.append('class_ids', cid);
  fd.append('file', payload.file);
  const { data } = await api.post<LearningContentItem>('/learning/content', fd);
  return data;
}

export async function updateContent(
  id: string,
  payload: { title?: string; accessScope?: string; classIds?: string[] },
): Promise<LearningContentItem> {
  const { data } = await api.put<LearningContentItem>(`/learning/content/${id}`, {
    title: payload.title,
    access_scope: payload.accessScope,
    class_ids: payload.classIds,
  });
  return data;
}

/** Tải file qua Bearer token (anchor thường không gửi được header). */
export async function downloadContent(id: string): Promise<void> {
  const res = await api.get(`/learning/content/${id}/download`, { responseType: 'blob' });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `content-${id}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
