import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DocumentacaoDTO } from '../models/documentacao-dto';
import { AppMaterialModule } from '../../shared/app-material/app-material.module';
import { ArquivosService } from '../services/arquivos.service';

@Component({
  selector: 'app-arquivos',
  standalone: true,
  imports: [CommonModule, AppMaterialModule],
  templateUrl: './arquivos.component.html',
  styleUrl: './arquivos.component.scss'
})
export class ArquivosComponent implements OnInit{
  documentos: DocumentacaoDTO[] = [];
  displayedColumns = ['id', 'nome', 'download'];

  constructor(private arquivosService: ArquivosService){
  }

  ngOnInit(): void {
    this.documentos = this.arquivosService.list();
  }

}
