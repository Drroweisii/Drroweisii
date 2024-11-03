import React from 'react';
import type { Prize } from '../../types/game';

interface PrizeSectorProps {
  prize: Prize;
  index: number;
  totalPrizes: number;
}

const PrizeSector: React.FC<PrizeSectorProps> = ({ prize, index, totalPrizes }) => {
  const IconComponent = prize.icon;
  const sectorAngle = 360 / totalPrizes;
  const rotation = sectorAngle * index;
  
  // Configuration based on the diagram
  const radius = 1.0; // 90% of container
  const itemLabelRadius = 0.6; // 60% from center
  const itemLabelRadiusMax = 0.8; // 80% from center
  const itemLabelRotation = -90; // Align text perpendicular to radius
  const borderWidth = 12;
  const lineWidth = 2;

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `rotate(${rotation}deg)`,
        clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos(Math.PI / totalPrizes)}% ${50 - 50 * Math.sin(Math.PI / totalPrizes)}%)`
      }}
    >
      <div 
        className={`absolute inset-0 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} 
                   border-r border-gray-600`}
      >
        <div
          className="absolute"
          style={{
            top: `${(1 - itemLabelRadius) * 50}%`,
            left: '50%',
            transform: `
              translateX(-50%) 
              rotate(${sectorAngle / 2 + itemLabelRotation}deg)
            `,
            transformOrigin: `50% ${itemLabelRadius * 100}%`,
            width: `${(itemLabelRadiusMax - itemLabelRadius) * 100}%`
          }}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${prize.color}`} />
            </div>
            <span className={`text-lg font-bold ${prize.color} whitespace-nowrap`}>
              {prize.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeSector;