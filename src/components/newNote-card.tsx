import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ChangeEvent, FormEvent, useState } from "react";
interface newNoteCardProps {
  onNoteCreated: (content: string) => void;

}
let speechRecognition: SpeechRecognition | null = null;
export function NewNoteCard({ onNoteCreated }: newNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState<string>("");
  const [isRecording, setRecording] = useState(false);
  function handleStartEditor() {
    setShouldShowOnboarding((prevState)=>!prevState);
  }
  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function saveNote(event: FormEvent) {
    if (content === "") {
      return;
    }
    event.preventDefault();
    onNoteCreated(content);
    setContent("");
    setShouldShowOnboarding(true);
    toast.success("Nota salva com sucesso!");
  }
  function handleRecordVoice() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação de voz");
      return;
    }
    setRecording(!isRecording);
    setShouldShowOnboarding(false);
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.lang = "PT-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");
      setContent(transcription);
    };
    speechRecognition.onerror = (event) => {
      console.error(event);
    };
    speechRecognition.start();
  }
  function stopRecording() {
    setRecording(false);

    if (speechRecognition != null) {
      speechRecognition.stop();
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="rounded-md bg-slate-700 p-5 flex flex-col gap-3 text-left hover:ring-2
          hover:ring-lime-400 outline-none focus-visible:ring-2
           focus-visible:ring-lime-400 transition-transform duration-100 ease-in-out hover:scale-105 "
      >
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content
          className="fixed inset-0 md:inset-auto overflow-hidden md:left-1/2 md:top-1/2 
          md:max-w-[640px] w-full md:h-[60vh] md:-translate-x-1/2 
          md:-translate-y-1/2 bg-slate-700 md:rounded-md 
          flex flex-col outline-none"
        >
          <Dialog.DialogClose
            className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400"
            onClick={()=>{
              setShouldShowOnboarding(true);
              setRecording(false);
            }}
          >
            <X className="size-5 hover:text-red-400 hover:scale-110" />
          </Dialog.DialogClose>
          <form className="flex flex-col flex-1">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleRecordVoice}
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  value={content}
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChange}
                ></textarea>
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="w-full flex flex-row gap-2 justify-center items-center bg-slate-900 py-4 text-center font-medium 
                 text-sm text-slate-300 outline-none hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={saveNote}
                className="w-full bg-lime-400 py-4 text-center font-medium 
              text-sm text-lime-950 outline-none hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
