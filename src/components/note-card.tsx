import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { Pencil } from "lucide-react";
import { ptBR } from "date-fns/locale";
interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
  onNoteEdit: (id: string, content: string) => void;
}
import { X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";



export function NoteCard({ note, onNoteDeleted, onNoteEdit }: NoteCardProps) {
  const [edit, setEdit] = useState(false);
  const [inputEdit, setInputEdit]= useState(note.content)
  const [hoverEdit, setHoverEdit] = useState(false);
  useEffect(()=>{

  }, [edit])
function handleEditInput(event :ChangeEvent<HTMLTextAreaElement>){
  setInputEdit(event.target.value)
}
  return (
    <Dialog.Root>
      <Dialog.Trigger 
        className={`text-left flex flex-col rounded-md bg-slate-800
         p-5 gap-3 overflow-y-hidden transition-transform duration-100 ease-in-out hover:scale-105 relative hover:${
           !hoverEdit ? "ring-2" : ""
         }
          hover:ring-slate-600 outline-none focus-visible:ring-2
           focus-visible:ring-lime-400`}
      >
        <div className="flex w-full justify-between">
          <span className="text-sm font-medium text-slate-200">
            {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
          </span>
          <span>
            <Pencil
              onClick={() => {
                setEdit(true);

              }}
              className={`p-2 size-8 bg-slate-600 hover:border-2 rounded-full cursor-pointer`}
              onMouseEnter={() => setHoverEdit(true)}
              onMouseLeave={() => {
                setHoverEdit(false);
              }}
            />
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-400">{note.content}</p>
        <div className="absolute bottom-0 right-0 left-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        {!edit ? (
          <Dialog.Content
            className="fixed inset-0 overflow-hidden md:left-1/2 md:top-1/2 md:max-w-[640px] 
         w-full md:h-[60vh] md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700
         md:rounded-md flex flex-col outline-none"
          >
            <Dialog.DialogClose
            className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400">
              <X className="size-5 hover:text-red-400 hover:scale-110" />
            </Dialog.DialogClose>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                {formatDistanceToNow(note.date, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </span>
              <p className="text-sm leading-6 text-slate-400">{note.content}</p>
            </div>
            <button
              type="button"
              className="w-full bg-slate-800 py-4 text-center font-medium 
         text-sm text-slate-300 outline-none group"
            >
              Deseja{" "}
              <span
                onClick={() => {
                  onNoteDeleted(note.id);
                }}
                className="text-red-400 group-hover:underline"
              >
                apagar essa nota
              </span>
              ?
            </button>
          </Dialog.Content>
        ) : (
          <Dialog.Content
            className="fixed inset-0 overflow-hidden md:left-1/2 md:top-1/2 md:max-w-[640px] 
          w-full md:h-[60vh] md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700
          md:rounded-md flex flex-col outline-none"
          >
            <Dialog.DialogClose onClick={()=>{setEdit(false); setInputEdit(note.content);}} className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400">
              <X className="size-5 hover:text-red-400 hover:scale-110 " />
            </Dialog.DialogClose>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                {formatDistanceToNow(note.date, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </span>
              <textarea
                autoFocus
                value={inputEdit}
                onChange={handleEditInput}
                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full bg-slate-800 py-4 text-center font-medium 
          text-sm text-slate-300 outline-none group"
            >
              Deseja{" "}
              <span
                onClick={() => {
                  onNoteEdit(inputEdit, note.id);
                  setEdit(false)
                }}
                className="text-lime-400 group-hover:underline"
              >
                editar essa nota
              </span>
              ?
            </button>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
