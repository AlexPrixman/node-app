const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated,(req, res) => {
    res.render('notes/new-note');
})

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description }= req.body;
    const errors = [];

    if(!title){
        errors.push({text:'Please write a title.'});
    }
    if(!description){
        errors.push({text:'Please remember to descript what is in your note.'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    }else{
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'The note has been added successfully.');
        res.redirect('/notes');
    }
})

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).lean().sort({date:'desc'});
    res.render('notes/all-notes', {notes});
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description}= req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description}).lean();
    req.flash('success_msg', 'The note has been udpated successfully.');
    res.redirect('/notes');
})

router.delete('/notes/delete-note/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'The note has been deleted successfully.');
    res.redirect('/notes');
})


module.exports = router