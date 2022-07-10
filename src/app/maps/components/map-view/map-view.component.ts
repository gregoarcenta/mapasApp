import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Map, Popup, Marker } from "mapbox-gl";
import { MapService } from "../../services/map.service";
import { PlacesService } from "../../services/places.service";

@Component({
  selector: "app-map-view",
  templateUrl: "./map-view.component.html",
  styleUrls: ["./map-view.component.css"],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild("map") map!: ElementRef;

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  ngAfterViewInit(): void {
    if (!this.placesService.useLocation)
      throw new Error("No se pudo obtener la geolocalización");

    const map = new Map({
      container: this.map.nativeElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: this.placesService.useLocation,
      zoom: 9,
      projection: { name: "globe" },
    });

    const popup = new Popup().setHTML(`
        <h6>Aqui estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);

    const marker = new Marker()
      .setLngLat(this.placesService.useLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapService.setMap(map);
  }
}
