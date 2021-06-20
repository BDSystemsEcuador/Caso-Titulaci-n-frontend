import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoryFormComponent } from './convocatory-form.component';

describe('ConvocatoryFormComponent', () => {
  let component: ConvocatoryFormComponent;
  let fixture: ComponentFixture<ConvocatoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvocatoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvocatoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
