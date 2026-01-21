    import { Directive, HostListener, ElementRef } from '@angular/core';

    @Directive({
      selector: '[appEnterAsTab]'
    })
    export class EnterAsTabDirective {

      constructor(private el: ElementRef) {}

      @HostListener('keydown.enter', ['$event'])
      onEnterKeydown(event: KeyboardEvent) {
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
        console.log(event)
        const currentElement = this.el.nativeElement;
        const formElements = Array.from(document.querySelectorAll('input, select, textarea, button')) as HTMLElement[];
        const currentIndex = formElements.indexOf(currentElement);


        if (currentIndex > -1 && currentIndex < formElements.length - 1) {
          const nextElement = formElements[currentIndex + 1];
          nextElement.focus(); // Shift focus to the next element
        }
      }
    }