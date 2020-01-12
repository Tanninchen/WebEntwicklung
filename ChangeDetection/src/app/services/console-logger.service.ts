import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService {

  constructor() { }

  log(msg: string) {
    console.log(msg);
}
}
