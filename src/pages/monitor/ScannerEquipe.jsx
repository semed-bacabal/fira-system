import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Html5Qrcode } from "html5-qrcode"

export default function ScannerEquipe() {

  const navigate = useNavigate()

  useEffect(() => {

    let scanner

    const startCamera = async () => {

      try {

        const cameras = await Html5Qrcode.getCameras()

        if (cameras && cameras.length) {

          scanner = new Html5Qrcode("reader")

          await scanner.start(
            cameras[0].id,   // usa câmera real do dispositivo
            {
              fps: 10,
              qrbox: 250
            },
            (decodedText) => {
              scanner.stop()
              navigate(`/monitor/equipe/${decodedText}`)
            }
          )
        }

      } catch (err) {
        console.error("Erro ao acessar câmera:", err)
      }
    }

    setTimeout(() => {
      startCamera()
    }, 300)

    return () => {
      if (scanner) {
        scanner.stop().catch(() => {})
      }
    }

  }, [])

  return (
    <div className="container mt-4">
      <h3>Escanear QR Code</h3>
      <div id="reader" style={{ width: "100%" }} />
    </div>
  )
}