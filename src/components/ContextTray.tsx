import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  FileText, 
  ExternalLink, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Upload,
  Users,
  Plus,
  Eye,
  Download
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'active' | 'processing' | 'error';
}

interface Source {
  id: string;
  title: string;
  type: 'document' | 'web' | 'policy';
  url?: string;
  relevance: number;
  excerpt: string;
}

interface Activity {
  id: string;
  type: 'question' | 'upload' | 'space_created' | 'space_switched';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ContextTrayProps {
  documents?: Document[];
  sources?: Source[];
  activity?: Activity[];
  onDocumentAction?: (action: string, documentId: string) => void;
  onSourceClick?: (sourceId: string) => void;
  onActivityClick?: (activityId: string) => void;
  className?: string;
}

type TabType = 'documents' | 'sources' | 'activity';

export const ContextTray: React.FC<ContextTrayProps> = ({
  documents = [],
  sources = [],
  activity = [],
  onDocumentAction,
  onSourceClick,
  onActivityClick,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'documents' as TabType, label: 'Documents', icon: FileText, count: documents.length },
    { id: 'sources' as TabType, label: 'Sources', icon: ExternalLink, count: sources.length },
    { id: 'activity' as TabType, label: 'Activity', icon: Clock, count: activity.length }
  ];

  const formatFileSize = (size: string) => size;
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'question': return '💬';
      case 'upload': return '📄';
      case 'space_created': return '🏗️';
      case 'space_switched': return '🔄';
      default: return '📝';
    }
  };

  return (
    <Card className={`transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-64'} ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="h-8 px-3"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {tab.count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
            aria-label={isCollapsed ? 'Expand context tray' : 'Collapse context tray'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-0">
          <ScrollArea className="h-48">
            {activeTab === 'documents' && (
              <div className="space-y-2">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload Document
                    </Button>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{doc.type.toUpperCase()}</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.size)}</span>
                            <span>•</span>
                            <span>{formatTimestamp(doc.uploadedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onDocumentAction?.('view', doc.id)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onDocumentAction?.('download', doc.id)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="space-y-2">
                {sources.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ExternalLink className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No sources cited yet</p>
                    <p className="text-xs">Sources will appear here when you ask questions</p>
                  </div>
                ) : (
                  sources.map((source, index) => (
                    <div
                      key={source.id}
                      className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onSourceClick?.(source.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium truncate">{source.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {source.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(source.relevance * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {source.excerpt}
                          </p>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1 inline-flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View source
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-2">
                {activity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs">Activity will appear here as you use A.I.D.A.</p>
                  </div>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onActivityClick?.(item.id)}
                    >
                      <div className="flex-shrink-0 text-lg">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
};
