import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';
import { AuthedRequest } from '../auth/jwt-auth.guard';
import { ScopeContextService } from './scope-context.service';
import { ScopesService } from './scopes.service';

/**
 * T034 — Global interceptor: resolve branch scope của caller 1 lần/request
 * (guard JWT chạy trước interceptor nên req.user luôn có với endpoint bảo vệ),
 * rồi chạy pipeline trong AsyncLocalStorage để mọi service đọc được qua
 * ScopeContextService.branchIds().
 */
@Injectable()
export class ScopeContextInterceptor implements NestInterceptor {
  constructor(
    private readonly scopes: ScopesService,
    private readonly ctx: ScopeContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const user = req.user;
    if (!user) return next.handle(); // public endpoint (login/health...) — không cần scope
    return from(this.scopes.resolveBranchIds(user.sub, user.role)).pipe(
      switchMap((branchIds) =>
        // Pattern chuẩn cho AsyncLocalStorage trong interceptor: next.handle() phải được
        // GỌI + SUBSCRIBE trong cùng run() — nếu gọi handle() ngoài run, promise chain của
        // handler được tạo ở context gốc và không mang theo store.
        new Observable<unknown>((subscriber) => {
          const subscription = this.ctx.run({ branchIds }, () => next.handle().subscribe(subscriber));
          return () => subscription.unsubscribe();
        }),
      ),
    );
  }
}
