import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-template',
  imports: [Footer, RouterOutlet, Header],
  templateUrl: './default-template.html',
  styleUrl: './default-template.scss'
})
export class DefaultTemplate {

}
