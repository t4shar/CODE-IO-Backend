const express = require("express");
var fetchuser = require("../Middleware/fetchuser");
const Note = require("../modals/Note");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// Route 1 fetch all notes using get request : LOGIN REQUIRED "/api/notes/fecthnotes"
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/getbyid/:id", fetchuser, async (req, res) => {
  try {
    const notes = await Note.findById(req.params.id)
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2 ADD a new  note using post request : LOGIN REQUIRED "/api/notes/addnote"
router.post(
  "/postnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
    body("tag", "Enter a valid tag").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = await new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savednote = await note.save();

      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 Update  a note using put request : LOGIN REQUIRED "/api/notes/updatenote"
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a object for new note
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    // Find the note that you want to update
    let note = await Note.findById(req.params.id);
    // if note is not found
    if (!note) res.status(404).send("Not Found");
    // This check is if user is accessing other user notes
    if (note.user.toString() != req.user.id)
      return res.status(401).send("Not Allowed");
    // now update the note
    note = await Note.findOneAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Route 4 Delete  a note using put request : LOGIN REQUIRED "/api/notes/deletenote"
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note that you want to delete
    let note = await Note.findById(req.params.id);
    // if note is not found
    if (!note) res.status(404).send("Not Found");
    // This check is if user is accessing other user notes
    if (note.user.toString() != req.user.id)
      return res.status(401).send("Not Allowed");
    // now update the note
    note = await Note.findOneAndDelete(
      req.params.id
    );
    res.json({"Success" : "Saved Code has been deleted Succesfully"});
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
