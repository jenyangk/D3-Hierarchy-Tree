import { Component } from '@angular/core';
import { ITreeConfig } from './models/tree.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'd3-hierarchy-tree';

  public treeDataSource: ITreeConfig = {
    title: 'Atheletes',
    data: [
      {
        name: 'Floyd Mayweather',
        sport: 'Boxing',
        nation: 'United States',
        earnings: 285,
      },
      {
        name: 'Lionel Messi',
        sport: 'Soccer',
        nation: 'Argentina',
        earnings: 111,
      },
      {
        name: 'Cristiano Ronaldo',
        sport: 'Soccer',
        nation: 'Portugal',
        earnings: 108,
      },
      { name: 'Conor McGregor', sport: 'MMA', nation: 'Ireland', earnings: 99 },
      { name: 'Neymar', sport: 'Soccer', nation: 'Brazil', earnings: 90 },
      {
        name: 'LeBron James',
        sport: 'Basketball',
        nation: 'United States',
        earnings: 85.5,
      },
      {
        name: 'Roger Federer',
        sport: 'Tennis',
        nation: 'Switzerland',
        earnings: 77.2,
      },
      {
        name: 'Stephen Curry',
        sport: 'Basketball',
        nation: 'United States',
        earnings: 76.9,
      },
      {
        name: 'Matt Ryan',
        sport: 'Football',
        nation: 'United States',
        earnings: 67.3,
      },
      {
        name: 'Matthew Stafford',
        sport: 'Football',
        nation: 'United States',
        earnings: 59.5,
      },
    ],
    dataKeys: ["nation", "sport", "name"]
  };
}
