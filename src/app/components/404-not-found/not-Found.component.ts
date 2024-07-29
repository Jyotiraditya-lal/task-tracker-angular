import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-Found.component.html',
  styleUrls: ['./not-Found.component.scss'],
  standalone: true,
  imports: [RouterOutlet]
})
export class NotFoundComponent {

    constructor(private router: Router){}

    navigateTo(){
        this.router.navigate([''])
    }
}
