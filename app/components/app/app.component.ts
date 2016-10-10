import { Component, OnInit } from '@angular/core';

const ITEMS: String[] = [
  'Objective',
  'Feedback'
  ]

@Component({
	moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent implements OnInit {
	items = ITEMS;
	selectedItem: String;

		// constructor() {}

	selectPage(item: String): void {
		this.selectedItem = item;
	}

	ngOnInit(): void {
  	this.selectedItem = ITEMS[0];
  }
 }
