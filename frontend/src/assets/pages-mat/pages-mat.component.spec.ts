import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesMatComponent } from './pages-mat.component';

describe('PagesMatComponent', () => {
  let component: PagesMatComponent;
  let fixture: ComponentFixture<PagesMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesMatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagesMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
