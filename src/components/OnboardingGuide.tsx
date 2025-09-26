import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface OnboardingGuideProps {
  currentSpaceId?: Id<"spaces"> | null;
  onComplete?: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  order: number;
}

export function OnboardingGuide({ currentSpaceId, onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const loggedInUser = useQuery(api.auth.loggedInUser);

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      // Check if user is new (created within last 24 hours)
      const isNewUser = Date.now() - loggedInUser._creationTime < 24 * 60 * 60 * 1000;
      setIsVisible(isNewUser);
    }
  }, [loggedInUser]);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to A.I.D.A.!",
      description: "A.I.D.A. is your AI-powered instructional design assistant. Let's get you started with a quick tour.",
      action: "Let's begin",
      completed: false,
      order: 1
    },
    {
      id: "voice_intro",
      title: "Try Voice Commands",
      description: "Click the microphone button to start a voice conversation. Try asking: 'What are our district policies on student assessments?'",
      action: "Try voice chat",
      completed: false,
      order: 2
    },
    {
      id: "feedback_intro",
      title: "Get AI Feedback",
      description: "Upload a lesson plan or teaching content to get instant AI feedback on engagement and rigor improvements.",
      action: "Try feedback",
      completed: false,
      order: 3
    },
    {
      id: "documents_intro",
      title: "Upload District Documents",
      description: "Upload your district's policy documents, curriculum guides, and resources to make A.I.D.A. more helpful.",
      action: "Upload documents",
      completed: false,
      order: 4
    },
    {
      id: "spaces_intro",
      title: "Create Team Spaces",
      description: "Create shared spaces with your colleagues to collaborate and share knowledge through A.I.D.A.",
      action: "Create space",
      completed: false,
      order: 5
    },
    {
      id: "complete",
      title: "You're All Set!",
      description: "You've completed the onboarding! A.I.D.A. is ready to help you with district policies, lesson feedback, and more.",
      action: "Start using A.I.D.A.",
      completed: false,
      order: 6
    }
  ];

  const handleStepComplete = (stepId: string) => {
    const updatedSteps = onboardingSteps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    );
    
    // Move to next step
    const currentIndex = updatedSteps.findIndex(step => step.id === stepId);
    if (currentIndex < updatedSteps.length - 1) {
      setCurrentStep(currentIndex + 1);
    } else {
      // Onboarding complete
      setIsVisible(false);
      onComplete?.();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible || !user) {
    return null;
  }

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentStepData.title}
            </h2>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <div className="ml-4 flex space-x-1">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 text-sm"
            aria-label="Skip onboarding"
          >
            Skip
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          {currentStepData.description}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => handleStepComplete(currentStepData.id)}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          >
            {currentStepData.action}
          </button>
          
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Back
            </button>
          )}
        </div>

        {/* Quick tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Quick Tips:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Use voice commands for hands-free operation</li>
            <li>• Upload district documents for better context</li>
            <li>• Create team spaces to collaborate with colleagues</li>
            <li>• Ask specific questions about policies and procedures</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
