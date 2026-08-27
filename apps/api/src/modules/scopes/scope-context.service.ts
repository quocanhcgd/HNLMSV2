import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

interface ScopeStore {
  /** null = unrestricted (Admin/org_admin/system_admin); [] = không có branch nào; [ids] = branch được cấp. */
  branchIds: string[] | null;
}

/**
 * T034 — ScopeContext: lưu branch scope của request hiện tại (AsyncLocalStorage).
 * ScopeContextInterceptor resolve 1 lần/request; service bất kỳ đọc qua branchIds().
 */
@Injectable()
export class ScopeContextService {
  private readonly storage = new AsyncLocalStorage<ScopeStore>();

  run<T>(store: ScopeStore, fn: () => T): T {
    return this.storage.run(store, fn);
  }

  /** Branch được phép của caller (null = toàn quyền — admin). */
  branchIds(): string[] | null {
    return this.storage.getStore()?.branchIds ?? null;
  }
}
