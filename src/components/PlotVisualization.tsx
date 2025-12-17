import { useState } from 'react';

interface Plot {
  plotNumber: string;
  dimensions: string;
  facing: string;
  status: string;
}

interface PlotVisualizationProps {
  plots: Plot[];
}

export function PlotVisualization({ plots }: PlotVisualizationProps) {
  const [hoveredPlot, setHoveredPlot] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'booked':
        return 'bg-red-500 hover:bg-red-600';
      case 'blocked':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'border-green-600';
      case 'booked':
        return 'border-red-600';
      case 'blocked':
        return 'border-yellow-600';
      default:
        return 'border-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">Blocked</span>
        </div>
      </div>

      {/* Plot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {plots.map((plot) => (
          <div
            key={plot.plotNumber}
            className="relative"
            onMouseEnter={() => setHoveredPlot(plot.plotNumber)}
            onMouseLeave={() => setHoveredPlot(null)}
          >
            <div
              className={`
                ${getStatusColor(plot.status)}
                ${getStatusBorderColor(plot.status)}
                border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer
                flex flex-col items-center justify-center text-white
                min-h-[120px]
              `}
            >
              <div className="text-center">
                <div className="text-sm opacity-80">Plot</div>
                <div className="text-xl">{plot.plotNumber}</div>
              </div>
            </div>

            {/* Hover Info Card */}
            {hoveredPlot === plot.plotNumber && (
              <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-3 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plot No:</span>
                    <span>{plot.plotNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span>{plot.dimensions} sq.ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Facing:</span>
                    <span>{plot.facing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`
                      font-medium
                      ${plot.status.toLowerCase() === 'available' ? 'text-green-600' : ''}
                      ${plot.status.toLowerCase() === 'booked' ? 'text-red-600' : ''}
                      ${plot.status.toLowerCase() === 'blocked' ? 'text-yellow-600' : ''}
                    `}>
                      {plot.status}
                    </span>
                  </div>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="w-3 h-3 bg-white border-b-2 border-r-2 border-gray-200 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-gray-600 text-sm">Total Plots</div>
          <div className="text-2xl mt-1">{plots.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-700 text-sm">Available</div>
          <div className="text-2xl text-green-700 mt-1">
            {plots.filter(p => p.status.toLowerCase() === 'available').length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-700 text-sm">Booked</div>
          <div className="text-2xl text-red-700 mt-1">
            {plots.filter(p => p.status.toLowerCase() === 'booked').length}
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-yellow-700 text-sm">Blocked</div>
          <div className="text-2xl text-yellow-700 mt-1">
            {plots.filter(p => p.status.toLowerCase() === 'blocked').length}
          </div>
        </div>
      </div>
    </div>
  );
}
