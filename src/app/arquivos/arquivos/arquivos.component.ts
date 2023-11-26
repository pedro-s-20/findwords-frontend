import { DocumentacaoDTO, PageDTO } from './../models/documentacao-dto';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { finalize, tap } from 'rxjs';

import { ArquivosService } from '../services/arquivos.service';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  displayedColumns = ['id', 'nome', 'download'];

  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(private arquivosService: ArquivosService) {
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.carregarTodosDocumentos())
      ).subscribe();
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

  ngOnInit(): void {
    this.carregarTodosDocumentos();
  }

  onDownloadSingleArchive(id: number, nomeArquivo: string) {
    this.arquivosService.downloadSingleArchive(id)
    .subscribe((res: any) => {
      this.arquivosService.handleFile(res, nomeArquivo)
    });
  }

}
