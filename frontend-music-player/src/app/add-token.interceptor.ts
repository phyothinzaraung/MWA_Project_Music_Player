import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const jwt = auth.state_signal().jwt;
  if(jwt){
    const req_with_header = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + jwt)
    });
    return next(req_with_header)
  }
  return next(req);
};
