// ============================================
// Application State Context
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Ocorrencia,
  DeteccaoCamera,
  Hotspot,
  Roteiro,
  AlertaCooperativa,
  Cooperativa,
  Camera,
  PerfilUsuario,
  Usuario,
  TipoResiduo,
  FaixaVolume,
  StatusOcorrencia,
  StatusAlerta,
  StatusRoteiro,
  MetricasDashboard,
} from '@/types';
import {
  generateSeedOcorrencias,
  generateSeedDeteccoes,
  generateSeedCameras,
  generateSeedAlertas,
  seedCooperativas,
} from '@/data/seedData';
import {
  calcularComponentesScore,
  calcularScoreFinal,
  categorizarScore,
} from '@/lib/score';
import { coordsToGridKey, gridKeyToCoords, calcularDistanciaKm, estimarETAMinutos, MAP_DEFAULT_CENTER } from '@/lib/mapbox';

interface AppState {
  // User
  usuario: Usuario;
  setPerfilAtivo: (perfil: PerfilUsuario) => void;
  
  // Data
  ocorrencias: Ocorrencia[];
  deteccoes: DeteccaoCamera[];
  hotspots: Hotspot[];
  roteiros: Roteiro[];
  alertas: AlertaCooperativa[];
  cooperativas: Cooperativa[];
  cameras: Camera[];
  
  // Actions
  registrarOcorrencia: (data: Omit<Ocorrencia, 'id' | 'criadoEm' | 'scoreAtual' | 'ultimaAtualizacao' | 'status'>) => void;
  editarOcorrencia: (id: string, data: Partial<Ocorrencia>) => void;
  deletarOcorrencia: (id: string) => void;
  atualizarStatusOcorrencia: (id: string, status: StatusOcorrencia) => void;
  finalizarOcorrencia: (id: string, pesoMin: number, pesoMax: number) => void;
  
  simularDeteccao: (data: Omit<DeteccaoCamera, 'id' | 'criadoEm'>) => void;
  simularDeteccoesEmMassa: (count: number) => void;
  
  adicionarCamera: (lat: number, lng: number, nome: string) => Camera;
  removerCamera: (id: string) => void;
  
  recalcularHotspots: () => void;
  
  gerarRoteiro: (hotspotIds: string[]) => Roteiro;
  atualizarStatusRoteiro: (id: string, status: StatusRoteiro) => void;
  
  atualizarStatusAlerta: (id: string, status: StatusAlerta, cooperativaId?: string) => void;
  
  // Demo Mode
  executarModoDemo: () => void;
  
  // Metrics
  calcularMetricas: () => MetricasDashboard;
  
  // Selection state
  selectedOcorrencia: Ocorrencia | null;
  setSelectedOcorrencia: (o: Ocorrencia | null) => void;
  selectedHotspot: Hotspot | null;
  setSelectedHotspot: (h: Hotspot | null) => void;
  selectedCamera: Camera | null;
  setSelectedCamera: (c: Camera | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const PERFIL_LABELS: Record<PerfilUsuario, string> = {
  cidadao: 'Cidadão',
  operador: 'Operador',
  cooperativa: 'Cooperativa',
  patrocinador: 'Patrocinador',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with seed data
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(() => generateSeedOcorrencias());
  const [deteccoes, setDeteccoes] = useState<DeteccaoCamera[]>(() => generateSeedDeteccoes());
  const [cameras, setCameras] = useState<Camera[]>(() => generateSeedCameras());
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [alertas, setAlertas] = useState<AlertaCooperativa[]>(() => generateSeedAlertas());
  const [cooperativas] = useState<Cooperativa[]>(seedCooperativas);
  
  const [usuario, setUsuario] = useState<Usuario>({
    id: 'demo-user',
    nome: 'Usuário Demo',
    perfil: 'operador',
  });
  
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<Ocorrencia | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const setPerfilAtivo = useCallback((perfil: PerfilUsuario) => {
    setUsuario(prev => ({
      ...prev,
      perfil,
      nome: `${PERFIL_LABELS[perfil]} Demo`,
    }));
    setSelectedOcorrencia(null);
    setSelectedHotspot(null);
    setSelectedCamera(null);
  }, []);

  // Recalculate hotspots
  const recalcularHotspots = useCallback(() => {
    const gridMap = new Map<string, { ocorrencias: Ocorrencia[]; deteccoes: DeteccaoCamera[] }>();
    
    // Group occurrences by grid
    ocorrencias.forEach(o => {
      const key = coordsToGridKey(o.latitude, o.longitude);
      if (!gridMap.has(key)) {
        gridMap.set(key, { ocorrencias: [], deteccoes: [] });
      }
      gridMap.get(key)!.ocorrencias.push(o);
    });
    
    // Group detections by grid
    deteccoes.forEach(d => {
      const key = coordsToGridKey(d.latitude, d.longitude);
      if (!gridMap.has(key)) {
        gridMap.set(key, { ocorrencias: [], deteccoes: [] });
      }
      gridMap.get(key)!.deteccoes.push(d);
    });
    
    // Calculate hotspots
    const newHotspots: Hotspot[] = [];
    
    gridMap.forEach((data, key) => {
      const coords = gridKeyToCoords(key);
      const openOcorrencias = data.ocorrencias.filter(o => o.status !== 'resolvido');
      
      if (openOcorrencias.length === 0 && data.deteccoes.length === 0) return;
      
      const ultimaLimpeza = data.ocorrencias
        .filter(o => o.resolvidoEm)
        .map(o => o.resolvidoEm!)
        .sort((a, b) => b.getTime() - a.getTime())[0];
      
      const componentes = calcularComponentesScore(openOcorrencias, data.deteccoes, ultimaLimpeza);
      const score = calcularScoreFinal(componentes);
      
      if (score > 5) { // Min threshold
        newHotspots.push({
          id: uuidv4(),
          geohash: key,
          latitudeCentro: coords.lat,
          longitudeCentro: coords.lng,
          score,
          categoria: categorizarScore(score),
          componentesScore: componentes,
          statusOperacional: 'ativo',
          ocorrenciasIds: data.ocorrencias.map(o => o.id),
          deteccoesIds: data.deteccoes.map(d => d.id),
          ultimaLimpeza,
        });
      }
    });
    
    // Sort by score descending
    newHotspots.sort((a, b) => b.score - a.score);
    setHotspots(newHotspots);
  }, [ocorrencias, deteccoes]);

  // Initial hotspot calculation
  useEffect(() => {
    recalcularHotspots();
  }, []);

  const registrarOcorrencia = useCallback((data: Omit<Ocorrencia, 'id' | 'criadoEm' | 'scoreAtual' | 'ultimaAtualizacao' | 'status'>) => {
    const novaOcorrencia: Ocorrencia = {
      ...data,
      id: uuidv4(),
      criadoEm: new Date(),
      status: 'aberto',
      scoreAtual: 0,
      ultimaAtualizacao: new Date(),
    };
    
    setOcorrencias(prev => [...prev, novaOcorrencia]);
    setTimeout(recalcularHotspots, 100);
  }, [recalcularHotspots]);

  const editarOcorrencia = useCallback((id: string, data: Partial<Ocorrencia>) => {
    setOcorrencias(prev => prev.map(o =>
      o.id === id
        ? { ...o, ...data, ultimaAtualizacao: new Date() }
        : o
    ));
    setSelectedOcorrencia(prev => 
      prev?.id === id ? { ...prev, ...data, ultimaAtualizacao: new Date() } : prev
    );
    setTimeout(recalcularHotspots, 100);
  }, [recalcularHotspots]);

  const deletarOcorrencia = useCallback((id: string) => {
    setOcorrencias(prev => prev.filter(o => o.id !== id));
    setSelectedOcorrencia(prev => prev?.id === id ? null : prev);
    setTimeout(recalcularHotspots, 100);
  }, [recalcularHotspots]);

  const atualizarStatusOcorrencia = useCallback((id: string, status: StatusOcorrencia) => {
    setOcorrencias(prev => prev.map(o => 
      o.id === id 
        ? { ...o, status, ultimaAtualizacao: new Date() }
        : o
    ));
    setTimeout(recalcularHotspots, 100);
  }, [recalcularHotspots]);

  const finalizarOcorrencia = useCallback((id: string, pesoMin: number, pesoMax: number) => {
    setOcorrencias(prev => prev.map(o => {
      if (o.id !== id) return o;
      
      const updated: Ocorrencia = {
        ...o,
        status: 'resolvido',
        resolvidoEm: new Date(),
        estimativaPesoKgMin: pesoMin,
        estimativaPesoKgMax: pesoMax,
        ultimaAtualizacao: new Date(),
      };
      
      // Check if recyclable and create cooperative alert
      if (['reciclavel_seco', 'organico'].includes(o.tipoResiduo)) {
        const hotspot = hotspots.find(h => h.ocorrenciasIds.includes(id));
        if (hotspot) {
          const novoAlerta: AlertaCooperativa = {
            id: uuidv4(),
            criadoEm: new Date(),
            hotspotId: hotspot.id,
            materialSugerido: [o.tipoResiduo],
            janelaColetaInicio: new Date(),
            janelaColetaFim: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours window
            status: 'novo',
            pesoEstimadoKg: (pesoMin + pesoMax) / 2,
          };
          setAlertas(prev => [...prev, novoAlerta]);
        }
      }
      
      return updated;
    }));
    setTimeout(recalcularHotspots, 100);
  }, [hotspots, recalcularHotspots]);

  const simularDeteccao = useCallback((data: Omit<DeteccaoCamera, 'id' | 'criadoEm'>) => {
    const novaDeteccao: DeteccaoCamera = {
      ...data,
      id: uuidv4(),
      criadoEm: new Date(),
    };
    setDeteccoes(prev => [...prev, novaDeteccao]);
    setTimeout(recalcularHotspots, 100);
  }, [recalcularHotspots]);

  const simularDeteccoesEmMassa = useCallback((count: number) => {
    const tipos: TipoResiduo[] = ['organico', 'reciclavel_seco', 'entulho', 'volumoso', 'misto'];
    const cameraIds = cameras.map(c => c.id);
    
    const novasDeteccoes: DeteccaoCamera[] = Array.from({ length: count }, () => {
      const camera = cameras[Math.floor(Math.random() * cameras.length)];
      return {
        id: uuidv4(),
        criadoEm: new Date(),
        latitude: camera.latitude + (Math.random() - 0.5) * 0.001,
        longitude: camera.longitude + (Math.random() - 0.5) * 0.001,
        classeResiduo: tipos[Math.floor(Math.random() * tipos.length)],
        confianca: 0.7 + Math.random() * 0.25,
        fonteCameraId: camera.id,
      };
    });
    
    setDeteccoes(prev => [...prev, ...novasDeteccoes]);
    setTimeout(recalcularHotspots, 100);
  }, [cameras, recalcularHotspots]);

  const adicionarCamera = useCallback((lat: number, lng: number, nome: string): Camera => {
    const novaCamera: Camera = {
      id: `CAM-SCS-${String(cameras.length + 1).padStart(3, '0')}`,
      nome: nome || `CAM-${cameras.length + 1} Nova`,
      latitude: lat,
      longitude: lng,
      direcao: Math.floor(Math.random() * 360),
      anguloCampo: 90,
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      ativa: true,
    };
    setCameras(prev => [...prev, novaCamera]);
    return novaCamera;
  }, [cameras]);

  const removerCamera = useCallback((id: string) => {
    setCameras(prev => prev.filter(c => c.id !== id));
    setSelectedCamera(prev => prev?.id === id ? null : prev);
  }, []);

  const gerarRoteiro = useCallback((hotspotIds: string[]): Roteiro => {
    const hotspotsOrdenados = hotspotIds
      .map(id => hotspots.find(h => h.id === id))
      .filter((h): h is Hotspot => h !== undefined);
    
    // Calculate ETAs (simple sequential distance)
    let acumuladoKm = 0;
    const listaHotspots = hotspotsOrdenados.map((h, i) => {
      if (i > 0) {
        const anterior = hotspotsOrdenados[i - 1];
        acumuladoKm += calcularDistanciaKm(
          anterior.latitudeCentro,
          anterior.longitudeCentro,
          h.latitudeCentro,
          h.longitudeCentro
        );
      }
      return {
        hotspotId: h.id,
        ordem: i + 1,
        etaMinutos: estimarETAMinutos(acumuladoKm),
      };
    });
    
    const novoRoteiro: Roteiro = {
      id: uuidv4(),
      criadoEm: new Date(),
      criadoPor: usuario.id,
      listaHotspots,
      status: 'planejado',
    };
    
    setRoteiros(prev => [...prev, novoRoteiro]);
    
    // Update hotspots status
    setHotspots(prev => prev.map(h =>
      hotspotIds.includes(h.id)
        ? { ...h, statusOperacional: 'em_atendimento' as const }
        : h
    ));
    
    return novoRoteiro;
  }, [hotspots, usuario.id]);

  const atualizarStatusRoteiro = useCallback((id: string, status: StatusRoteiro) => {
    setRoteiros(prev => prev.map(r => {
      if (r.id !== id) return r;
      
      const updated: Roteiro = { ...r, status };
      if (status === 'em_execucao') updated.iniciadoEm = new Date();
      if (status === 'concluido') updated.concluidoEm = new Date();
      
      return updated;
    }));
  }, []);

  const atualizarStatusAlerta = useCallback((id: string, status: StatusAlerta, cooperativaId?: string) => {
    setAlertas(prev => prev.map(a =>
      a.id === id
        ? { ...a, status, cooperativaId }
        : a
    ));
  }, []);

  const executarModoDemo = useCallback(() => {
    // Gerar lixo no entorno de cada câmera existente
    if (cameras.length === 0) {
      return;
    }

    const tipos: TipoResiduo[] = ['reciclavel_seco', 'organico', 'entulho', 'volumoso', 'misto'];
    const volumes: FaixaVolume[] = ['pequeno', 'medio', 'grande'];
    
    // Para cada câmera, gerar detecções e ocorrências no seu entorno
    cameras.forEach((camera, camIdx) => {
      // Gerar 3-5 detecções por câmera
      const numDeteccoes = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numDeteccoes; i++) {
        const novaDeteccao: DeteccaoCamera = {
          id: uuidv4(),
          criadoEm: new Date(),
          latitude: camera.latitude + (Math.random() - 0.5) * 0.0008,
          longitude: camera.longitude + (Math.random() - 0.5) * 0.0008,
          classeResiduo: tipos[Math.floor(Math.random() * tipos.length)],
          confianca: 0.75 + Math.random() * 0.23,
          fonteCameraId: camera.id,
        };
        setDeteccoes(prev => [...prev, novaDeteccao]);
      }

      // Gerar 2-3 ocorrências por câmera com delay para animação
      const numOcorrencias = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numOcorrencias; i++) {
        setTimeout(() => {
          registrarOcorrencia({
            criadoPorPerfil: 'cidadao',
            latitude: camera.latitude + (Math.random() - 0.5) * 0.0006,
            longitude: camera.longitude + (Math.random() - 0.5) * 0.0006,
            tipoResiduo: tipos[Math.floor(Math.random() * tipos.length)],
            volumeFaixa: volumes[Math.floor(Math.random() * volumes.length)],
            descricao: `Lixo detectado por ${camera.nome}`,
          });
        }, (camIdx * numOcorrencias + i) * 300);
      }
    });

    // Recalcular hotspots após todas as inserções
    setTimeout(recalcularHotspots, cameras.length * 1000);
  }, [cameras, registrarOcorrencia, recalcularHotspots]);

  const calcularMetricas = useCallback((): MetricasDashboard => {
    const abertas = ocorrencias.filter(o => o.status !== 'resolvido');
    const resolvidas = ocorrencias.filter(o => o.status === 'resolvido');
    
    const pesoTotal = resolvidas.reduce((sum, o) => {
      const media = ((o.estimativaPesoKgMin || 0) + (o.estimativaPesoKgMax || 0)) / 2;
      return sum + media;
    }, 0);
    
    const materiaisRecuperados = resolvidas.filter(o => 
      ['reciclavel_seco', 'organico'].includes(o.tipoResiduo)
    ).length;
    
    // Calculate average resolution time
    const tempos = resolvidas
      .filter(o => o.resolvidoEm && o.criadoEm)
      .map(o => (o.resolvidoEm!.getTime() - o.criadoEm.getTime()) / (1000 * 60 * 60));
    const tempoMedio = tempos.length > 0 
      ? tempos.reduce((a, b) => a + b, 0) / tempos.length 
      : 0;
    
    return {
      totalOcorrencias: ocorrencias.length,
      ocorrenciasAbertas: abertas.length,
      ocorrenciasResolvidas: resolvidas.length,
      hotspotsAtivos: hotspots.filter(h => h.statusOperacional === 'ativo').length,
      roteirosHoje: roteiros.filter(r => {
        const hoje = new Date();
        return r.criadoEm.toDateString() === hoje.toDateString();
      }).length,
      pesoColetadoKg: Math.round(pesoTotal),
      materiaisRecuperados,
      alertasCooperativas: alertas.filter(a => a.status === 'novo').length,
      tempoMedioResolucaoHoras: Math.round(tempoMedio * 10) / 10,
    };
  }, [ocorrencias, hotspots, roteiros, alertas]);

  const value: AppState = {
    usuario,
    setPerfilAtivo,
    ocorrencias,
    deteccoes,
    hotspots,
    roteiros,
    alertas,
    cooperativas,
    cameras,
    registrarOcorrencia,
    editarOcorrencia,
    deletarOcorrencia,
    atualizarStatusOcorrencia,
    finalizarOcorrencia,
    simularDeteccao,
    simularDeteccoesEmMassa,
    adicionarCamera,
    removerCamera,
    recalcularHotspots,
    gerarRoteiro,
    atualizarStatusRoteiro,
    atualizarStatusAlerta,
    executarModoDemo,
    calcularMetricas,
    selectedOcorrencia,
    setSelectedOcorrencia,
    selectedHotspot,
    setSelectedHotspot,
    selectedCamera,
    setSelectedCamera,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
