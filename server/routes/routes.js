const express = require('express');
let frameData = require("../framedata/SF6FrameData.json");
const router = express.Router();
let axios = require("axios");

// Route to get all characters
router.get('/', (req, res) => {
    const chars = Object.keys(frameData);
    res.json(chars);
});

// Route to get all moves for a specific character
router.get('/:charName/', (req, res) => {
    const charName = req.params.charName;
    const charData = frameData[charName];

    if (charData) {
        res.json(charData.moves);
    } else {
        res.status(404).json({ error: 'Character not found' });
    }
});

module.exports = router;