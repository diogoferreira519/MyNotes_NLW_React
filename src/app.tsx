import logo from "./assets/Logo_cinza.svg";
import diogo from "./assets/diogo.jpg";
import { NoteCard } from "./components/note-card";
import { NewNoteCard } from "./components/newNote-card";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    };
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id != id;
    });
    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }
  function onNoteEdit(content: string, id : string) {
    const updatedNotes = notes.map(note=>{
      if(note.id == id){
        return {...note, content : content}
      }
      else{
       return note
      }
    }) 
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    toast.success("Nota atualizada com sucesso")
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <div className="flex flex-col size-24 gap-2 mb-20">
        <div className="flex items-center gap-4">
          <img
            src={diogo}
            className="rounded-full shadow-lg border-slate-500 border-2 transition-transform duration-100 ease-in-out hover:scale-110"
            alt="Diogo Ferreira"
          ></img>
          <div className="flex flex-col items-center text-center gap-1">
            <h2 className="text-2xl font-semibold text-lime-400">MYNOTES</h2>
            <h4 className="text-sm text-slate-400">by Diogo Ferreira</h4>
          </div>
        </div>
        <img src={logo} alt="NLW Expert"></img>
      </div>
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full outline-none bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-lime-600" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} onNoteEdit={onNoteEdit} />
          );
        })}
      </div>
    </div>
  );
}
