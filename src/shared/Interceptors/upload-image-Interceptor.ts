// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';

// import { Observable } from 'rxjs';

// import { FileInterceptor } from '@nestjs/platform-express';

// import { multerImageOptions } from '../helpers';

// @Injectable()
// export class MulterImageConfigInterceptor implements NestInterceptor {
//   private readonly delegate: NestInterceptor;

//   constructor() {
//     const DynamicInterceptor = FileInterceptor('logo', multerImageOptions());

//     const interceptor = new DynamicInterceptor();

//     this.delegate = interceptor as unknown as NestInterceptor;
//   }

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return this.delegate.intercept(context, next) as Observable<any>;
//   }
// }
