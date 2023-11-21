import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, first } from 'rxjs';

import { PageDTO } from '../models/documentacao-dto';

@Injectable({
  providedIn: 'root'
})
export class ArquivosService {

  private readonly API = 'http://localhost:8080/arquivos'

  constructor(private httpClient: HttpClient) { }

  list(pagina: number, tamanho: number): Observable<PageDTO> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());

    return this.httpClient.get<PageDTO>(this.API, {params})
      .pipe(first(), delay(1000));
  }
}
