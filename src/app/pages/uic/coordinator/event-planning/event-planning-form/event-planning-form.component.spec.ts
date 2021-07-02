import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlanningFormComponent } from './event-planning-form.component';

describe('EventPlanningFormComponent', () => {
  let component: EventPlanningFormComponent;
  let fixture: ComponentFixture<EventPlanningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPlanningFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlanningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
