import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

const appConfig: ApplicationConfig = {providers: [provideRouter(routes), provideAnimations()]};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
    

  
