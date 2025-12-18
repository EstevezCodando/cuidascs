import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock, Scale, AlertTriangle, CheckCircle, Loader2, Pencil, Trash2, Save } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { WasteTypeBadge } from './WasteTypeBadge';
import { ScoreBadge } from './ScoreBadge';
import { FAIXA_VOLUME_LABELS, TipoResiduo, FaixaVolume, TIPO_RESIDUO_LABELS } from '@/types';
import { gerarExplicacaoScore } from '@/lib/score';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export const MapSidePanel: React.FC = () => {
  const {
    selectedOcorrencia,
    setSelectedOcorrencia,
    selectedHotspot,
    setSelectedHotspot,
    atualizarStatusOcorrencia,
    finalizarOcorrencia,
    editarOcorrencia,
    deletarOcorrencia,
    usuario,
    hotspots,
    gerarRoteiro,
  } = useApp();

  const [pesoMin, setPesoMin] = useState('');
  const [pesoMax, setPesoMax] = useState('');
  const [isFinalizando, setIsFinalizando] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editTipoResiduo, setEditTipoResiduo] = useState<TipoResiduo>('misto');
  const [editVolumeFaixa, setEditVolumeFaixa] = useState<FaixaVolume>('medio');
  const [editDescricao, setEditDescricao] = useState('');

  const handleClose = () => {
    setSelectedOcorrencia(null);
    setSelectedHotspot(null);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedOcorrencia) {
      setEditTipoResiduo(selectedOcorrencia.tipoResiduo);
      setEditVolumeFaixa(selectedOcorrencia.volumeFaixa);
      setEditDescricao(selectedOcorrencia.descricao || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedOcorrencia) {
      editarOcorrencia(selectedOcorrencia.id, {
        tipoResiduo: editTipoResiduo,
        volumeFaixa: editVolumeFaixa,
        descricao: editDescricao,
      });
      setIsEditing(false);
      toast.success('Ocorrência atualizada com sucesso!');
    }
  };

  const handleDelete = () => {
    if (selectedOcorrencia) {
      deletarOcorrencia(selectedOcorrencia.id);
      toast.success('Ocorrência excluída com sucesso!');
    }
  };

  const handleFinalizar = async () => {
    if (!selectedOcorrencia || !pesoMin || !pesoMax) return;
    setIsFinalizando(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 500));
    
    finalizarOcorrencia(
      selectedOcorrencia.id,
      parseFloat(pesoMin),
      parseFloat(pesoMax)
    );
    
    setIsFinalizando(false);
    setPesoMin('');
    setPesoMax('');
    handleClose();
  };

  const handleGerarRoteiro = () => {
    if (!selectedHotspot) return;
    const topHotspots = hotspots
      .filter(h => h.statusOperacional === 'ativo')
      .slice(0, 5)
      .map(h => h.id);
    
    if (topHotspots.length > 0) {
      gerarRoteiro(topHotspots);
    }
  };

  if (!selectedOcorrencia && !selectedHotspot) return null;

  const canEdit = usuario.perfil === 'cidadao' || usuario.perfil === 'operador';

  return (
    <motion.div
      className="map-panel z-30"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {selectedOcorrencia ? 'Ocorrência' : 'Hotspot'}
        </h3>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {selectedOcorrencia && (
        <div className="space-y-4">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedOcorrencia.status} />
                <WasteTypeBadge tipo={selectedOcorrencia.tipoResiduo} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedOcorrencia.latitude.toFixed(6)}, {selectedOcorrencia.longitude.toFixed(6)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(selectedOcorrencia.criadoEm).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Scale className="w-4 h-4" />
                  <span>{FAIXA_VOLUME_LABELS[selectedOcorrencia.volumeFaixa]}</span>
                </div>
              </div>

              {selectedOcorrencia.descricao && (
                <p className="text-sm bg-muted/50 p-3 rounded-lg">
                  {selectedOcorrencia.descricao}
                </p>
              )}

              {/* Edit/Delete buttons */}
              {canEdit && selectedOcorrencia.status !== 'resolvido' && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleStartEdit}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex-1">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir ocorrência?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. A ocorrência será permanentemente removida do sistema.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {usuario.perfil === 'operador' && selectedOcorrencia.status !== 'resolvido' && (
                <div className="space-y-3 pt-3 border-t">
                  <Label className="text-xs text-muted-foreground">Atualizar Status</Label>
                  <Select
                    value={selectedOcorrencia.status}
                    onValueChange={(v) => atualizarStatusOcorrencia(selectedOcorrencia.id, v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="prioritario">Prioritário</SelectItem>
                      <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedOcorrencia.status === 'em_atendimento' && (
                    <div className="space-y-3 p-3 bg-success/10 rounded-lg">
                      <Label className="text-xs font-medium text-success">
                        Finalizar Limpeza
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Peso Mín (kg)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={pesoMin}
                            onChange={(e) => setPesoMin(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Peso Máx (kg)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={pesoMax}
                            onChange={(e) => setPesoMax(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleFinalizar}
                        disabled={!pesoMin || !pesoMax || isFinalizando}
                      >
                        {isFinalizando ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Marcar como Resolvido
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Edit Mode */
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Tipo de Resíduo</Label>
                <Select value={editTipoResiduo} onValueChange={(v) => setEditTipoResiduo(v as TipoResiduo)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TIPO_RESIDUO_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Volume Estimado</Label>
                <Select value={editVolumeFaixa} onValueChange={(v) => setEditVolumeFaixa(v as FaixaVolume)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FAIXA_VOLUME_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Descrição</Label>
                <Textarea
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  placeholder="Descreva o local ou adicione informações"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSaveEdit}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedHotspot && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ScoreBadge
              score={selectedHotspot.score}
              categoria={selectedHotspot.categoria}
              size="lg"
              showLabel
            />
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedHotspot.ocorrenciasIds.length} ocorrências
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedHotspot.deteccoesIds.length} detecções
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {selectedHotspot.latitudeCentro.toFixed(6)}, {selectedHotspot.longitudeCentro.toFixed(6)}
              </span>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Como calculamos o score
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {gerarExplicacaoScore(selectedHotspot.componentesScore).map((exp, i) => (
                <li key={i}>• {exp}</li>
              ))}
            </ul>
          </div>

          {usuario.perfil === 'operador' && selectedHotspot.statusOperacional === 'ativo' && (
            <Button className="w-full" onClick={handleGerarRoteiro}>
              Gerar Roteiro (Top 5)
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};
