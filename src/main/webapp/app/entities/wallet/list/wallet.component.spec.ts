import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WalletService } from '../service/wallet.service';

import { WalletComponent } from './wallet.component';

describe('Component Tests', () => {
  describe('Wallet Management Component', () => {
    let comp: WalletComponent;
    let fixture: ComponentFixture<WalletComponent>;
    let service: WalletService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WalletComponent],
      })
        .overrideTemplate(WalletComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WalletComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(WalletService);

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
      expect(comp.wallets?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
