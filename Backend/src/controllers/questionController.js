const supabase = require("../config/supabase");

async function createQuestion(req, res) {
  try {
    const {
      question,
      source = "WEB",
    } = req.body;

    if (
      !question ||
      typeof question !== "string"
    ) {
      return res.status(400).json({
        error: "A question is required",
      });
    }

    const cleanedQuestion = question.trim();

    if (!cleanedQuestion) {
      return res.status(400).json({
        error: "Question cannot be empty",
      });
    }

    const { data: status, error: statusError } =
      await supabase
        .from("question_statuses")
        .select("id")
        .eq("code", "NEW")
        .single();

    if (statusError) {
      return res.status(500).json({
        error: statusError.message,
      });
    }

    const { data: sourceData, error: sourceError } =
      await supabase
        .from("question_sources")
        .select("id")
        .eq("code", source)
        .single();

    if (sourceError) {
      return res.status(500).json({
        error: sourceError.message,
      });
    }

    const referenceNumber =
      `Q-${new Date().getFullYear()}-${Date.now()}`;

    const { data, error } = await supabase
      .from("questions")
      .insert({
        reference_number: referenceNumber,
        question_text: cleanedQuestion,
        status_id: status.id,
        source_id: sourceData.id,
        is_anonymous: true,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: "Unable to save question",
      });
    }

    res.status(201).json({
      message: "Question saved successfully",
      question: data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}

module.exports = {
  createQuestion,
};