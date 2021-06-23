import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LicenseService } from '../service/license.service';

import { LicenseComponent } from './license.component';

describe('Component Tests', () => {
  describe('License Management Component', () => {
    let comp: LicenseComponent;
    let fixture: ComponentFixture<LicenseComponent>;
    let service: LicenseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LicenseComponent],
      })
        .overrideTemplate(LicenseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LicenseComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LicenseService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.licenses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
