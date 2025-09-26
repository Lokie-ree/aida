import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface AidaFeedbackProps {
  currentSpaceId?: Id<"spaces"> | null;
}

export function AidaFeedback({ currentSpaceId }: AidaFeedbackProps) {
  const [lessonPlan, setLessonPlan] = useState("");
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const generateFeedback = useAction(api.feedback.generateFeedback);
  const feedbackHistory = useQuery(api.feedback.getFeedbackHistory, { 
    spaceId: currentSpaceId || undefined 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lessonPlan.trim()) {
      toast.error("Please enter a lesson plan to get feedback");
      return;
    }

    setIsLoading(true);
    setFeedback("");

    try {
      const result = await generateFeedback({
        lessonPlan: lessonPlan.trim(),
        title: title.trim() || undefined,
        spaceId: currentSpaceId || undefined,
      });
      
      setFeedback(result);
      toast.success("Feedback generated successfully!");
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setLessonPlan("");
    setTitle("");
    setFeedback("");
  };

  return (
    <div className="space-y-8">
      {/* Main Feedback Form */}
      <div className="bg-white rounded-lg shadow-xs border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Lesson Title (Optional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Photosynthesis"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all shadow-xs hover:shadow"
              aria-label="Lesson title"
              aria-describedby="title-help"
            />
            <p id="title-help" className="text-xs text-gray-500 mt-1">
              Optional: Give your lesson a descriptive title
            </p>
          </div>

          <div>
            <label 
              htmlFor="lessonPlan" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Lesson Plan or Teaching Content
            </label>
            <textarea
              id="lessonPlan"
              value={lessonPlan}
              onChange={(e) => setLessonPlan(e.target.value)}
              placeholder="Paste your lesson plan, teaching objectives, activities, or any instructional content you'd like feedback on..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all shadow-xs hover:shadow resize-y min-h-[200px]"
              aria-label="Lesson plan content"
              aria-describedby="lesson-plan-help"
              required
            />
            <p id="lesson-plan-help" className="text-xs text-gray-500 mt-1">
              Required: Enter your lesson plan or instructional content for AI feedback
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !lessonPlan.trim()}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs hover:shadow"
              aria-label="Generate AI feedback"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating Feedback...
                </span>
              ) : (
                "Get AI Feedback"
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all shadow-xs hover:shadow"
              aria-label="Clear form"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Display */}
      {(feedback || isLoading) && (
        <div className="bg-white rounded-lg shadow-xs border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI Feedback
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span>Analyzing your lesson plan...</span>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-800 leading-relaxed">
                {feedback}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback History */}
      {feedbackHistory && feedbackHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-xs border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Feedback Sessions
          </h3>
          
          <div className="space-y-4">
            {feedbackHistory.map((session) => (
              <div 
                key={session._id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">
                    {session.title || "Untitled Lesson"}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(session._creationTime).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {session.lessonPlan.substring(0, 150)}...
                </p>
                
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                    View Feedback
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-gray-700 whitespace-pre-wrap">
                    {session.feedback}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
