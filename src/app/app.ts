import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Home } from "./home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
