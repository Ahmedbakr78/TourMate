import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './core/components/toast-container.component';
import { AuthService } from './core/services/auth.service';
import { AppStore } from './core/store/app.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `<router-outlet></router-outlet><app-toast />`,
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private store = inject(AppStore);

  ngOnInit() {
    const theme = localStorage.getItem('tm_theme') as 'dark' | 'light' | null;
    if (theme) this.store.setTheme(theme);
    if (this.auth.user) {
      this.store.setUser(this.auth.user);
    }
  }
}
