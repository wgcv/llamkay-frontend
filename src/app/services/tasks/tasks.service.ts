import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../../interfaces/pagination.interface';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { Host } from '../../config/host';
import { map } from 'rxjs/operators';
import { Task } from 'src/app/interfaces/task.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(@Inject(HttpClient) private http: HttpClient,
    @Inject(CookieService) private cookieService: CookieService,

    @Inject(Router) private router: Router) { }
  getTasks(userId) {
    return this.http.get<Pagination>(Host.url + '/all/tasks/'+userId)
      .pipe(map(res => res));
  }
  getTask(id) {
    return this.http.get<Task>(Host.url + '/tasks/'+id)
      .pipe(map(res => res));
  }
  getArchiveTasks(userId) {
    return this.http.get<Pagination>(Host.url + '/all/archive/tasks/'+userId)
      .pipe(map(res => res));
  }
  
  getStats(userId, from, until) {
    return this.http.get<any>(Host.url + '/tasks/stats/' + userId + '?from=' + from + '&until=' + until)
      .pipe(map(res => res));
  }
  getScreenshots(taskId, page) {
    return this.http.get<Pagination>(Host.url + '/screenshots/all/' + taskId+'?page='+page)
      .pipe(map(res => res));
  }
}


