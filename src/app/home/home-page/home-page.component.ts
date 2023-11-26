import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ArquivosComponent } from '../../arquivos/arquivos/arquivos.component';
import { AppMaterialModule } from '../../shared/app-material/app-material.module';
import { OperadorProximo } from '../models/operador-logico-enum';
import { FormControl, FormGroup } from '@angular/forms';
import { ArquivosService } from '../../services/arquivos.service';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ArquivosComponent, AppMaterialModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  repeticoes: number[] = [0];
  operadorProximo: OperadorProximo = OperadorProximo.AND;
  pesquisaForm: FormGroup;

  constructor(private arquivosService: ArquivosService) {
    this.pesquisaForm = new FormGroup({
      name: new FormControl(),
      age: new FormControl(),
    });
  }

  onUploadArquivo(files: File[]): void{
    const formData = new FormData();
    for(const file of files){
      formData.append('files', file, file.name);
      this.arquivosService.uploadArchives(formData).subscribe(
        event => this.reportProgress(event),
        (error: HttpErrorResponse) => console.log(error)
      );
    }
  }

  onAddTerm(){
    if (this.repeticoes.length > 0 && this.repeticoes.length < 5) {
      const proximoNumero = this.repeticoes.length + 1;
      this.repeticoes.push(proximoNumero);
    }
  }

  onRemoveTerm(){
    if (this.repeticoes.length > 1 && this.repeticoes.length <= 5) {
      this.repeticoes.pop();
    }
  }

  submit(){
    const data = this.pesquisaForm.value;
    console.log(data);
  }

  private reportProgress(event: HttpEvent<string[]>) {
    throw new Error('Method not implemented.');
  }
}
