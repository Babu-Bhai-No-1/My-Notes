import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Fetch Notes
  const getNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found in localStorage");
      setNotes([]);
      return;
    }

    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const json = await response.json();

      if (Array.isArray(json)) {
        setNotes(json);
      } else {
        setNotes([]);
        console.error("Failed to fetch notes:", json);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ title, description, tag }),
      });

      const json = await response.json();

      if (json._id) {
        setNotes(notes.concat(json)); // Backend returns a note object
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ title, description, tag }),
      });

      const json = await response.json();

      // Update frontend notes
      setNotes(
        notes.map((note) =>
          note._id === id
            ? { ...note, title, description, tag }
            : note
        )
      );
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
