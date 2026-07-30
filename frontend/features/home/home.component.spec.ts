import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [SharedModule, NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have four route stops', () => {
    expect(component.routeStops.length).toBe(4);
  });

  it('should have correct route stop labels', () => {
    const labels = component.routeStops.map(s => s.label);
    expect(labels).toEqual(['Pick places', 'Choose a guide', 'Choose a driver', 'Take the trip']);
  });

  it('should have correct route stop icons', () => {
    const icons = component.routeStops.map(s => s.icon);
    expect(icons).toEqual(['place', 'hiking', 'local_taxi', 'flight_takeoff']);
  });

  it('should render hero title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    expect(h1?.textContent).toContain('Your route through Egypt');
  });

  it('should render build trip and explore places buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('a[mat-flat-button], a[mat-stroked-button]');
    expect(buttons.length).toBe(2);
    expect(buttons[0]?.textContent).toContain('Build a trip');
    expect(buttons[1]?.textContent).toContain('Explore places');
  });
});
