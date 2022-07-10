import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

//imports modules
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MapsModule } from "./maps/maps.module";

//Cambiar el idioma de la data
/* import localEs from "@angular/common/locales/es-EC";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localEs);
 */
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgbModule, MapsModule, HttpClientModule],
  providers: [
    /* { provide: LOCALE_ID, useValue: "es-EC" } */
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
