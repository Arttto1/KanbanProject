import { Component } from '@angular/core';
import { DefaultAuthLayoutComponent } from '../../components/default-auth-layout/default-auth-layout.component';
import {
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface SignupForm {
  username: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultAuthLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  providers: [LoginService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignUpComponent {
  signupForm!: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submit() {
    // Checa se a senha e confirmação são iguais
    if (
      this.signupForm.value.password !== this.signupForm.value.passwordConfirm
    ) {
      this.toastService.error('As senhas não coincidem!');
      return;
    }

    if (this.signupForm.valid) {
      const { username, password, email } = this.signupForm.value;
      this.loginService.signup(username, password, email).subscribe({
        next: () => {
          this.toastService.success('Usuário criado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: () =>
          this.toastService.error(
            'Erro ao criar o usuário. Tente novamente mais tarde.'
          ),
      });
    }
  }

  navigate() {
    this.router.navigate(['login']);
  }
}
