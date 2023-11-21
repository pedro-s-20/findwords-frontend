export interface DocumentacaoDTO {
  id: number;
  nomeArquivo: string;
}

export interface PageDTO {
  totalElementos: number;
  quantidadePaginas: number;
  pagina: number;
  tamanho: number;
  elementos: DocumentacaoDTO[];
}
