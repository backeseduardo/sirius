export interface TransferenciaResponse {
  origem: string;
  destino: string;
  valor: number;
  compensaEm?: string;
  createdAt: string;
}
