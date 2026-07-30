import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TripService } from './trip.service';
import { environment } from '../../../environments/environment';

describe('TripService', () => {
  let service: TripService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/trip`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TripService]
    });
    service = TestBed.inject(TripService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a trip', () => {
    const payload = { name: 'Test Trip', places: ['place1'], startDate: '2025-01-01', endDate: '2025-01-10', peopleCount: 2 };
    const mockResponse = { success: true, data: { _id: '1', ...payload } };

    service.createTrip(payload as any).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/create_trip`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should get trip by id', () => {
    const mockResponse = { success: true, data: { _id: '123', name: 'Trip 1' } };

    service.getTripById('123').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/get/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all trips with pagination', () => {
    const mockResponse = { success: true, data: { docs: [], totalDocs: 0, page: 1, limit: 10 } };

    service.getTrips(1, 10).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}/all`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(mockResponse);
  });

  it('should get my trips with pagination', () => {
    const mockResponse = { success: true, data: { docs: [], totalDocs: 0, page: 1, limit: 10 } };

    service.getMyTrips(1, 10).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}/my_trips`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(mockResponse);
  });

  it('should update a trip', () => {
    const payload = { places: ['place2'], peopleCount: 3 };
    const mockResponse = { success: true, data: { _id: '1', ...payload } };

    service.updateTrip('1', payload).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/1/update`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should cancel a trip', () => {
    const mockResponse = { success: true, message: 'Trip cancelled' };

    service.cancelTrip('1').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/1/cancel`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('should join a shared trip', () => {
    const mockResponse = { success: true, data: { _id: '1', peopleCount: 3 } };

    service.joinSharedTrip('1', 2).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/1/join`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ peopleCount: 2 });
    req.flush(mockResponse);
  });
});
