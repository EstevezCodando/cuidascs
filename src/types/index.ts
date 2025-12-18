// ============================================
// SCS Limpo & Circular - Type Definitions
// ============================================

// User Profiles
export type PerfilUsuario = 'cidadao' | 'operador' | 'cooperativa' | 'patrocinador';

export interface Usuario {
  id: string;
  nome: string;
  perfil: PerfilUsuario;
  avatarUrl?: string;
}

// Waste Types
export type TipoResiduo = 'organico' | 'reciclavel_seco' | 'entulho' | 'volumoso' | 'misto';

export const TIPO_RESIDUO_LABELS: Record<TipoResiduo, string> = {
  organico: 'Orgânico',
  reciclavel_seco: 'Reciclável Seco',
  entulho: 'Entulho',
  volumoso: 'Volumoso',
  misto: 'Misto',
};

export const TIPO_RESIDUO_COLORS: Record<TipoResiduo, string> = {
  organico: '#4ade80',
  reciclavel_seco: '#60a5fa',
  entulho: '#f59e0b',
  volumoso: '#a78bfa',
  misto: '#94a3b8',
};

export const TIPO_RESIDUO_ICONS: Record<TipoResiduo, string> = {
  organico: '🥬',
  reciclavel_seco: '♻️',
  entulho: '🧱',
  volumoso: '🛋️',
  misto: '📦',
};

// Volume Ranges
export type FaixaVolume = 'pequeno' | 'medio' | 'grande';

export const FAIXA_VOLUME_LABELS: Record<FaixaVolume, string> = {
  pequeno: 'Pequeno (1-3 sacos)',
  medio: 'Médio (4-10 sacos)',
  grande: 'Grande (10+ sacos)',
};

export const FAIXA_VOLUME_MULTIPLIER: Record<FaixaVolume, number> = {
  pequeno: 1,
  medio: 2.5,
  grande: 5,
};

// Occurrence Status
export type StatusOcorrencia = 'aberto' | 'prioritario' | 'em_atendimento' | 'resolvido';

export const STATUS_LABELS: Record<StatusOcorrencia, string> = {
  aberto: 'Aberto',
  prioritario: 'Prioritário',
  em_atendimento: 'Em Atendimento',
  resolvido: 'Resolvido',
};

// Main Entities
export interface Ocorrencia {
  id: string;
  criadoEm: Date;
  criadoPorPerfil: PerfilUsuario;
  latitude: number;
  longitude: number;
  tipoResiduo: TipoResiduo;
  volumeFaixa: FaixaVolume;
  descricao?: string;
  fotoUrl?: string;
  status: StatusOcorrencia;
  scoreAtual: number;
  ultimaAtualizacao: Date;
  resolvidoEm?: Date;
  estimativaPesoKgMin?: number;
  estimativaPesoKgMax?: number;
}

export interface DeteccaoCamera {
  id: string;
  criadoEm: Date;
  latitude: number;
  longitude: number;
  classeResiduo: TipoResiduo;
  confianca: number; // 0-1
  fonteCameraId: string;
}

// Camera entity
export interface Camera {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  direcao: number; // degrees 0-360
  anguloCampo: number; // field of view in degrees
  videoUrl: string;
  ativa: boolean;
}

export interface ComponentesScore {
  recorrencia: number;
  deteccoesCamera: number;
  tempoDesdeUltimaLimpeza: number;
  volumeEstimado: number;
}

export type CategoriaScore = 'baixo' | 'medio' | 'alto' | 'critico';

export interface Hotspot {
  id: string;
  geohash: string;
  latitudeCentro: number;
  longitudeCentro: number;
  score: number;
  categoria: CategoriaScore;
  componentesScore: ComponentesScore;
  statusOperacional: 'ativo' | 'em_atendimento' | 'limpo';
  ocorrenciasIds: string[];
  deteccoesIds: string[];
  ultimaLimpeza?: Date;
}

export type StatusRoteiro = 'planejado' | 'em_execucao' | 'concluido' | 'cancelado';

export interface Roteiro {
  id: string;
  criadoEm: Date;
  criadoPor: string;
  listaHotspots: {
    hotspotId: string;
    ordem: number;
    etaMinutos: number;
  }[];
  status: StatusRoteiro;
  iniciadoEm?: Date;
  concluidoEm?: Date;
}

export type StatusAlerta = 'novo' | 'aceito' | 'recusado' | 'concluido';

export interface AlertaCooperativa {
  id: string;
  criadoEm: Date;
  hotspotId: string;
  materialSugerido: TipoResiduo[];
  janelaColetaInicio: Date;
  janelaColetaFim: Date;
  status: StatusAlerta;
  cooperativaId?: string;
  pesoEstimadoKg?: number;
}

export interface Cooperativa {
  id: string;
  nome: string;
  areasAtendidas: string[];
  contato: string;
  email?: string;
  materiaisAceitos: TipoResiduo[];
}

// Dashboard Metrics
export interface MetricasDashboard {
  totalOcorrencias: number;
  ocorrenciasAbertas: number;
  ocorrenciasResolvidas: number;
  hotspotsAtivos: number;
  roteirosHoje: number;
  pesoColetadoKg: number;
  materiaisRecuperados: number;
  alertasCooperativas: number;
  tempoMedioResolucaoHoras: number;
}

// Map Types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapClickEvent {
  latitude: number;
  longitude: number;
}
