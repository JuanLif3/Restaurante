// apps/frontend/src/app/utils/VoiceAssistant.tsx
import { useState, useEffect } from 'react';
// Asegúrate de que la ruta al CSS sea correcta. Si utils y pages son hermanos:
import '../pages/css/VoiceAssistant.css'; 

interface Props {
  textToRead: string;
}

export const VoiceAssistant = ({ textToRead }: Props) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log("Voces cargadas:", availableVoices.length); // Debug
      setVoices(availableVoices);
    };

    loadVoices();
    // Chrome carga las voces de forma asíncrona
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // NOTA: Quitamos el cleanup de .cancel() por ahora para evitar cortes en modo desarrollo
  }, []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      console.log("Deteniendo voz...");
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      console.log("Intentando hablar...");
      // 1. Cancelar cualquier audio anterior
      window.speechSynthesis.cancel();

      // 2. Crear la instancia
      const utterance = new SpeechSynthesisUtterance(textToRead);

      // 3. SELECCIÓN DE VOZ ROBUSTA
      // Intentamos buscar español, si no, cualquier voz que contenga 'es', si no, la primera por defecto
      let selectedVoice = voices.find(v => v.lang.startsWith('es-ES')); // Español España
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith('es')); // Cualquier Español
      if (!selectedVoice) selectedVoice = voices[0]; // La que sea (fallback)

      if (selectedVoice) {
        console.log("Voz seleccionada:", selectedVoice.name);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        console.warn("No se encontraron voces disponibles aún.");
      }

      utterance.rate = 0.9; // Velocidad
      utterance.pitch = 1;

      // 4. EVENTOS
      utterance.onstart = () => {
        console.log("Comenzó a hablar");
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log("Terminó de hablar");
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error("Error de SpeechSynthesis:", e);
        setIsSpeaking(false);
      };

      // 5. HACK NUCLEAR ANTI-GARBAGE-COLLECTOR
      // Asignamos el objeto a la ventana global para que React/Chrome no lo borren de la memoria
      // @ts-ignore
      window.currentUtterance = utterance;

      // 6. HABLAR
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button 
      className={`voice-assistant-btn ${isSpeaking ? 'speaking' : ''}`} 
      onClick={toggleSpeech}
      title="Escuchar contenido"
      type="button" 
    >
      {isSpeaking ? '🤫' : '🔊'}
    </button>
  );
};