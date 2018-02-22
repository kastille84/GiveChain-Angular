import { TestBed, inject } from '@angular/core/testing';

import { StickyService } from './sticky.service';

describe('StickyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StickyService]
    });
  });

  // it('should be created', inject([StickyService], (service: StickyService) => {
  //   expect(service).toBeTruthy();
  // }));
});
