import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './features/home/home.component';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { TokenStorageService } from './core/services/token-storage.service';

/**
 * On a hard refresh, we only have the JWT in localStorage - no in-memory user object yet.
 * This fetches /user/current_user_id once at bootstrap so the navbar and role guards
 * have correct data immediately instead of flickering to a "logged out" state first.
 */
export function initializeAppFactory(authService: AuthService, tokenStorage: TokenStorageService): () => Promise<void> {
  return () =>
    new Promise<void>((resolve) => {
      const token = tokenStorage.getAccessToken();
      if (!token || tokenStorage.isTokenExpired(token)) {
        resolve();
        return;
      }
      authService.fetchCurrentUser().subscribe({
        next: () => resolve(),
        error: () => resolve()
      });
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService, TokenStorageService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
