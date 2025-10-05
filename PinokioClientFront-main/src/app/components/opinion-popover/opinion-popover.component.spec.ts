import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionPopoverComponent } from './opinion-popover.component';

describe('OpinionPopoverComponent', () => {
  let component: OpinionPopoverComponent;
  let fixture: ComponentFixture<OpinionPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
