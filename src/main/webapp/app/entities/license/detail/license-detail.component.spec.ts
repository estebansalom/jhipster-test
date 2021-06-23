import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LicenseDetailComponent } from './license-detail.component';

describe('Component Tests', () => {
  describe('License Management Detail Component', () => {
    let comp: LicenseDetailComponent;
    let fixture: ComponentFixture<LicenseDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LicenseDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ license: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LicenseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LicenseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load license on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.license).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
