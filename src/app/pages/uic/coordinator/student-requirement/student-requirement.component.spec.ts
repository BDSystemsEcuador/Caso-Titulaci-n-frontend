import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRequirementComponent } from './student-requirement.component';

describe('StudentRequirementComponent', () => {
  let component: StudentRequirementComponent;
  let fixture: ComponentFixture<StudentRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
