import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {MapService} from './map.service';
import { AgmMap } from '@agm/core';

@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  @Input() location: string;
  @ViewChild(AgmMap) public agmMap: AgmMap;
  isPositionError: boolean = false;

  lat: number = 0;
  lng: number = 0;

  constructor(private mapService: MapService) { }

  mapReadyHandler(){
    this.mapService.getGeoLocation(this.location).subscribe(
      (coordinates)=> {
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
        this.agmMap.triggerResize();
      },() => {
        this.isPositionError = true;
      }
    )
  }
}
