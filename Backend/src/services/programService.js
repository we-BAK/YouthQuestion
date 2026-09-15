const supabase = require("../config/supabase");

/**
 * Fetch lookup maps for statuses and outcomes by code
 */
async function getLookupMaps() {
  const [{ data: statuses }, { data: outcomes }, { data: types }] = await Promise.all([
    supabase.from("program_statuses").select("id, code, name"),
    supabase.from("program_question_outcomes").select("id, code, name"),
    supabase.from("program_types").select("id, code, name"),
  ]);

  const statusMap = Object.fromEntries((statuses || []).map((s) => [s.code, s.id]));
  const outcomeMap = Object.fromEntries((outcomes || []).map((o) => [o.code, o.id]));
  const typeMap = Object.fromEntries((types || []).map((t) => [t.code, t.id]));

  return { statusMap, outcomeMap, typeMap };
}

/**
 * Get all programs with question progress counters
 */
async function getAllPrograms(filters = {}) {
  let query = supabase
    .from("programs")
    .select(`
      id,
      reference_number,
      title,
      description,
      program_date,
      start_time,
      end_time,
      location,
      status:program_statuses(id, code, name),
      type:program_types(id, code, name),
      program_questions(
        id,
        outcome:program_question_outcomes(id, code, name)
      )
    `)
    .order("program_date", { ascending: false });

  if (filters.status_id) query = query.eq("status_id", filters.status_id);
  if (filters.location) query = query.ilike("location", `%${filters.location}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data.map((prog) => {
    const questions = prog.program_questions || [];
    const outcomeCounts = {
      ADDRESSED: 0,
      PARTIALLY_ADDRESSED: 0,
      DEFERRED: 0,
      NOT_ADDRESSED: 0,
    };

    questions.forEach((q) => {
      const code = q.outcome?.code;
      if (code && outcomeCounts[code] !== undefined) {
        outcomeCounts[code]++;
      }
    });

    return {
      ...prog,
      totalQuestions: questions.length,
      outcomeCounts,
    };
  });
}

/**
 * Get single program details with topics and assigned questions
 */
async function getProgramById(id) {
  const { data, error } = await supabase
    .from("programs")
    .select(`
      id,
      reference_number,
      title,
      description,
      program_date,
      start_time,
      end_time,
      location,
      status:program_statuses(id, code, name),
      type:program_types(id, code, name),
      topics:program_topics(id, title, description, display_order),
      questions:program_questions(
        id,
        topic_id,
        addressed_at,
        discussion_notes,
        outcome:program_question_outcomes(id, code, name),
        question:questions(id, reference_number, question_text)
      )
    `)
    .eq("id", id)
    .order("display_order", { foreignTable: "program_topics", ascending: true })
    .single();

  if (error) throw new Error(error.message);

  if (data && data.questions) {
    data.questions = data.questions.map((pq) => ({
      ...pq,
      question: pq.question
        ? {
            ...pq.question,
            reference_code: pq.question.reference_number,
            question: pq.question.question_text,
          }
        : null,
    }));
  }

  return data;
}

/**
 * Create a new program, its topics, and question assignments
 */
async function createProgram(payload) {
  const { statusMap, outcomeMap } = await getLookupMaps();

  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reference_number = `P-${year}-${randomSuffix}`;

  // 1. Insert Base Program
  const { data: program, error: progErr } = await supabase
    .from("programs")
    .insert({
      reference_number,
      title: payload.title,
      description: payload.description,
      program_type_id: payload.program_type_id || null,
      status_id: statusMap["SCHEDULED"] || payload.status_id,
      program_date: payload.program_date,
      start_time: payload.start_time || null,
      end_time: payload.end_time || null,
      location: payload.location || null,
      created_by: payload.created_by || null,
    })
    .select()
    .single();

  if (progErr) throw new Error(progErr.message);

  // 2. Insert Topics
  const topicMap = {};
  if (payload.topics && payload.topics.length > 0) {
    const topicRecords = payload.topics.map((t, idx) => ({
      program_id: program.id,
      title: t.title,
      description: t.description || null,
      display_order: idx,
    }));

    const { data: insertedTopics, error: topicErr } = await supabase
      .from("program_topics")
      .insert(topicRecords)
      .select();

    if (topicErr) throw new Error(topicErr.message);

    insertedTopics.forEach((it, idx) => {
      topicMap[idx] = it.id;
    });
  }

  // 3. Link Questions
  if (payload.questions && payload.questions.length > 0) {
    const defaultOutcomeId = outcomeMap["NOT_ADDRESSED"];

    const questionRecords = payload.questions.map((q) => ({
      program_id: program.id,
      question_id: q.question_id,
      topic_id: q.topic_index !== undefined ? topicMap[q.topic_index] : null,
      outcome_id: defaultOutcomeId,
      selected_for_program: true,
    }));

    const { error: qErr } = await supabase.from("program_questions").insert(questionRecords);
    if (qErr) throw new Error(qErr.message);
  }

  return program;
}

/**
 * Update individual question outcome & notes during/after program
 */
async function updateQuestionOutcome(programQuestionId, { outcome_id, discussion_notes, recorded_by }) {
  const { data, error } = await supabase
    .from("program_questions")
    .update({
      outcome_id,
      discussion_notes,
      recorded_by: recorded_by || null,
    })
    .eq("id", programQuestionId)
    .select(`
      id,
      addressed_at,
      discussion_notes,
      outcome:program_question_outcomes(id, code, name)
    `)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function getProgramOutcomes() {
  const { data, error } = await supabase
    .from("program_question_outcomes")
    .select("id, code, name")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Assign a category to a program:
 * Finds all questions in that category and auto-links any not yet in program_questions.
 */
async function assignCategoryToProgram(programId, categoryId) {
  const { outcomeMap } = await getLookupMaps();
  const defaultOutcomeId = outcomeMap["NOT_ADDRESSED"];

  // 1. Get all question IDs that belong to this category
  const { data: categoryQuestions, error: catErr } = await supabase
    .from("question_categories")
    .select("question_id")
    .eq("category_id", categoryId);

  if (catErr) throw new Error(`Failed to fetch category questions: ${catErr.message}`);

  if (!categoryQuestions || categoryQuestions.length === 0) {
    return { linked: 0 };
  }

  const categoryQuestionIds = categoryQuestions.map((cq) => cq.question_id);

  // 2. Get question IDs already linked to this program to avoid duplicates
  const { data: existingLinks, error: existErr } = await supabase
    .from("program_questions")
    .select("question_id")
    .eq("program_id", programId);

  if (existErr) throw new Error(`Failed to fetch existing program questions: ${existErr.message}`);

  const alreadyLinkedIds = new Set((existingLinks || []).map((l) => l.question_id));

  // 3. Filter to only new questions not yet linked
  const newQuestionIds = categoryQuestionIds.filter((qId) => !alreadyLinkedIds.has(qId));

  if (newQuestionIds.length === 0) {
    return { linked: 0 };
  }

  // 4. Insert new program_questions rows
  const inserts = newQuestionIds.map((qId) => ({
    program_id: programId,
    question_id: qId,
    outcome_id: defaultOutcomeId,
    selected_for_program: true,
  }));

  const { error: insertErr } = await supabase.from("program_questions").insert(inserts);
  if (insertErr) throw new Error(`Failed to link questions: ${insertErr.message}`);

  return { linked: newQuestionIds.length };
}

/**
 * Get all questions linked to a program with their outcome and question details.
 */
async function getProgramQuestions(programId) {
  const { data, error } = await supabase
    .from("program_questions")
    .select(`
      id,
      topic_id,
      addressed_at,
      discussion_notes,
      selected_for_program,
      outcome:program_question_outcomes(id, code, name),
      question:questions(
        id,
        reference_number,
        question_text,
        is_anonymous,
        created_at,
        status:question_statuses(id, code, name),
        question_categories(
          category_id,
          categories(id, name)
        )
      )
    `)
    .eq("program_id", programId)
    .order("id", { ascending: true });

  if (error) throw new Error(`Failed to fetch program questions: ${error.message}`);

  return (data || []).map((pq) => ({
    programQuestionId: pq.id,
    topicId: pq.topic_id,
    addressedAt: pq.addressed_at,
    discussionNotes: pq.discussion_notes,
    selectedForProgram: pq.selected_for_program,
    outcome: pq.outcome,
    question: pq.question
      ? {
          id: pq.question.id,
          referenceNumber: pq.question.reference_number,
          questionText: pq.question.question_text,
          isAnonymous: pq.question.is_anonymous,
          createdAt: pq.question.created_at,
          status: pq.question.status,
          categories: (pq.question.question_categories || []).map((qc) => ({
            id: qc.category_id,
            name: qc.categories?.name || "Unknown",
          })),
        }
      : null,
  }));
}

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateQuestionOutcome,
  getProgramOutcomes,
  assignCategoryToProgram,
  getProgramQuestions,
};