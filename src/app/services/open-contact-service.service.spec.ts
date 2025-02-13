import { TestBed } from '@angular/core/testing';

import { OpenContactServiceService } from './open-contact-service.service';

describe('OpenContactServiceService', () => {
  let service: OpenContactServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenContactServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
