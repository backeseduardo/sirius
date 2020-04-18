export interface TransferenciaRequest {
  origem: string;
  destino: string;
  valor: number;
  compensaEm?: string;
}
