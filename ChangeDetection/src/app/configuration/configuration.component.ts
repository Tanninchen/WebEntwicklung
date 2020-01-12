import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { RESTService } from '../services/rest.service';
import { ConsoleLoggerService } from '../services/console-logger.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  urlBackingField;
  queryBackingField;

  constructor(private configService: ConfigService, private restService: RESTService, private consoleLogger: ConsoleLoggerService) { }

  get custom_url() {
    return this.urlBackingField;
  }

  set custom_url(value: string) {
    this.urlBackingField = value;
  }
  get custom_query() {
    return this.queryBackingField;
  }

  set custom_query(value: string) {
    this.queryBackingField = value;
  }

  ngOnInit() {
  }

  setMonitoring() {
    this.configService.setURL(this.urlBackingField);
    this.consoleLogger.log('set ' + this.urlBackingField);
    this.configService.setQuery(this.queryBackingField);
    this.consoleLogger.log('set ' + this.queryBackingField);

    this.restService.setConfig(this.urlBackingField, this.queryBackingField);
  }
}

