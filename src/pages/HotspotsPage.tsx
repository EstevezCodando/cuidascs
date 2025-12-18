import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, MapPin, AlertTriangle, Filter, ArrowUpDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ScoreBadge } from '@/components/ScoreBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gerarExplicacaoScore, getCategoriaLabel } from '@/lib/score';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HotspotsPage: React.FC = () => {
  const { hotspots, setSelectedHotspot, usuario, gerarRoteiro } = useApp();
  const navigate = useNavigate();
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredHotspots = hotspots.filter(h => 
    filterCategoria === 'all' || h.categoria === filterCategoria
  );

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleViewOnMap = (hotspot: typeof hotspots[0]) => {
    setSelectedHotspot(hotspot);
    navigate('/');
  };

  const handleGerarRoteiro = () => {
    if (selectedIds.length > 0) {
      gerarRoteiro(selectedIds);
      navigate('/roteiros');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-status-priority" />
            Hotspots Priorizados
          </h1>
          <p className="text-muted-foreground">
            {hotspots.length} hotspots identificados • Ordenados por prioridade
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="critico">Crítico</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
              <SelectItem value="medio">Médio</SelectItem>
              <SelectItem value="baixo">Baixo</SelectItem>
            </SelectContent>
          </Select>

          {usuario.perfil === 'operador' && selectedIds.length > 0 && (
            <Button onClick={handleGerarRoteiro}>
              Gerar Roteiro ({selectedIds.length})
            </Button>
          )}
        </div>
      </motion.div>

      {/* Hotspots Grid */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredHotspots.map((hotspot, index) => (
          <motion.div key={hotspot.id} variants={itemVariants}>
            <Card 
              className={`card-hover cursor-pointer transition-all ${
                selectedIds.includes(hotspot.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => usuario.perfil === 'operador' && toggleSelection(hotspot.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm">
                      #{index + 1}
                    </div>
                    <ScoreBadge
                      score={hotspot.score}
                      categoria={hotspot.categoria}
                      size="md"
                    />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getCategoriaLabel(hotspot.categoria)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {hotspot.latitudeCentro.toFixed(4)}, {hotspot.longitudeCentro.toFixed(4)}
                  </span>
                </div>

                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ocorrências: </span>
                    <span className="font-medium">{hotspot.ocorrenciasIds.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Detecções: </span>
                    <span className="font-medium">{hotspot.deteccoesIds.length}</span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-2">
                    <AlertTriangle className="w-3 h-3" />
                    Composição do Score
                  </div>
                  {gerarExplicacaoScore(hotspot.componentesScore).map((exp, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      • {exp}
                    </p>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOnMap(hotspot);
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Ver no Mapa
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredHotspots.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Flame className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">Nenhum hotspot encontrado</h3>
          <p className="text-muted-foreground">
            Não há hotspots com o filtro selecionado.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default HotspotsPage;
