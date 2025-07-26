"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  title: string;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  coordinates,
  title,
  height = "300px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || mapInstance.current) return;

    const google = (window as any).google;
    if (!google?.maps) return;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: coordinates,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    new google.maps.Marker({
      position: coordinates,
      map: mapInstance.current,
      title,
    });
  }, [isScriptLoaded, coordinates]);

  const StaticMapFallback = () => (
    <div
      className="w-full bg-slate-100 rounded-lg flex flex-col items-center justify-center border"
      style={{ height }}
    >
      <MapPin className="w-12 h-12 text-slate-400 mb-2" />
      <p className="text-sm text-slate-600 text-center px-4">
        <strong>{title}</strong>
        <br />
        {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
      </p>
      <p className="text-xs text-slate-500 mt-2">Map preview</p>
    </div>
  );

  return (
    <>
      <Script
  src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyD7BBc93QCFYBd8fnbmUF1SGi4LOC4xNZ4&libraries=places`}
  strategy="afterInteractive"
  onLoad={() => setIsScriptLoaded(true)}
      />

      <div className="w-full" style={{ height }}>
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        {!isScriptLoaded && <StaticMapFallback />}
      </div>
    </>
  );
};

export default GoogleMap;
