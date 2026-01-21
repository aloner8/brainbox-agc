import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMatFieldComponent } from './form-mat-field.component';

describe('FormMatFieldComponent', () => {
  let component: FormMatFieldComponent;
  let fixture: ComponentFixture<FormMatFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMatFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormMatFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
