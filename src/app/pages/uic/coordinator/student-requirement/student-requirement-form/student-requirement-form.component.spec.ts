import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRequirementFormComponent } from './student-requirement-form.component';

describe('StudentRequirementFormComponent', () => {
  let component: StudentRequirementFormComponent;
  let fixture: ComponentFixture<StudentRequirementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentRequirementFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRequirementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
