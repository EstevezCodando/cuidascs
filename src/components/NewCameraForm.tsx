import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface NewCameraFormProps {
  coordinates: { lat: number; lng: number } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewCameraForm: React.FC<NewCameraFormProps> = ({
  coordinates,
  onClose,
  onSuccess,
}) => {
  const { adicionarCamera } = useApp();
  const [nome, setNome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) return;

    const camera = adicionarCamera(coordinates.lat, coordinates.lng, nome);
    
    toast.success(`Câmera "${camera.nome}" adicionada!`, {
      description: 'A câmera começará a detectar resíduos no entorno.',
    });
    
    onSuccess();
  };

  if (!coordinates) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card rounded-xl shadow-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-cyan-500" />
            </div>
            <h2 className="text-lg font-semibold">Nova Câmera</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </span>
          </div>

          <div>
            <Label htmlFor="nome">Nome da Câmera</Label>
            <Input
              id="nome"
              placeholder="Ex: CAM-07 Entrada Sul"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="p-3 bg-cyan-500/10 rounded-lg text-sm">
            <p className="text-cyan-700 dark:text-cyan-300">
              📹 A câmera irá monitorar automaticamente o entorno e detectar 
              resíduos descartados irregularmente usando IA.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
              <Video className="w-4 h-4 mr-2" />
              Adicionar Câmera
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
