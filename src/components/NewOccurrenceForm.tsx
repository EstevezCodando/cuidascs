import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Camera, Package, FileText, Send, Loader2, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TipoResiduo, 
  FaixaVolume, 
  TIPO_RESIDUO_LABELS, 
  TIPO_RESIDUO_ICONS,
  FAIXA_VOLUME_LABELS 
} from '@/types';
import { useToast } from '@/hooks/use-toast';

interface NewOccurrenceFormProps {
  coordinates: { lat: number; lng: number } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewOccurrenceForm: React.FC<NewOccurrenceFormProps> = ({
  coordinates,
  onClose,
  onSuccess,
}) => {
  const { registrarOcorrencia, usuario } = useApp();
  const { toast } = useToast();
  
  const [tipoResiduo, setTipoResiduo] = useState<TipoResiduo>('misto');
  const [volumeFaixa, setVolumeFaixa] = useState<FaixaVolume>('medio');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmaVeracidade, setConfirmaVeracidade] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    
    registrarOcorrencia({
      criadoPorPerfil: usuario.perfil,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      tipoResiduo,
      volumeFaixa,
      descricao: descricao || undefined,
    });
    
    toast({
      title: "Ocorrência Registrada!",
      description: "Sua denúncia foi enviada e será analisada pela equipe.",
    });
    
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Nova Ocorrência</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Location */}
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {coordinates 
                ? `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`
                : 'Selecione no mapa'
              }
            </span>
          </div>

          {/* Waste Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Tipo de Resíduo
            </Label>
            <RadioGroup
              value={tipoResiduo}
              onValueChange={(v) => setTipoResiduo(v as TipoResiduo)}
              className="grid grid-cols-2 gap-2"
            >
              {(Object.keys(TIPO_RESIDUO_LABELS) as TipoResiduo[]).map((tipo) => (
                <Label
                  key={tipo}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    tipoResiduo === tipo 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={tipo} className="sr-only" />
                  <span className="text-lg">{TIPO_RESIDUO_ICONS[tipo]}</span>
                  <span className="text-sm">{TIPO_RESIDUO_LABELS[tipo]}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label>Volume Estimado</Label>
            <RadioGroup
              value={volumeFaixa}
              onValueChange={(v) => setVolumeFaixa(v as FaixaVolume)}
              className="flex gap-2"
            >
              {(Object.keys(FAIXA_VOLUME_LABELS) as FaixaVolume[]).map((vol) => (
                <Label
                  key={vol}
                  className={`flex-1 text-center p-2 rounded-lg border cursor-pointer transition-colors text-xs ${
                    volumeFaixa === vol 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={vol} className="sr-only" />
                  {FAIXA_VOLUME_LABELS[vol]}
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Descrição (opcional)
            </Label>
            <Textarea
              placeholder="Descreva a situação..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
          </div>

          {/* Photo placeholder */}
          <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg text-sm text-muted-foreground">
            <Camera className="w-4 h-4" />
            <span>Anexar foto (em breve)</span>
          </div>

          {/* Veracity confirmation */}
          <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Checkbox 
              id="veracidade"
              checked={confirmaVeracidade}
              onCheckedChange={(checked) => setConfirmaVeracidade(checked === true)}
              className="mt-0.5"
            />
            <Label 
              htmlFor="veracidade" 
              className="text-sm cursor-pointer leading-relaxed"
            >
              <span className="flex items-center gap-1 font-medium text-amber-600 mb-1">
                <AlertTriangle className="w-3 h-3" />
                Declaração de Veracidade
              </span>
              Declaro que as informações fornecidas são verdadeiras e que o resíduo realmente existe no local indicado.
            </Label>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!coordinates || isSubmitting || !confirmaVeracidade}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Registrar Ocorrência
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};
