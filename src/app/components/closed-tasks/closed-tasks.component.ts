import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { tableComponent } from "../shared/table/table.component";


@Component({
    selector: 'closed-task',
    templateUrl: './closed-tasks.component.html',
    standalone: true,
    imports: [NavbarComponent,tableComponent]
})

export class ClosedTaskComponent implements OnInit{

    tasks: any[]=[]

    ngOnInit(): void {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const closedTaskString= localStorage.getItem('closedTasks')
            this.tasks= closedTaskString ? JSON.parse(closedTaskString): []
        }
    }

    UpdateClosedTasks(task: any){
        this.tasks=[...task]
    }
    
}