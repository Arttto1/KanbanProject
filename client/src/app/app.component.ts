import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavLayoutComponent } from './components/nav-layout/nav-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Kanban Project';
}
