import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TableModule } from 'primeng/table';
import { KnobModule } from 'primeng/knob';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { Visibility } from "../../../directives/visibility.directive";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { CheckboxModule } from 'primeng/checkbox';
import { PriorityShadePipe } from "../../../pipes/priority-shade.pipe";
import { addTaskComponent } from "../add-task/add-task.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { SidebarModule } from "primeng/sidebar";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";

@Component({
    selector: 'table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [TableModule, KnobModule, FormsModule, ButtonModule, TooltipModule, Visibility, CommonModule, CardModule, PriorityShadePipe, CheckboxModule, addTaskComponent, ConfirmDialogModule, ToastModule, SidebarModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputTextModule],
    providers: [ConfirmationService, MessageService]
})
export class tableComponent implements OnInit {

    @Input() tasks: any[] = [];
    @Input() caption: string = '';
    @Output() closed = new EventEmitter<any>
    @Output() emitUserTask = new EventEmitter<any>
    @Output() emitAllTask = new EventEmitter<any>

    showDetails: boolean = false;
    originalTaskData: any[] = [];
    task: any[] = [];
    closedTask: any[] = [];
    originalTaskState: any = null;
    sidebarVisible: boolean = false
    users: any[] = []
    priorityOptions: any[] = []
    editTaskForm!: FormGroup;
    role: string = ''
    isTaskClosed: boolean = false;

    constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private fb: FormBuilder) { }



    ngOnInit(): void {
        this.originalTaskData = [...this.tasks];
        const storedClosedTasks = localStorage.getItem('closedTasks');
        this.closedTask = storedClosedTasks ? JSON.parse(storedClosedTasks) : [];

        const storedUsersString = localStorage.getItem('users');
        this.users = storedUsersString ? JSON.parse(storedUsersString) : [];

        this.priorityOptions = ['high', 'medium', 'low'];

        const roleString = localStorage.getItem('role');
        this.role = roleString ? JSON.parse(roleString) : '';

    }


    calculateCompletion(objectives: any[]): number {
        if (!objectives || objectives.length === 0) {
            return 0;
        }

        let totalObjectives = objectives.length;
        let completedObjectives = objectives.filter(obj => obj.checked).length;

        return (completedObjectives / totalObjectives) * 100;
    }

    calcTemplateVal(objectives: any[]) {
        let completedObjectives = objectives.filter(obj => obj.checked).length;
        return completedObjectives;
    }

    calcStatus(task: {
        [x: string]: any; startDate: string | number | Date; priority: any; taskObjectives: any[]; closed: any;
    }) {
        const today = new Date();
        const startDate = new Date(task.startDate);
        const deadline = this.calcDeadline(task.startDate, task.priority);
        const allObjectivesComplete = task.taskObjectives.every((obj: any) => obj.checked);
        const anyObjectiveChecked = task.taskObjectives.some((obj: any) => obj.checked);


        const closed = this.closedTask.find((t: { id: any; }) => t.id === task["id"]);

        if (closed) {
            task["status"] = 'Closed';
        } else if (allObjectivesComplete) {
            task["status"] = 'Completed';
        } else if (anyObjectiveChecked && today <= deadline) {
            task["status"] = 'Ongoing';
        } else if (today > deadline && !allObjectivesComplete) {
            task["status"] = 'Overdue';
        } else if (today < startDate) {
            task["status"] = 'Yet to start';
        } else if (today >= startDate && today <= deadline) {
            task["status"] = 'To do';
        }

        return task["status"];
    }


    calcDeadline(date: any, priority: any): Date {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        let result = new Date(date);

        if (priority === 'high') {
            result.setDate(result.getDate() + 3);
        } else if (priority === 'medium') {
            result.setDate(result.getDate() + 7);
        } else {
            result.setDate(result.getDate() + 14);
        }

        return result;
    }


    showDetailsPage(t: any) {

        if (this.caption === 'All tasks' && this.role === 'admin') {
            this.task = [t];
            this.originalTaskState = JSON.parse(JSON.stringify(t));
            this.showDetails = true;
        } else if (this.caption === 'My tasks' || this.caption === 'Closed tasks') {
            this.task = [t];
            this.originalTaskState = JSON.parse(JSON.stringify(t));
            this.showDetails = true;
        }

        this.isTaskClosed = this.task[0].status === 'Closed' ? true : false;
    }

    onCancel() {
        if (this.caption !== 'Closed tasks') {
            const storedTaskString = localStorage.getItem('tasks');
            const storedTask = storedTaskString ? JSON.parse(storedTaskString) : [];

            const updatedTaskIndex = storedTask.findIndex((t: { id: any; }) => t.id === this.task[0].id);

            const taskIndex = this.tasks.findIndex(t => t.id === this.task[0].id)

            if (taskIndex !== -1) {
                this.tasks[taskIndex].taskObjectives = [...storedTask[updatedTaskIndex].taskObjectives]
            }
        }
        this.task = [];


        this.showDetails = false;
    }

    onSave(flag: boolean) {

        if (this.caption === 'My tasks') {
            const storedTaskString = localStorage.getItem('tasks');
            const storedTask = storedTaskString ? JSON.parse(storedTaskString) : [];

            const updatedTaskIndex = storedTask.findIndex((t: { id: any; }) => t.id === this.task[0].id);
            if (updatedTaskIndex !== -1) {
                storedTask[updatedTaskIndex].taskObjectives = this.task[0].taskObjectives;
                localStorage.setItem('tasks', JSON.stringify(storedTask));
            }

            this.emitUserTask.emit(this.tasks)
        } else {
            this.tasks = this.tasks.map(t => {
                if (t.id === this.task[0].id) {
                    return { ...this.task[0] };
                }
                return t;
            });

            localStorage.setItem('tasks', JSON.stringify(this.tasks));

            this.emitAllTask.emit(this.tasks)
        }

        if (flag) {
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Changes saved successfully' })
            this.showDetails = false;
        }

    }

    emittedTask(taskEmitted: any) {
        this.tasks = [...taskEmitted];
    }

    areAllObjectivesComplete(objectives: any[]): boolean {
        return objectives.every(obj => obj.checked);
    }

    onClose() {

        this.task[0].status = 'closed'
        this.isTaskClosed = true;
        this.onSave(false);

        const taskId = this.task[0].id;
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);

        if (this.caption === 'All tasks') {
            if (taskIndex !== -1) {
                const closedTask = this.tasks.splice(taskIndex, 1)[0];
                this.closedTask.push(closedTask);

                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                localStorage.setItem('closedTasks', JSON.stringify(this.closedTask));

                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task closed successfully' })
            }
        } else {

            const taskString = localStorage.getItem('tasks');
            const storedTasks = taskString ? JSON.parse(taskString) : [];
            const storedTaskIndex = storedTasks.findIndex((t: { id: any; }) => t.id === taskId);

            if (storedTaskIndex !== -1) {
                storedTasks.splice(storedTaskIndex, 1);

                const closedTask = this.tasks.splice(taskIndex, 1)[0];
                this.closedTask.push(closedTask);

                localStorage.setItem('tasks', JSON.stringify(storedTasks));
                localStorage.setItem('closedTasks', JSON.stringify(this.closedTask));

                this.emitUserTask.emit(this.tasks)

                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task closed successfully' });
            }
        }
    }

    onReopen(task: any) {

        const taskString = localStorage.getItem('tasks');
        let tasksStored = taskString ? JSON.parse(taskString) : [];

        const reopenTask = this.closedTask.find((t: { id: any; }) => t.id === task.id);
        this.closedTask = this.closedTask.filter((t: { id: any; }) => t.id !== task.id);

        if (reopenTask) {
            tasksStored = [...tasksStored, reopenTask];
        }

        localStorage.setItem('closedTasks', JSON.stringify(this.closedTask));
        localStorage.setItem('tasks', JSON.stringify(tasksStored));

        this.closed.emit(this.closedTask)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task reopened successfully' })


    }

    onDelete() {

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this task?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonStyleClass: "p-button-text",
            acceptIcon: "none",
            rejectIcon: "none",
            accept: () => {
                if (this.caption === 'My tasks') {
                    const storedTaskString = localStorage.getItem('tasks');
                    const storedTask = storedTaskString ? JSON.parse(storedTaskString) : [];

                    const userString = localStorage.getItem('login');
                    const user = userString ? JSON.parse(userString) : [];

                    const updatedTask = storedTask.filter((t: { id: any; }) => t.id !== this.task[0].id);
                    localStorage.setItem('tasks', JSON.stringify(updatedTask));

                    const userTask = storedTask.filter((t: { id: any; assignedTo: { name: any; }; }) => t.assignedTo.name === user[0].name && t.id !== this.task[0].id);
                    this.emitUserTask.emit(userTask)

                } else {
                    this.tasks = this.tasks.filter((t: { id: any; }) => t.id !== this.task[0].id)
                    localStorage.setItem('tasks', JSON.stringify(this.tasks))
                }

                this.messageService.add({ severity: 'success', summary: 'success', detail: 'Task deleted successfully' })
                this.showDetails = false

            }
        })
    }

    //edit

    onEdit() {
        this.sidebarVisible = true,
            this.editTaskForm = this.fb.group({
                'taskObj': new FormControl(''),
                'assignedTo': new FormControl(this.task[0].assignedTo),
                'priority': new FormControl(this.task[0].priority),
            })
    }

    addObjectives() {
        const newObjective = this.editTaskForm.value.taskObj;
        const editTaskIndex = this.tasks.findIndex(t => t.id === this.task[0].id)

        if (newObjective) {
            this.tasks[editTaskIndex].taskObjectives.push({ objective: newObjective, checked: false });
            this.editTaskForm.get('taskObj')?.reset()

        }
    }

    removeObjective(index: any) {
        const editTaskIndex = this.tasks.findIndex(t => t.id === this.task[0].id)

        this.tasks[editTaskIndex].taskObjectives.splice(index, 1);

    }

    onSubmit() {
        const editTaskIndex = this.tasks.findIndex(t => t.id === this.task[0].id);
    
        const previousAssignedTo = this.task[0].assignedTo;
        const newAssignedTo = this.editTaskForm.get('assignedTo')?.value;
        const newPriority = this.editTaskForm.get('priority')?.value;
    
        const isAssignedToChanged = previousAssignedTo !== newAssignedTo;
    
        this.tasks[editTaskIndex].assignedTo = newAssignedTo;
        this.tasks[editTaskIndex].priority = newPriority;
    
        this.task[0].assignedTo = newAssignedTo;
        this.task[0].priority = newPriority;
    
        if (this.caption === 'All tasks') {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } else {
            const storedTaskString = localStorage.getItem('tasks');
            const storedTask = storedTaskString ? JSON.parse(storedTaskString) : [];
            const updatedTaskIndex = storedTask.findIndex((t: { id: any; }) => t.id === this.task[0].id);
    
            storedTask[updatedTaskIndex].assignedTo = newAssignedTo;
            storedTask[updatedTaskIndex].priority = newPriority;
    
            localStorage.setItem('tasks', JSON.stringify(storedTask));
        }
    
        if (isAssignedToChanged && this.caption === 'My tasks') {
            this.tasks = this.tasks.filter((t: { id: any; }) => t.id !== this.task[0].id);
            this.emitUserTask.emit(this.tasks);
        }
    
        this.onSave(false);
    
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Changes saved successfully' });
    
        this.sidebarVisible = false;
    }
    

}