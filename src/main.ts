import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircleOutline,heart, heartOutline } from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  'information-circle-outline': informationCircleOutline,
  'heart': heart,
  'heart-outline': heartOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ],
});
