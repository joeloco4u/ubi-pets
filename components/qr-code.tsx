"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Download } from "lucide-react";

interface QRCodeProps {
  data: string;
  petName: string;
  size?: number;
}

export function QRCodeGenerator({ data, petName, size = 300 }: QRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: data,
      image: "",
      dotsOptions: {
        color: "#0A2540",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        color: "#FF6B35",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#FF6B35",
      },
    });

    setQrCode(qr);

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, [data, size]);

  const handleDownload = () => {
    if (qrCode) {
      qrCode.download({
        name: `ubi-pets-${petName.toLowerCase().replace(/\s+/g, "-")}`,
        extension: "png",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={qrRef}
        className="p-4 bg-white rounded-xl shadow-lg border-2 border-[#FF6B35]/20"
      />
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#FF6B35" }}
      >
        <Download className="w-5 h-5" />
        Descargar QR
      </button>
    </div>
  );
}