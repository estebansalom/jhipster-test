import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CurrencyService } from '../service/currency.service';

import { CurrencyComponent } from './currency.component';

describe('Component Tests', () => {
  describe('Currency Management Component', () => {
    let comp: CurrencyComponent;
    let fixture: ComponentFixture<CurrencyComponent>;
    let service: CurrencyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CurrencyComponent],
      })
        .overrideTemplate(CurrencyComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CurrencyComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CurrencyService);

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
      expect(comp.currencies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
