import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AppMaterialModule } from '../../shared/app-material/app-material.module';
import { ArquivosComponent } from '../../arquivos/arquivos.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ArquivosComponent, AppMaterialModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
