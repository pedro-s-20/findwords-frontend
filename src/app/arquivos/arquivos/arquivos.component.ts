import { DocumentacaoDTO, PageDTO } from './../models/documentacao-dto';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { finalize, tap } from 'rxjs';

import { ArquivosService } from '../../services/arquivos.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppMaterialModule } from '../../shared/app-material/app-material.module';
import { TipoPesquisaEnum } from '../models/tipo-pesquisa-enum';
import { TermoDTO } from '../models/termo-dto';

@Component({
  selector: 'app-arquivos',
  standalone: true,
  imports: [CommonModule, AppMaterialModule],
  templateUrl: './arquivos.component.html',
  styleUrl: './arquivos.component.scss'
})
export class ArquivosComponent implements OnInit, AfterViewInit {
  page: PageDTO | undefined;
  documentos: MatTableDataSource<DocumentacaoDTO> = new MatTableDataSource();
  isLoading: boolean = false;
  @Input() tipoPesquisa!: TipoPesquisaEnum | TipoPesquisaEnum.TODOS_ITENS;
  @Input() termosPesquisaBooleana!: TermoDTO[];

  displayedColumns = ['id', 'nome', 'download'];

  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(private arquivosService: ArquivosService) {
  }

  ngAfterViewInit() {
    if(this.tipoPesquisa == TipoPesquisaEnum.TODOS_ITENS){
      this.paginator.page
      .pipe(
        tap(() => this.carregarTodosDocumentos())
      ).subscribe();
    }else if(this.tipoPesquisa == TipoPesquisaEnum.BOOLEANA){
      this.paginator.page
      .pipe(
        tap(() => this.pesquisarPorTermosBooleanos(this.termosPesquisaBooleana))
      ).subscribe();
    }
  }

  carregarTodosDocumentos() {
    this.isLoading = true;
    this.arquivosService.list(this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 5)
      .pipe(
        tap(page => this.page = page),
        tap(page => this.documentos = new MatTableDataSource(page.elementos)),
        finalize(() => this.isLoading = false)
      )
      .subscribe();
  }

  pesquisarPorTermosBooleanos(termos: TermoDTO[]): void {
    this.isLoading = true;
    this.arquivosService.booleanSearch(this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 5, termos)
      .pipe(
        tap(page => this.page = page),
        tap(page => this.documentos = new MatTableDataSource(page.elementos)),
        finalize(() => this.isLoading = false)
      )
      .subscribe();
  }

  ngOnInit(): void {
    if(this.tipoPesquisa == TipoPesquisaEnum.TODOS_ITENS){
      this.carregarTodosDocumentos();
    }else if(this.tipoPesquisa == TipoPesquisaEnum.BOOLEANA){
      this.pesquisarPorTermosBooleanos(this.termosPesquisaBooleana);
    }
  }

  onDownloadSingleArchive(id: number, nomeArquivo: string) {
    this.arquivosService.downloadSingleArchive(id)
    .subscribe((res: any) => {
      this.arquivosService.handleFile(res, nomeArquivo)
    });
  }

}
