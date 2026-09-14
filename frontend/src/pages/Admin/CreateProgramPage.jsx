import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/routePaths";
import EthiopianCross from "../../components/ui/EthiopianCross";
import ProgramDetailsForm from "../../components/programs/ProgramDetailsForm";
import ProgramScheduleForm from "../../components/programs/ProgramScheduleForm";
import { ArrowLeft, Plus, Calendar } from "lucide-react";

export default function CreateProgramPage() {
  const navigate = useNavigate();

  const [programTypes, setProgramTypes] = useState([]);
  const [programStatuses, setProgramStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    program_type_id: "",
    status_id: "",
    program_date: new Date().toISOString().split("T")[0],
    start_time: "14:00",
    end_time: "17:00",
    location: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [
        { data: types, error: typesErr },
        { data: statuses, error: statusesErr },
      ] = await Promise.all([
        supabase.from("program_types").select("*"),
        supabase.from("program_statuses").select("*"),
      ]);

      if (typesErr) throw typesErr;
      if (statusesErr) throw statusesErr;

      setProgramTypes(types || []);
      setProgramStatuses(statuses || []);

      setFormData((prev) => ({
        ...prev,
        program_type_id: types?.[0]?.id || "",
        status_id: statuses?.[0]?.id || "",
      }));
    } catch (err) {
      console.error("Failed to load initial form data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: newProgram, error: programErr } = await supabase
        .from("programs")
        .insert([
          {
            title: formData.title,
            description: formData.description,
            program_type_id: formData.program_type_id || null,
            status_id: formData.status_id || null,
            program_date: formData.program_date,
            start_time: formData.start_time,
            end_time: formData.end_time,
            location: formData.location,
          },
        ])
        .select()
        .single();

      if (programErr) throw programErr;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: auditErr } = await supabase.from("audit_logs").insert([
        {
          action: "CREATE_PROGRAM",
          entity_type: "program",
          entity_id: newProgram.id,
          details: {
            title: newProgram.title,
            reference_number: newProgram.reference_number,
            questions_count: 0,
          },
          performed_by: user?.id || null,
        },
      ]);

      if (auditErr) {
        console.warn("Failed to log audit record:", auditErr.message);
      }

      navigate(ROUTES.PROGRAMS);
    } catch (err) {
      console.error("Error saving program:", err);
      alert(`Error saving program: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <EthiopianCross size={36} variant="gold" className="animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading form configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back to Programs link */}
      <div>
        <Link
          to={ROUTES.PROGRAMS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50/70 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Programs</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
                አዲስ መርሐ-ግብር • New Gathering
              </span>
            </div>
            <h1 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
              Create Spiritual Program
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Schedule a new youth spiritual gathering, lecture, or question-and-answer session.
            </p>
          </div>

          <div className="hidden sm:block">
            <EthiopianCross size={38} variant="gold" />
          </div>
        </div>

        <ProgramDetailsForm
          formData={formData}
          setFormData={setFormData}
          programTypes={programTypes}
        />

        <ProgramScheduleForm
          formData={formData}
          setFormData={setFormData}
          programStatuses={programStatuses}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-amber-900/20 disabled:opacity-50 text-sm cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>{submitting ? "Saving Spiritual Program..." : "Save & Schedule Program • መርሐ-ግብር ፍጠር"}</span>
        </button>
      </form>
    </div>
  );
}