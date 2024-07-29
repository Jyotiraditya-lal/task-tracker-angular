import { Directive, ElementRef, OnInit } from "@angular/core";


@Directive({
    standalone: true,
    selector: '[setVisibility]'
})

export class Visibility implements OnInit{

    constructor(private element: ElementRef){}

    ngOnInit(): void {
        const roleString= localStorage.getItem('role')
        const role= roleString ? JSON.parse(roleString) : ''

        if(role!=='admin'){
            this.element.nativeElement.style.display='none'
        }else{
            this.element.nativeElement.style.display='block'
        }
    }
}