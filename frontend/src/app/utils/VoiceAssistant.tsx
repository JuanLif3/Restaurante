// apps/frontend/src/app/utils/VoiceAssistant.tsx
import { useState, useEffect, useRef } from 'react';
import '../pages/css/VoiceAssistant.css';

interface Props {
  textToRead: string;
}

export const VoiceAssistant = ({ textToRead }: Props) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  // 1. Usamos useRef para que el navegador NO borre el objeto mientras habla
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    // Chrome a veces tarda en cargar las voces, esto asegura que las detecte
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Limpieza al salir de la página
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // 2. Cancelamos cualquier audio previo que se haya quedado pegado
      window.speechSynthesis.cancel();

      // 3. Creamos la instancia y la guardamos en la referencia segura
      const newUtterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = newUtterance;

      // Buscamos voz en español (Google español, Microsoft Helena, etc.)
      const esVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
      if (esVoice) newUtterance.voice = esVoice;
      
      newUtterance.lang = 'es-ES';
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1;

      // Eventos para controlar el estado visual
      newUtterance.onend = () => setIsSpeaking(false);
      newUtterance.onerror = (e) => {
        console.error("Error de voz:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(newUtterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button 
      className={`voice-assistant-btn ${isSpeaking ? 'speaking' : ''}`} 
      onClick={toggleSpeech}
      title="Escuchar contenido"
      type="button" // Importante para que no envíe formularios
    >
      {isSpeaking ? '🤫' : '🔊'}
    </button>
  );
};