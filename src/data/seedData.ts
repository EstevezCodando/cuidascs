import { v4 as uuidv4 } from 'uuid';
import { Ocorrencia, DeteccaoCamera, Cooperativa, Camera, AlertaCooperativa, TipoResiduo, FaixaVolume, StatusOcorrencia } from '@/types';

// Centro: Ponto especificado pelo usuário
const BASE_LAT = -15.7967737;
const BASE_LNG = -47.8870557;

const TIPOS: TipoResiduo[] = ['organico', 'reciclavel_seco', 'entulho', 'volumoso', 'misto'];
const VOLUMES: FaixaVolume[] = ['pequeno', 'medio', 'grande'];
const STATUS: StatusOcorrencia[] = ['aberto', 'prioritario', 'em_atendimento'];

// IDs fixos para cooperativas
const CENTCOOP_ID = 'coop-centcoop-df';
const ACAPAS_ID = 'coop-acapas-df';

// Sem ocorrências iniciais - serão geradas pela simulação
export const generateSeedOcorrencias = (): Ocorrencia[] => {
  return [];
};

// Sem detecções iniciais - serão geradas pela simulação
export const generateSeedDeteccoes = (): DeteccaoCamera[] => {
  return [];
};

// Apenas uma câmera no ponto especificado
export const generateSeedCameras = (): Camera[] => {
  return [{
    id: 'CAM-SCS-001',
    nome: 'CAM-01 Principal',
    latitude: BASE_LAT,
    longitude: BASE_LNG,
    direcao: 0,
    anguloCampo: 90,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ativa: true,
  }];
};

export const seedCooperativas: Cooperativa[] = [
  { 
    id: CENTCOOP_ID, 
    nome: 'Central das Cooperativas de Materiais Recicláveis do DF (Centcoop)', 
    areasAtendidas: ['Plano Piloto', 'SCS', 'SBS', 'Asa Sul', 'Asa Norte', 'Lago Sul', 'Lago Norte'], 
    contato: '(61) 3345-1234',
    email: 'contato@centcoop.org.br',
    materiaisAceitos: ['reciclavel_seco', 'organico', 'volumoso'] 
  },
  { 
    id: ACAPAS_ID, 
    nome: 'Associação dos Catadores de Papéis da Asa Sul (ACAPAS)', 
    areasAtendidas: ['Asa Sul', 'SCS', 'Setor Comercial Sul', 'Setor Bancário Sul'], 
    contato: '(61) 3244-5678',
    email: 'acapas@gmail.com',
    materiaisAceitos: ['reciclavel_seco'] 
  },
];

export const generateSeedAlertas = (): AlertaCooperativa[] => {
  return [];
};

export const MAP_CENTER = { lat: BASE_LAT, lng: BASE_LNG };
