import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Modal2Page } from './modal.page';

describe('ModalPage', () => {
  let component: Modal2Page;
  let fixture: ComponentFixture<Modal2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Modal2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Modal2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
