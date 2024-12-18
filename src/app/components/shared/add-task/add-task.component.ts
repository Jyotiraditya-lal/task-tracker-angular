import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { SidebarModule } from 'primeng/sidebar';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from "primeng/tooltip";
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from "@angular/common/http";
import { CalendarModule } from 'primeng/calendar';
import { Router } from "@angular/router";

@Component({
    selector: 'add-task',
    templateUrl: './add-task.component.html',
    standalone: true,
    imports: [ButtonModule, SidebarModule, CommonModule, ReactiveFormsModule, CalendarModule, FormsModule, ListboxModule, TooltipModule, DropdownModule, InputTextModule, HttpClientModule],
    
})
export class addTaskComponent implements OnInit {

    sidebarVisible: boolean = false;
    taskObj: string = '';
    objectives: any[] = [];
    users: any[] = [];
    priorityOptions: string[] = [];
    addedTask: any[] = [];
    minDate = new Date();
    @Output() taskEmitter = new EventEmitter<any>

    addTaskForm = this.fb.group({
        'taskName': new FormControl('', Validators.required),
        'startDate': new FormControl('', Validators.required),
        'taskObj': new FormControl(''),
        'assignedTo': new FormControl('', Validators.required),
        'priority': new FormControl('', Validators.required)
    });

    constructor(private fb: FormBuilder, private router: Router) { }

    ngOnInit() {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const storedUsersString = localStorage.getItem('Taskusers');
            this.users = storedUsersString ? JSON.parse(storedUsersString) : [];

            const storedTasksString = localStorage.getItem('tasks');
            this.addedTask = storedTasksString ? JSON.parse(storedTasksString) : [];
        }

        this.priorityOptions = ['high', 'medium', 'low'];
    }

    addObjectives() {
        const obj = this.addTaskForm.get('taskObj')?.value;
        if (obj) {
            this.objectives = [...this.objectives, { objective: obj, checked: false }];
            this.addTaskForm.get('taskObj')?.setValue('');
        }
    }

    onReset() {
        this.addTaskForm.reset();
        this.addTaskForm.markAsPristine();
        this.addTaskForm.markAsUntouched();
        this.objectives = [];
    }

    onSubmit() {
        if (this.addTaskForm.valid) {
            this.addedTask = [...this.addedTask, {
                id: Math.random(),
                taskName: this.addTaskForm.get('taskName')?.value,
                taskObjectives: this.objectives,
                assignedTo: this.addTaskForm.get('assignedTo')?.value,
                priority: this.addTaskForm.get('priority')?.value,
                startDate: this.addTaskForm.get('startDate')?.value,
                status: 'yet to start'
            }];

            localStorage.setItem('tasks', JSON.stringify(this.addedTask));

            this.sidebarVisible = false;
            this.addTaskForm.reset()
            this.objectives = [];
            this.router.navigate(['/all-tasks'])
            this.taskEmitter.emit(this.addedTask)
        }
    }
}
