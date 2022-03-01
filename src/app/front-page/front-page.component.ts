import { Component, OnInit } from '@angular/core';
import { WeatherData } from '../weather-data';
import { CrudReturn } from '../crud-return';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})
export class FrontPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
