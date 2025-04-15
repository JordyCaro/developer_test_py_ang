import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Calculadora de Área de Manchas</h1>
      </header>
      <main class="container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app-header {
      background-color: #3f51b5;
      color: white;
      padding: 16px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    main {
      flex: 1;
      padding: 24px;
    }
  `]
})
export class AppComponent {
  title = 'Calculadora de Área de Manchas';
} 