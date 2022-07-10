import { Injectable } from "@angular/core";
import { PlacesApiClient } from "../api/placesApiClient";
import { Feature, Places } from "../interfaces/places";
import { MapService } from "./map.service";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  public useLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  constructor(
    private placesApi: PlacesApiClient,
    private mapServices: MapService
  ) {
    this.getUserLocation();
  }

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  private getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.useLocation = [coords.longitude, coords.latitude];
          resolve(this.useLocation);
        },
        (error) => {
          alert("No se pudo obtener la geolocalización");
          reject(error);
        }
      );
    });
  }

  getPlacesByQuery(query: string = "") {
    if (!this.useLocation) throw new Error("No existe userLocation");

    this.isLoadingPlaces = true;

    this.placesApi
      .get<Places>(`/${query}.json?`, {
        params: {
          country: "ec",
          proximity: this.useLocation.join(","),
          types: "poi",
        },
      })
      .subscribe((resp) => {
        this.isLoadingPlaces = false;
        this.places = resp.features;
        this.mapServices.createMarkerFromPlaces(this.places, this.useLocation!);
      });
  }

  deletePlaces() {
    this.places = [];
  }
}
