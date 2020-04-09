import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Host } from '../../config/host';
import { Company } from 'src/app/interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(@Inject(HttpClient) private http: HttpClient,
  @Inject(Router) private router: Router) { }

  getCompany() {
    return this.http.get<Company>(Host.url + '/company/')
      .pipe(map(res => res));
  }
  updateCompany(company) {
    return this.http.patch<Company>(Host.url + '/company/', company)
      .pipe(map(res => res));
  }
}
