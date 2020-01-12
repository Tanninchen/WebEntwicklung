import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { ConsoleLoggerService } from '../services/console-logger.service';
import { RESTService } from '../services/rest.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public urlBackingField = 'www.sample.com';
  public queryBackingField = 'div';
  public contente = '';
  constructor(private configService: ConfigService, private consoleLogger: ConsoleLoggerService, private restService: RESTService) { }

  ngOnInit() {

    this.urlBackingField = this.configService.getURL();
    this.consoleLogger.log('set ' + this.urlBackingField);
    this.queryBackingField = this.configService.getQuery();
    this.consoleLogger.log('set ' + this.queryBackingField);

    this.restService.getAllContent();
    this.contente = this.restService.content;
  }

}
