import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  /** The four stops of a typical TourMate trip - doubles as the hero's signature visual. */
  routeStops = [
    { icon: 'place', label: 'Pick places' },
    { icon: 'hiking', label: 'Choose a guide' },
    { icon: 'local_taxi', label: 'Choose a driver' },
    { icon: 'flight_takeoff', label: 'Take the trip' }
  ];
}
