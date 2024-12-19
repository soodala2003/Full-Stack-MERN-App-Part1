import express from "express";
import mongoose from "mongoose";
import Source from "../models/Source.js";

const router = express.Router();

// Get all bbc news sources 
router.get("/", async (req, res) => {
  try {
    const sources = await Source.find({});
    res.render("sources", { sources });
  } catch (error) {
    console.log("Error in fetching sources: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get a single source 
router.get("/:id", async (req, res) => {
  const {id} = req.params;

  try {
    const source = await Source.findById(id);

    if (!source) {
      return res.status(404).json({ success: false, message: "Source not found" });
    }

    res.render("source_id", { source });
  } catch (error) {
    console.log("Error in fetching users: ", error.message);
    res.status(404).json({ success: false, message: "Source not found" });
  }
});

// Add a new single source to the collection
router.post("/", async (req, res) => {
  const source = req.body;
  
  if (!source.author || !source.title) {
    return res.status(400).json({ success: false, message: "Please provide fields of Author and Title." });
  }
  
  const newSource = new Source(source);
  
  try {
    await newSource.save();
    res.redirect("sources");
    //res.status(201).json({ success: true, data: newSource });
  } catch (error) {
    console.error("Error in creating source: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Update a single source entry
router.put("/:id", async(req, res) => {
  const {id} = req.params;
  const source = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Source Id" });
  }
  
  try {
    const updatedSource = await Source.findByIdAndUpdate(id, source, {new:true});
    res.redirect("/api/sources"); 
    //res.status(200).json({ success: true, data: updatedSource });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
})

// Delete a single source entry
router.delete("/:id", async (req, res) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Source Id" });
  }

  try {
    await Source.findByIdAndDelete(id);
    res.redirect("/api/sources");
    //res.status(200).json({ success: true,  message: "Source deleted"});
  } catch (error) {
    console.log("Error in deleting source: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;