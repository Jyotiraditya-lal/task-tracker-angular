import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'priorityShade',
  standalone: true
})
export class PriorityShadePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    let color = 'black'; 
    if (value.toLowerCase() === 'high' || value.toLowerCase()==='overdue') {
      color = 'red';
    } else if (value.toLowerCase() === 'medium' || value.toLowerCase()==='ongoing') {
      color = 'orange';
    } else if (value.toLowerCase() === 'low' || value.toLowerCase()==='completed' || value.toLowerCase()==='closed') {
      color = 'green';
    }
    
    return this.sanitizer.bypassSecurityTrustHtml(`<span style="color: ${color};">${value}</span>`);
  }
}
