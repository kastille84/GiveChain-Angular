import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickiesReservedComponent } from './stickies-reserved.component';

describe('StickiesReservedComponent', () => {
  let component: StickiesReservedComponent;
  let fixture: ComponentFixture<StickiesReservedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickiesReservedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickiesReservedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
