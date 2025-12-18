import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Trash2 } from 'lucide-react';
import { MapView } from '@/components/MapView';
import { MapSidePanel } from '@/components/MapSidePanel';
import { NewOccurrenceForm } from '@/components/NewOccurrenceForm';
import { CameraVideoModal } from '@/components/CameraVideoModal';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

const MapPage: React.FC = () => {
  const { usuario, selectedCamera, setSelectedCamera, adicionarCamera } = useApp();
  const [newCoordinates, setNewCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [showOccurrenceForm, setShowOccurrenceForm] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    if (usuario.perfil === 'cidadao') {
      // Cidadão clica no mapa para reportar resíduo
      setNewCoordinates({ lat, lng });
      setShowOccurrenceForm(true);
    } else if (usuario.perfil === 'operador') {
      // Operador clica no mapa para adicionar câmera
      const camera = adicionarCamera(lat, lng, `CAM-${Date.now().toString().slice(-4)}`);
      toast.success(`Câmera adicionada!`, {
        description: `${camera.nome} em ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    }
  };

  const handleOccurrenceFormClose = () => {
    setShowOccurrenceForm(false);
    setNewCoordinates(null);
  };

  const handleOccurrenceFormSuccess = () => {
    setShowOccurrenceForm(false);
    setNewCoordinates(null);
    toast.success('Ocorrência registrada!', {
      description: 'O local foi adicionado aos hotspots para priorização.',
    });
  };

  const isOperator = usuario.perfil === 'operador';
  const isCidadao = usuario.perfil === 'cidadao';

  return (
    <div className="flex-1 flex relative">
      <MapView
        onMapClick={handleMapClick}
        isAddingOccurrence={isCidadao}
      />
      
      <AnimatePresence>
        <MapSidePanel />
      </AnimatePresence>

      {/* Instruction banner */}
      {isOperator && (
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-cyan-600/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Video className="w-4 h-4" />
          Clique no mapa para adicionar câmera
        </motion.div>
      )}

      {isCidadao && (
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-primary/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Trash2 className="w-4 h-4" />
          Clique no mapa para reportar resíduo
        </motion.div>
      )}

      {/* New Occurrence Form */}
      <AnimatePresence>
        {showOccurrenceForm && (
          <NewOccurrenceForm
            coordinates={newCoordinates}
            onClose={handleOccurrenceFormClose}
            onSuccess={handleOccurrenceFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* Camera Video Modal */}
      <CameraVideoModal
        camera={selectedCamera}
        onClose={() => setSelectedCamera(null)}
      />
    </div>
  );
};

export default MapPage;
