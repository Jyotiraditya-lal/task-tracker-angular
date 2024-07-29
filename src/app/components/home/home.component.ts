import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { addTaskComponent } from "../shared/add-task/add-task.component";
import { Visibility } from "../../directives/visibility.directive";
import { NavbarComponent } from "../shared/navbar/navbar.component";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [ButtonModule,addTaskComponent,Visibility,NavbarComponent]
})

export class HomeComponent{}