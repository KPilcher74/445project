import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: string[] = ['Item 1 - Pink', 'Item 2 - Green', 'Item 3 - Blue', 'Item 4 - Red', 'Item 5 - Purple'];

  constructor() {}
}

