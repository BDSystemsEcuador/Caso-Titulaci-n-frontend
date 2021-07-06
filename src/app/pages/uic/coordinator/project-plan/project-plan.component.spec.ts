import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPlanComponent } from './project-plan.component';

describe('ProjectPlanComponent', () => {
  let component: ProjectPlanComponent;
  let fixture: ComponentFixture<ProjectPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
