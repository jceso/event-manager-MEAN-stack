import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (user && user.token) {
    const clonedReq = req.clone({
      setHeaders: {
        "x-access-token": `${user.token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
