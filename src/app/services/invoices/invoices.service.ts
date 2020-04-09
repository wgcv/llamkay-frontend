import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Host } from '../../config/host';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(@Inject(HttpClient) private http: HttpClient,
    @Inject(Router) private router: Router) { }

    createInvoice(invoice) {
      return this.http.post<any>(Host.url + '/invoices/', invoice)
        .pipe(map(res => res));
    }
  }