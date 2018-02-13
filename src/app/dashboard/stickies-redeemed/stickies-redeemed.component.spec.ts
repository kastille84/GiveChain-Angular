import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickiesRedeemedComponent } from './stickies-redeemed.component';

describe('StickiesRedeemedComponent', () => {
  let component: StickiesRedeemedComponent;
  let fixture: ComponentFixture<StickiesRedeemedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickiesRedeemedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickiesRedeemedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
