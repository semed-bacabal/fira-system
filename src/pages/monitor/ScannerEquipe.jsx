import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Html5Qrcode } from "html5-qrcode"

export default function ScannerEquipe() {

  const navigate = useNavigate()
  const scannerRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {

    const startCamera = async () => {
      try {

        if (startedRef.current) return
        startedRef.current = true

        scannerRef.current = new Html5Qrcode("reader")

        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {

            let token = decodedText

            try {
              if (decodedText.startsWith("http")) {
                const url = new URL(decodedText)
                const partes = url.pathname.split("/").filter(Boolean)
                token = partes[partes.length - 1]
              }
            } catch {}

            // Para o scanner com segurança
            scannerRef.current?.stop().catch(() => {})

            // Redireciona para a rota correta do monitor
            navigate(`/monitor/equipe/${token}`)
          },
          () => {}
        )

      } catch (err) {
        console.error("Erro ao acessar câmera:", err)
      }
    }

    startCamera()

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }

  }, [navigate])

  return (
    <div className="container mt-4 text-center">
      <h3 className="mb-3">Escanear QR Code</h3>
      <div
        id="reader"
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "0 auto"
        }}
      />
    </div>
  )
} 
