import { Injectable } from '@angular/core';
import { DocumentacaoDTO } from '../models/documentacao-dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArquivosService {

  constructor(private httpClient: HttpClient) { }

  list(): DocumentacaoDTO[] {
    return [
      {
        id: 452,
        nomeArquivo: 'Item01.html'
      }
    ];
  }
}
