import { Component, OnInit } from "@angular/core";
import { MapService } from "../../services/map.service";
import { PlacesService } from "../../services/places.service";

@Component({
  selector: "app-btn-my-location",
  templateUrl: "./btn-my-location.component.html",
  styleUrls: ["./btn-my-location.component.css"],
})
export class BtnMyLocationComponent {
  constructor(
    private placesServices: PlacesService,
    private mapService: MapService
  ) {}

  goToMyLocation() {
    if (!this.placesServices.isUserLocationReady)
      throw new Error("No se pudo obtener la geolocalización del usuario");

    if (!this.mapService.isMapReady) throw new Error("No hay mapa disponible");

    this.mapService.flyTo(this.placesServices.useLocation!);
  }
}
