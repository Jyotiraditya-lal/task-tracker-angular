import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from 'primeng/toast'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, ReactiveFormsModule, ToastModule, InputTextModule],
    providers: [MessageService]

})

export class loginComponent {

    constructor(private formBuilder: FormBuilder, private router: Router, private messageService: MessageService) { }

    loginForm = this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    })

    onSubmit() {
        const storedUsersString = localStorage.getItem('users')
        const storedUsers = storedUsersString ? JSON.parse(storedUsersString) : []

        const user = storedUsers.filter((u: { email: string | null | undefined; }) => u.email === this.loginForm.get('email')?.value)

        if (user.length === 0) {
            this.messageService.add({ severity: 'error', summary: 'incorrect email', detail: 'No user found.Please check the entered email' })
        } else {
            if (user && user[0].password === this.loginForm.get('password')?.value) {
                this.router.navigate([''])
                localStorage.setItem('loggedin', JSON.stringify(true))
                localStorage.setItem('login',JSON.stringify(user))
                localStorage.setItem('role', JSON.stringify(user[0].role))
            } else if (user && user[0].password !== this.loginForm.get('password')?.value) {
                this.messageService.add({ severity: 'error', summary: 'Incorrect password', detail: 'The password is incorrect' })
            }
        }
    }
}