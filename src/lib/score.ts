// ============================================
// Hotspot Score Calculation Algorithm
// ============================================

import { ComponentesScore, CategoriaScore, Ocorrencia, DeteccaoCamera, FaixaVolume, FAIXA_VOLUME_MULTIPLIER } from '@/types';

// Weight configuration for score components
export const SCORE_WEIGHTS = {
  recorrencia: 0.30,           // 30% - Number of open occurrences
  deteccoesCamera: 0.25,       // 25% - Camera detection confidence sum
  tempoDesdeUltimaLimpeza: 0.20, // 20% - Days since last cleaning
  volumeEstimado: 0.25,        // 25% - Estimated volume
};

// Score thresholds for categorization
export const SCORE_THRESHOLDS = {
  baixo: 25,
  medio: 50,
  alto: 75,
  critico: 100,
};

/**
 * Calculate recurrence score based on number of occurrences
 * Max contribution: 100 points (capped at 10 occurrences)
 */
export const calcularRecorrencia = (ocorrencias: Ocorrencia[]): number => {
  const abertas = ocorrencias.filter(o => o.status !== 'resolvido').length;
  return Math.min(abertas * 10, 100);
};

/**
 * Calculate camera detection score based on confidence sum
 * Max contribution: 100 points
 */
export const calcularDeteccoesCamera = (deteccoes: DeteccaoCamera[]): number => {
  if (deteccoes.length === 0) return 0;
  const somaConfianca = deteccoes.reduce((sum, d) => sum + d.confianca, 0);
  return Math.min(somaConfianca * 20, 100);
};

/**
 * Calculate time penalty since last cleaning
 * Max contribution: 100 points (capped at 30 days)
 */
export const calcularTempoDesdeUltimaLimpeza = (ultimaLimpeza?: Date): number => {
  if (!ultimaLimpeza) return 50; // Default penalty if never cleaned
  
  const agora = new Date();
  const diasDecorridos = Math.floor(
    (agora.getTime() - ultimaLimpeza.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return Math.min(diasDecorridos * 3.33, 100);
};

/**
 * Calculate volume bonus based on estimated volume
 * Max contribution: 100 points
 */
export const calcularVolumeEstimado = (ocorrencias: Ocorrencia[]): number => {
  if (ocorrencias.length === 0) return 0;
  
  const volumeTotal = ocorrencias.reduce((sum, o) => {
    return sum + FAIXA_VOLUME_MULTIPLIER[o.volumeFaixa];
  }, 0);
  
  return Math.min(volumeTotal * 10, 100);
};

/**
 * Calculate complete score components
 */
export const calcularComponentesScore = (
  ocorrencias: Ocorrencia[],
  deteccoes: DeteccaoCamera[],
  ultimaLimpeza?: Date
): ComponentesScore => {
  return {
    recorrencia: calcularRecorrencia(ocorrencias),
    deteccoesCamera: calcularDeteccoesCamera(deteccoes),
    tempoDesdeUltimaLimpeza: calcularTempoDesdeUltimaLimpeza(ultimaLimpeza),
    volumeEstimado: calcularVolumeEstimado(ocorrencias),
  };
};

/**
 * Calculate final weighted score (0-100)
 */
export const calcularScoreFinal = (componentes: ComponentesScore): number => {
  const score =
    componentes.recorrencia * SCORE_WEIGHTS.recorrencia +
    componentes.deteccoesCamera * SCORE_WEIGHTS.deteccoesCamera +
    componentes.tempoDesdeUltimaLimpeza * SCORE_WEIGHTS.tempoDesdeUltimaLimpeza +
    componentes.volumeEstimado * SCORE_WEIGHTS.volumeEstimado;
  
  return Math.round(Math.min(score, 100));
};

/**
 * Categorize score into levels
 */
export const categorizarScore = (score: number): CategoriaScore => {
  if (score < SCORE_THRESHOLDS.baixo) return 'baixo';
  if (score < SCORE_THRESHOLDS.medio) return 'medio';
  if (score < SCORE_THRESHOLDS.alto) return 'alto';
  return 'critico';
};

/**
 * Get category label in Portuguese
 */
export const getCategoriaLabel = (categoria: CategoriaScore): string => {
  const labels: Record<CategoriaScore, string> = {
    baixo: 'Baixo',
    medio: 'Médio',
    alto: 'Alto',
    critico: 'Crítico',
  };
  return labels[categoria];
};

/**
 * Get category color class
 */
export const getCategoriaColorClass = (categoria: CategoriaScore): string => {
  const classes: Record<CategoriaScore, string> = {
    baixo: 'score-low',
    medio: 'score-medium',
    alto: 'score-high',
    critico: 'score-critical',
  };
  return classes[categoria];
};

/**
 * Generate explanation text for score
 */
export const gerarExplicacaoScore = (componentes: ComponentesScore): string[] => {
  const explicacoes: string[] = [];
  
  if (componentes.recorrencia > 0) {
    explicacoes.push(
      `Recorrência: ${componentes.recorrencia.toFixed(0)} pts (${(SCORE_WEIGHTS.recorrencia * 100).toFixed(0)}% peso)`
    );
  }
  
  if (componentes.deteccoesCamera > 0) {
    explicacoes.push(
      `Detecções Câmera: ${componentes.deteccoesCamera.toFixed(0)} pts (${(SCORE_WEIGHTS.deteccoesCamera * 100).toFixed(0)}% peso)`
    );
  }
  
  explicacoes.push(
    `Tempo s/ Limpeza: ${componentes.tempoDesdeUltimaLimpeza.toFixed(0)} pts (${(SCORE_WEIGHTS.tempoDesdeUltimaLimpeza * 100).toFixed(0)}% peso)`
  );
  
  if (componentes.volumeEstimado > 0) {
    explicacoes.push(
      `Volume Estimado: ${componentes.volumeEstimado.toFixed(0)} pts (${(SCORE_WEIGHTS.volumeEstimado * 100).toFixed(0)}% peso)`
    );
  }
  
  return explicacoes;
};
