import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyCreateComponent } from './sticky-create.component';

describe('StickyCreateComponent', () => {
  let component: StickyCreateComponent;
  let fixture: ComponentFixture<StickyCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickyCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
