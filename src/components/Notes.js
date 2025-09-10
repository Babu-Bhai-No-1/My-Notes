import React, { useState, useContext, useEffect } from 'react'
import NoteContext from "../context/notes/noteContext.js"
import NoteItem from './NoteItem.js';
import AddNote from './AddNote.js';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(NoteContext);
    let navigate = useNavigate();
    const { notes, getNotes, editNote } = context;

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getNotes();
        }
        else {
            navigate("/login");
        }
        //eslint-disable-next-line
    }, [])

    // State for modal visibility
    const [modalOpen, setModalOpen] = useState(false);

    // State for currently editing note
    const [currentNote, setCurrentNote] = useState({ id: "", title: "", description: "", tag: "default" })

    const updateNote = (note) => {
        setCurrentNote(note);  // set note being edited
        setModalOpen(true);     // open modal
    }

    const handleClick = (e) => {
        // Call your editNote function here if needed
        setModalOpen(false); // close modal after updating
        editNote(currentNote._id, currentNote.title, currentNote.description, currentNote.tag);
        props.showAlert("Updated successfully", "success");
    }

    const onChange = (e) => {
        setCurrentNote({ ...currentNote, [e.target.name]: e.target.value })
    }

    return (
        <>
            <AddNote showAlert={props.showAlert} />

            {/* Modal */}
            {modalOpen && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Note</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalOpen(false)}></button>

                            </div>
                            <div className="modal-body">
                                <form className="my-3">
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="title" name="title" value={currentNote.title} onChange={onChange} minLength={5} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <input type="text" className="form-control" id="description" name="description" value={currentNote.description} onChange={onChange} minLength={5} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="tag" className="form-label">Tag</label>
                                        <input type="text" className="form-control" id="tag" name="tag" value={currentNote.tag} onChange={onChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
                                <button disabled={currentNote.title.length < 5 || currentNote.description.length < 5} type="button" className="btn btn-primary" onClick={handleClick} >Update Note</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container mx-1">
                    {notes.length === 0 && "No notes to display"}
                </div>
                {Array.isArray(notes) && notes.map((note) => (
                    <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                ))}

            </div>
        </>
    )
}

export default Notes
