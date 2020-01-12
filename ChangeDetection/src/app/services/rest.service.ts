/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConsoleLoggerService } from './console-logger.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';



@Injectable({
  providedIn: 'root'
})
export class RESTService {
  content;
  constructor(
    private http: HttpClient, private consoleLogger: ConsoleLoggerService
  ) { }

  // API: GET /content
  public getAllContent() {

    this.http.get('http://localhost:3000/content').subscribe(
      (response) => {
        // because I didn't make it work otherwise
        // tslint:disable-next-line: no-string-literal
        console.log(response['textContent']);
        // because I didn't make it work otherwise
        // tslint:disable-next-line: no-string-literal
        this.content = response['textContent'];
      },
      error => console.error(error)
    );
  }

  // API: POST /setconfig
  public setConfig(url: string, query: string) {
    const data = {
      'url': url,
      'query': query
    };

    this.http.post('http://localhost:3000/setconfig', data).subscribe(
      // because I didn't make it work otherwise
      // tslint:disable-next-line: no-string-literal
      response => console.log(response['result']),
      error => console.error(error)
    );
  }

  // API: GET /getconfig
  public getConfig(): void {
    this.http.get('http://localhost:3000/getconfig').subscribe(
      // because I didn't make it work otherwise
      // tslint:disable-next-line: no-string-literal
      response => console.log(response['url'], response['query']),
      error => console.error(error)
    );
  }
}
