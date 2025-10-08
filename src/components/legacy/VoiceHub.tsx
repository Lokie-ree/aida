import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Upload, 
  Users, 
  Plus, 
  FileText, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { VoiceInterface } from './VoiceInterface';
import { Id } from '../../convex/_generated/dataModel';

interface VoiceHubProps {
  onTranscription?: (text: string) => void;
  onResponse?: (text: string) => void;
  onDocumentAction?: (action: string) => void;
  sourceCount?: number;
  documentCount?: number;
  className?: string;
}

export const VoiceHub: React.FC<VoiceHubProps> = ({
  onTranscription,
  onResponse,
  onDocumentAction,
  sourceCount = 0,
  documentCount = 0,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Voice Interface */}
      <VoiceInterface
        onTranscription={onTranscription}
        onResponse={onResponse}
        className="shadow-lg"
      />

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-foreground">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDocumentAction?.('upload')}
            className="w-full h-9 justify-start"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="shadow-sm">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Documents</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {documentCount}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sources</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {sourceCount}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
