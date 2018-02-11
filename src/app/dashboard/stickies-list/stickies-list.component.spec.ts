import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickiesListComponent } from './stickies-list.component';

describe('StickiesListComponent', () => {
  let component: StickiesListComponent;
  let fixture: ComponentFixture<StickiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
