"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const salesData = {
  USA: 100000,
  IND: 80000,
  BRA: 50000,
  CHN: 120000,
  CAN: 40000
};

export default function WorldMapComponent() {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        viewBox="0 0 1000 500"
        style={{ width: "100%", height: "auto" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.properties.ISO_A3;
              const value = salesData[countryCode] || 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: value > 0 ? "#3b82f6" : "#E5E7EB",
                      outline: "none"
                    },
                    hover: {
                      fill: "#2563eb",
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
