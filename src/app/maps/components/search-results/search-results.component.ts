import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { LngLat, LngLatLike } from "mapbox-gl";
import { Feature } from "../../interfaces/places";
import { MapService } from "../../services/map.service";
import { PlacesService } from "../../services/places.service";

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.component.html",
  styleUrls: ["./search-results.component.css"],
})
export class SearchResultsComponent {
  selectedId: string = "";
  @Output() onClearInputSearch = new EventEmitter<string>();
  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  public get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  public get places(): Feature[] {
    return this.placesService.places;
  }

  mapToFly(place: Feature) {
    const [Lng, lat] = place.center;
    this.selectedId = place.id;
    this.mapService.flyTo([Lng, lat]);
  }

  getDirections(place: Feature) {
    this.placesService.deletePlaces();
    this.onClearInputSearch.emit("");
    this.mapService.createMarkerFromPlaces(
      [place],
      this.placesService.useLocation!
    );
    const start = this.placesService.useLocation!;
    const end = place.center as [number, number];
    this.mapService.getRoutebetweenPoints(start, end);
  }
}
