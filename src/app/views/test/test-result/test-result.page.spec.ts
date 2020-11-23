import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestResultPage } from './test-result.page';

describe('TestResultPage', () => {
  let component: TestResultPage;
  let fixture: ComponentFixture<TestResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
