jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WalletService } from '../service/wallet.service';
import { IWallet, Wallet } from '../wallet.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/service/user-details.service';
import { IIcon } from 'app/entities/icon/icon.model';
import { IconService } from 'app/entities/icon/service/icon.service';

import { WalletUpdateComponent } from './wallet-update.component';

describe('Component Tests', () => {
  describe('Wallet Management Update Component', () => {
    let comp: WalletUpdateComponent;
    let fixture: ComponentFixture<WalletUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let walletService: WalletService;
    let userDetailsService: UserDetailsService;
    let iconService: IconService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WalletUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(WalletUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WalletUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      walletService = TestBed.inject(WalletService);
      userDetailsService = TestBed.inject(UserDetailsService);
      iconService = TestBed.inject(IconService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UserDetails query and add missing value', () => {
        const wallet: IWallet = { id: 456 };
        const user: IUserDetails = { id: 77018 };
        wallet.user = user;

        const userDetailsCollection: IUserDetails[] = [{ id: 96844 }];
        jest.spyOn(userDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: userDetailsCollection })));
        const additionalUserDetails = [user];
        const expectedCollection: IUserDetails[] = [...additionalUserDetails, ...userDetailsCollection];
        jest.spyOn(userDetailsService, 'addUserDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ wallet });
        comp.ngOnInit();

        expect(userDetailsService.query).toHaveBeenCalled();
        expect(userDetailsService.addUserDetailsToCollectionIfMissing).toHaveBeenCalledWith(
          userDetailsCollection,
          ...additionalUserDetails
        );
        expect(comp.userDetailsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Icon query and add missing value', () => {
        const wallet: IWallet = { id: 456 };
        const icon: IIcon = { id: 36036 };
        wallet.icon = icon;

        const iconCollection: IIcon[] = [{ id: 61859 }];
        jest.spyOn(iconService, 'query').mockReturnValue(of(new HttpResponse({ body: iconCollection })));
        const additionalIcons = [icon];
        const expectedCollection: IIcon[] = [...additionalIcons, ...iconCollection];
        jest.spyOn(iconService, 'addIconToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ wallet });
        comp.ngOnInit();

        expect(iconService.query).toHaveBeenCalled();
        expect(iconService.addIconToCollectionIfMissing).toHaveBeenCalledWith(iconCollection, ...additionalIcons);
        expect(comp.iconsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const wallet: IWallet = { id: 456 };
        const user: IUserDetails = { id: 30871 };
        wallet.user = user;
        const icon: IIcon = { id: 64237 };
        wallet.icon = icon;

        activatedRoute.data = of({ wallet });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(wallet));
        expect(comp.userDetailsSharedCollection).toContain(user);
        expect(comp.iconsSharedCollection).toContain(icon);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Wallet>>();
        const wallet = { id: 123 };
        jest.spyOn(walletService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ wallet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: wallet }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(walletService.update).toHaveBeenCalledWith(wallet);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Wallet>>();
        const wallet = new Wallet();
        jest.spyOn(walletService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ wallet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: wallet }));
        saveSubject.complete();

        // THEN
        expect(walletService.create).toHaveBeenCalledWith(wallet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Wallet>>();
        const wallet = { id: 123 };
        jest.spyOn(walletService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ wallet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(walletService.update).toHaveBeenCalledWith(wallet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserDetailsById', () => {
        it('Should return tracked UserDetails primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserDetailsById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackIconById', () => {
        it('Should return tracked Icon primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackIconById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
