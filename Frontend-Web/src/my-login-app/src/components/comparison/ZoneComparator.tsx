import React, { useState, useEffect } from 'react';

interface Zone {
  zone_code: string;
  zone_name: string;
}

const ZoneComparator = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/bff/zones')
      .then(res => res.json())
      .then(data => setZones(data))
      .catch(() => {});
  }, []);

  const handleCompare = async () => {
    if (selectedZones.length < 2 || selectedZones.length > 5) {
      alert("Debe seleccionar entre 2 y 5 zonas");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/bff/compare?zones=${selectedZones.join(',')}`);
      const data = await res.json();
      setComparison(data);
    } catch (err) {
      alert("Error al comparar zonas");
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!comparison) return;

    let csvContent = "Indicador," + selectedZones.map((z: string) => 
      comparison.comparison[z]?.zone_name || z
    ).join(",") + "\n";

    comparison.indicators.forEach((ind: string) => {
      let row = ind + ",";
      selectedZones.forEach((z: string) => {
        const value = comparison.comparison[z]?.[ind];
        row += (value !== undefined ? value : "N/D") + ",";
      });
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "comparacion_zonas.csv";
    link.click();
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Comparación de Zonas - HU-21</h1>

      <select 
        multiple 
        value={selectedZones}
        onChange={(e) => setSelectedZones(Array.from(e.target.selectedOptions, (opt: HTMLOptionElement) => opt.value))}
        className="w-full p-4 border border-gray-300 rounded-xl h-64 mb-6"
      >
        {zones.map((z) => (
          <option key={z.zone_code} value={z.zone_code}>
            {z.zone_name} ({z.zone_code})
          </option>
        ))}
      </select>

      <button 
        onClick={handleCompare}
        disabled={loading || selectedZones.length < 2}
        className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold"
      >
        {loading ? "Comparando..." : "Comparar Zonas"}
      </button>

      {comparison && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Tabla Comparativa</h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-4">Indicador</th>
                {selectedZones.map((z, i) => (
                  <th key={i} className="border p-4 text-center">
                    {comparison.comparison[z]?.zone_name || z}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.indicators?.map((ind: string) => (
                <tr key={ind}>
                  <td className="border p-4 font-medium">{ind}</td>
                  {selectedZones.map((z) => {
                    const value = comparison.comparison[z]?.[ind];
                    return (
                      <td key={z} className="border p-4 text-center">
                        {value !== undefined ? Number(value).toFixed(2) : "N/D"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <button 
            onClick={downloadCSV} 
            className="mt-8 bg-green-600 text-white px-10 py-4 rounded-xl text-lg"
          >
            Descargar CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default ZoneComparator;