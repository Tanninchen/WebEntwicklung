import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  url: string;
  query: string;
  constructor() { }

  public setURL(url: string) {
    this.url = url;
  }

  public getURL() {
    return this.url;
  }

  public setQuery(query: string) {
    this.query = query;
  }

  public getQuery() {
    return this.query;
  }
}
