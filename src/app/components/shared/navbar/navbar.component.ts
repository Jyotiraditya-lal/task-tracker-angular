import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { MenubarModule } from 'primeng/menubar'
import { TooltipModule } from "primeng/tooltip";


@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    standalone: true,
    imports: [CommonModule,FormsModule,MenubarModule,TooltipModule]
})

export class NavbarComponent implements OnInit{
    menu: MenuItem[]=[]

    constructor(private router: Router){}

    ngOnInit(): void {
        this.menu=[
            {icon: 'fa-solid fa-house',command: ()=>{this.navigateTo('')}, tooltipOptions: {tooltipLabel: 'Home',tooltipPosition:'bottom'}},
            {icon: 'fa-solid fa-list-check',command: ()=>{this.navigateTo('/all-tasks')}, tooltipOptions: {tooltipLabel: 'All tasks',tooltipPosition:'bottom'}},
            {icon: 'fa-regular fa-user',command: ()=>{this.navigateTo('my-tasks')}, tooltipOptions: {tooltipLabel: 'My tasks',tooltipPosition: 'bottom'}},
            {icon: 'fa-solid fa-folder-closed', command: ()=>{this.navigateTo('closed-tasks')}, tooltipOptions: {tooltipLabel: 'Closed tasks',tooltipPosition:'bottom'}},
            {icon: 'fa-solid fa-right-from-bracket', command: ()=>{this.logout()},tooltipOptions: {tooltipLabel: 'logout',tooltipPosition: 'bottom'}}
        ]
    }

    navigateTo(route: string){
        this.router.navigate([route])
    }

    logout(){
        localStorage.removeItem('loggedin')
        localStorage.removeItem('login')
        localStorage.removeItem('role')
        this.router.navigate(['/login'])
    }
}

