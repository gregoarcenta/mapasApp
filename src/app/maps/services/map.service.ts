import { Injectable } from "@angular/core";
import {
  AnySourceData,
  LngLatBounds,
  LngLatLike,
  Map,
  Marker,
  Popup,
} from "mapbox-gl";
import { DirectionsApiClient } from "../api/directionsApiClient";
import { Directions, Route } from "../interfaces/directions";
import { Feature } from "../interfaces/places";

@Injectable({
  providedIn: "root",
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

  constructor(private directionsApi: DirectionsApiClient) {}

  get isMapReady() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw new Error("El mapa no esta inicializado");

    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });
  }

  createMarkerFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.isMapReady) throw new Error("Mapa no inicializado");

    this.markers.forEach((marker) => marker.remove());

    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;

      const popUp = new Popup().setHTML(`
        <h6>${place.text_es}</h6>
        <span>${place.place_name}</span>
      `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popUp)
        .addTo(this.map!);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if (places.length === 0) {
      this.flyTo(userLocation);
      return;
    }

    //limites del mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach((marker) => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map!.fitBounds(bounds, {
      padding: 150,
    });
  }

  getRoutebetweenPoints(start: [number, number], end: [number, number]) {
    this.directionsApi
      .get<Directions>(`/${start.join(",")};${end.join(",")}`)
      .subscribe((response) => {
        this.drawPolyLine(response.routes[0]);
      });
  }

  private drawPolyLine(route: Route) {
    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();

    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.map!.fitBounds(bounds, {
      padding: 150,
    });

    //polyline

    const sourceData: AnySourceData = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        ],
      },
    };

    //limpiar ruta previa
    if (this.map?.getLayer("routeString")) {
      this.map.removeLayer("routeString");
      this.map.removeSource("routeString");
    }

    this.map!.addSource("routeString", sourceData);

    this.map!.addLayer({
      id: "routeString",
      type: "line",
      source: "routeString",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "black",
        "line-width": 3,
      },
    });
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }
}
