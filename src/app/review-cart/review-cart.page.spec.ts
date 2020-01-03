import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReviewCartPage } from './review-cart.page';

describe('ReviewCartPage', () => {
  let component: ReviewCartPage;
  let fixture: ComponentFixture<ReviewCartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCartPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
