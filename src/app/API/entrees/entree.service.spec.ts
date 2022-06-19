import { TestBed } from '@angular/core/testing';

import { EntreeService } from './entree.service';

describe('EntreeService', () => {
  let service: EntreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
