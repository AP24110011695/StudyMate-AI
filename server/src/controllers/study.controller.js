const PDF = require('../models/PDF');
const StudyNotes = require('../models/StudyNotes');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const aiService = require('../services/aiService');

// Helper to extract JSON from Gemini response
const extractJSON = (text) => {
  try {
    // Attempt to parse directly
    return JSON.parse(text);
  } catch (err) {
    // If it fails, try to extract from markdown code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        throw new Error('Failed to parse AI response into JSON format.');
      }
    }
    throw new Error('Failed to parse AI response into JSON format.');
  }
};

const validatePdfForStudy = async (pdfId, userId) => {
  const pdf = await PDF.findById(pdfId);
  
  if (!pdf) {
    const error = new Error('PDF not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (pdf.userId.toString() !== userId) {
    const error = new Error('You do not have permission to access this PDF');
    error.statusCode = 403;
    throw error;
  }
  
  if (pdf.processingStatus !== 'completed' || !pdf.extractedText) {
    const error = new Error('PDF processing is not complete or extracted text is missing');
    error.statusCode = 400;
    throw error;
  }
  
  return pdf;
};

exports.generateNotes = async (req, res, next) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.id;

    // Check Cache
    let notes = await StudyNotes.findOne({ pdfId, userId });
    if (notes) {
      return res.status(200).json({
        success: true,
        data: notes
      });
    }

    const pdf = await validatePdfForStudy(pdfId, userId);

    const prompt = `
Generate structured study notes based ONLY on the document provided.
Do NOT invent information. Keep it concise, educational, and formatting friendly.

Format the response EXACTLY as a JSON object with the following structure:
{
  "summary": "A concise paragraph summarizing the entire document.",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "importantConcepts": ["Concept 1", "Concept 2"],
  "definitions": [
    { "term": "Term 1", "definition": "Definition 1" },
    { "term": "Term 2", "definition": "Definition 2" }
  ],
  "importantFormulas": ["Formula 1", "Formula 2"] // Only include if there are formulas, otherwise empty array
}

Return ONLY the raw JSON object. No other text.`;

    const aiResponse = await aiService.sendMessage(pdf.extractedText, prompt);
    const parsedData = extractJSON(aiResponse);

    notes = await StudyNotes.create({
      userId,
      pdfId,
      summary: parsedData.summary || 'No summary generated.',
      keyPoints: parsedData.keyPoints || [],
      importantConcepts: parsedData.importantConcepts || [],
      definitions: parsedData.definitions || [],
      importantFormulas: parsedData.importantFormulas || []
    });

    res.status(201).json({
      success: true,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

exports.generateQuiz = async (req, res, next) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.id;

    // Check Cache
    let quiz = await Quiz.findOne({ pdfId, userId });
    if (quiz) {
      return res.status(200).json({
        success: true,
        data: quiz
      });
    }

    const pdf = await validatePdfForStudy(pdfId, userId);

    const prompt = `
Generate a 10-question multiple-choice quiz based ONLY on the document provided.
Do NOT invent information.

Format the response EXACTLY as a JSON object with the following structure:
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "A short explanation of why this is correct based on the text."
    }
    // Exactly 10 questions...
  ]
}

Ensure that each question has EXACTLY 4 options, and the correctAnswer is an EXACT match to one of the options.
Return ONLY the raw JSON object. No other text.`;

    const aiResponse = await aiService.sendMessage(pdf.extractedText, prompt);
    const parsedData = extractJSON(aiResponse);

    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error('Invalid AI response format for quiz');
    }

    quiz = await Quiz.create({
      userId,
      pdfId,
      questions: parsedData.questions
    });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

exports.generateFlashcards = async (req, res, next) => {
  try {
    const { pdfId } = req.params;
    const userId = req.user.id;

    // Check Cache
    let flashcard = await Flashcard.findOne({ pdfId, userId });
    if (flashcard) {
      return res.status(200).json({
        success: true,
        data: flashcard
      });
    }

    const pdf = await validatePdfForStudy(pdfId, userId);

    const prompt = `
Generate 20-30 flashcards based ONLY on the document provided.
Do NOT invent information. Extract key terms, definitions, concepts, and factual questions.

Format the response EXACTLY as a JSON object with the following structure:
{
  "cards": [
    {
      "question": "Question or term here",
      "answer": "Answer or definition here"
    }
  ]
}

Return ONLY the raw JSON object. No other text.`;

    const aiResponse = await aiService.sendMessage(pdf.extractedText, prompt);
    const parsedData = extractJSON(aiResponse);

    if (!parsedData.cards || !Array.isArray(parsedData.cards)) {
      throw new Error('Invalid AI response format for flashcards');
    }

    flashcard = await Flashcard.create({
      userId,
      pdfId,
      cards: parsedData.cards
    });

    res.status(201).json({
      success: true,
      data: flashcard
    });
  } catch (error) {
    next(error);
  }
};
