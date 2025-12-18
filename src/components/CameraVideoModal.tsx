import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, MapPin, Compass, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Camera } from '@/types';
import { useApp } from '@/contexts/AppContext';
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

interface CameraVideoModalProps {
  camera: Camera | null;
  onClose: () => void;
}

export const CameraVideoModal: React.FC<CameraVideoModalProps> = ({ camera, onClose }) => {
  const { removerCamera } = useApp();

  if (!camera) return null;

  const handleDelete = () => {
    removerCamera(camera.id);
    toast.success(`Câmera "${camera.nome}" removida!`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-card rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{camera.nome}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {camera.latitude.toFixed(6)}, {camera.longitude.toFixed(6)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    {camera.direcao}°
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover câmera?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá remover a câmera "{camera.nome}" permanentemente. 
                      As detecções associadas não serão afetadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            <video
              src="/videos/LixoLocalErrado.mp4"
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              muted
            >
              Seu navegador não suporta a reprodução de vídeo.
            </video>
            
            {/* Overlay info */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded animate-pulse">
                ● AO VIVO
              </span>
              <span className="px-2 py-1 bg-black/60 text-white text-xs rounded">
                {camera.id}
              </span>
            </div>
            
            {/* Detection zone overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="px-2 py-1 bg-black/60 text-white text-xs rounded">
                Zona de Detecção: Ativa
              </span>
              <span className="px-2 py-1 bg-success/80 text-white text-xs rounded">
                IA: Monitorando Resíduos
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Esta câmera detecta automaticamente resíduos descartados irregularmente usando 
              visão computacional. Clique em "Modo Demo" para simular detecções no entorno.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
