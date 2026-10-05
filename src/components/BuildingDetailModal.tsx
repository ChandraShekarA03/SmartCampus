import React from 'react';
import { CampusNode } from '../types';
import { X, MapPin, Building, Sparkles, Navigation, Layers, Users, Coffee, Trophy } from 'lucide-react';

interface BuildingDetailModalProps {
  node: CampusNode | null;
  onClose: () => void;
  onSetSource: (nodeId: string) => void;
  onSetTarget: (nodeId: string) => void;
}

export const BuildingDetailModal: React.FC<BuildingDetailModalProps> = ({
  node,
  onClose,
  onSetSource,
  onSetTarget
}) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700/80 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full badge-${node.category}`}>
                {node.category}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{node.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed text-slate-200">{node.description}</p>

          {node.floors && (
            <div className="flex items-center gap-2 text-slate-400">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{node.floors} Floors with Elevator & Stairwell access</span>
            </div>
          )}

          {node.departments && node.departments.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                Departments & Units
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {node.departments.map(dept => (
                  <span key={dept} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] border border-slate-800">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {node.facilities && node.facilities.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Key Facilities & Amenities
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {node.facilities.map(fac => (
                  <span key={fac} className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 text-[11px] border border-emerald-800/50">
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Routing Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onSetSource(node.id);
                onClose();
              }}
              className="btn-primary justify-center text-xs py-2.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              Set as Start
            </button>
            <button
              onClick={() => {
                onSetTarget(node.id);
                onClose();
              }}
              className="btn-accent justify-center text-xs py-2.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              Set as Destination
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
