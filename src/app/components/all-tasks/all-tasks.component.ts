import { Component, OnInit } from "@angular/core";
import { tableComponent } from "../shared/table/table.component";
import { NavbarComponent } from "../shared/navbar/navbar.component";


@Component({
    selector: 'all-tasks',
    templateUrl: './all-tasks.component.html',
    styleUrls: ['./all-tasks.component.scss'],
    standalone: true,
    imports: [tableComponent,NavbarComponent]
})

export class AllTasksComponent implements OnInit{
    tasks: any[]=[]

    ngOnInit(): void {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const taskString= localStorage.getItem('tasks')
            this.tasks= taskString ? JSON.parse(taskString): []
        }
    }
}