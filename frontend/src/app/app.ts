import { ApplicationRef, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Homepage } from "./components/homepage/homepage";
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('devWeb');
}

// const appRef: ApplicationRef = await bootstrapApplication(App);