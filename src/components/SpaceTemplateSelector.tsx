import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface SpaceTemplateSelectorProps {
  onSpaceCreated?: (spaceId: string) => void;
  className?: string;
}

export function SpaceTemplateSelector({ onSpaceCreated, className }: SpaceTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const templates = useQuery(api.spaces.getSpaceTemplates);
  const createSpaceFromTemplate = useMutation(api.spaces.createSpaceFromTemplate);

  const handleCreateSpace = async (templateType: string) => {
    if (!templates) return;
    
    setIsCreating(true);
    try {
      const result = await createSpaceFromTemplate({ templateType: templateType as any });
      
      toast.success("Space created successfully!", {
        description: `Your ${templates.find(t => t.type === templateType)?.name} is ready to use.`
      });
      
      onSpaceCreated?.(result.spaceId);
    } catch (error) {
      console.error("Error creating space:", error);
      toast.error("Failed to create space. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!templates) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-aida-primary-600 mb-2">
          Choose Your Space Template
        </h2>
        <p className="text-muted-foreground">
          Get started quickly with pre-configured templates designed for different educational needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.type}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.type
                ? "ring-2 ring-aida-primary-500 shadow-lg"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedTemplate(template.type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${template.color}20` }}
                >
                  {template.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                      style={{ backgroundColor: `${template.color}15` }}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateSpace(template.type);
                  }}
                  disabled={isCreating}
                  className="w-full"
                  style={{ backgroundColor: template.color }}
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Space
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 rounded-lg bg-aida-primary-50 border border-aida-primary-200">
          <div className="flex items-center gap-2 text-aida-primary-700">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              {templates.find(t => t.type === selectedTemplate)?.name} selected
            </span>
          </div>
          <p className="text-sm text-aida-primary-600 mt-1">
            Click "Create Space" to set up your space with this template.
          </p>
        </div>
      )}
    </div>
  );
}
