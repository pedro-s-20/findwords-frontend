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

  downloadSingleArchive(id: number) {
    return this.httpClient.get(this.API + '/download-archive/' + id, {
      responseType: 'blob' as 'json'
    });
  }

  handleFile(res : any, nomeArquivo: string){
    const file = new Blob([res], {
      type: res.type
    });
    const blob = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = blob;
    link.download = nomeArquivo;
    link.click();
    window.URL.revokeObjectURL(blob);
    link.remove();
  }
}
