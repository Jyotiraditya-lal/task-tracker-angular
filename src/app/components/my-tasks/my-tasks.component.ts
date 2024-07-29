import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { tableComponent } from "../shared/table/table.component";

@Component({
    selector: 'my-tasks',
    templateUrl: './my-tasks.component.html',
    standalone: true,
    imports: [NavbarComponent, tableComponent]
})
export class MyTaskComponent implements OnInit {

    tasks: any[] = [];

    ngOnInit(): void {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const userString = localStorage.getItem('login');
            const user = userString ? JSON.parse(userString) : [];

            const taskString = localStorage.getItem('tasks');
            const allTasks = taskString ? JSON.parse(taskString) : [];

            this.tasks = allTasks.filter((t: { assignedTo: { name: any; }; }) => t.assignedTo.name === user[0].name);
        }
    }

    emittedTaskFUnction(task:any){
        this.tasks=[...task]
    }
}
