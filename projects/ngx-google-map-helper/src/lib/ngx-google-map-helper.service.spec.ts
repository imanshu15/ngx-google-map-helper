import { TestBed } from '@angular/core/testing';

import { NgxGoogleMapHelperService } from './ngx-google-map-helper.service';

describe('NgxGoogleMapHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxGoogleMapHelperService = TestBed.get(NgxGoogleMapHelperService);
    expect(service).toBeTruthy();
  });
});
