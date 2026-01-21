import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComJsonTree } from './com-json-tree.component';

describe('SalesComponent', () => {
  let component: ComJsonTree;
  let fixture: ComponentFixture<ComJsonTree>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComJsonTree ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComJsonTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
