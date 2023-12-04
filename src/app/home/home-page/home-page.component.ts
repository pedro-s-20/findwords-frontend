import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

import { ArquivosComponent } from '../../arquivos/arquivos/arquivos.component';
import { TermoDTO } from '../../arquivos/models/termo-dto';
import { TipoPesquisaEnum } from '../../arquivos/models/tipo-pesquisa-enum';
import { ArquivosService } from '../../services/arquivos.service';
import { AppMaterialModule } from '../../shared/app-material/app-material.module';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ArquivosComponent, AppMaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  repeticoes: number[] = [0];
  pesquisaForm: FormGroup;
  tipoPesquisaTotal: TipoPesquisaEnum = TipoPesquisaEnum.TODOS_ITENS;
  tipoPesquisaBooleana: TipoPesquisaEnum = TipoPesquisaEnum.BOOLEANA;
  tipoPesquisaVetorial: TipoPesquisaEnum = TipoPesquisaEnum.VETORIAL;
  tipoPesquisaProbabilistica: TipoPesquisaEnum = TipoPesquisaEnum.PROBABILISTICA;
  tipoPesquisaEscolhido: TipoPesquisaEnum = TipoPesquisaEnum.TODOS_ITENS;
  termosPesquisaBooleana: TermoDTO[] = [];
  fileNames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };
  valorDoInputVetorial: string = '';
  valorDoInputProbabilistico: string = '';
  vetorialForm = new FormControl('');

  constructor(private arquivosService: ArquivosService) {
    this.pesquisaForm = new FormGroup({
      name: new FormControl(),
      age: new FormControl(),
    });
  }

  onUploadFiles(files: Set<File>): void{
    const formData = new FormData();
    for(const file of files){
      formData.append('files', file, file.name);
    }
    this.arquivosService.uploadArchives(formData).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
    location.reload();
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

  onCleanSearch(){
    this.tipoPesquisaEscolhido = TipoPesquisaEnum.TODOS_ITENS;
    this.termosPesquisaBooleana = [];
  }

  pesquisaVetorial(): void{
    this.tipoPesquisaEscolhido = TipoPesquisaEnum.VETORIAL;
    this.valorDoInputVetorial = this.vetorialForm.value ?? ' ';
    console.log('Botão clicado!');
  }

  pesquisaProbabilistica(){
    this.tipoPesquisaEscolhido = TipoPesquisaEnum.PROBABILISTICA;
    console.log('Botão clicado!');
  }

  submit() {
  }

  private reportProgress(httpEvent: HttpEvent<string[]>): void {
    switch(httpEvent.type){
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading...');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if(httpEvent.body instanceof Array) {
          this.fileStatus.status = 'done';
          for(const fileName of httpEvent.body){
            this.fileNames.unshift(fileName);
          }
        }
        this.fileStatus.status = 'done';
        break;
      default:
        console.log(httpEvent);
        break;
    }
  }

  private updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded/total);
  }
}
