import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { InnovationList } from '../community/InnovationList';

const CommunityRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  
  // For now, just show InnovationList regardless of tab
  // TODO: Implement different views based on tab parameter
  return <InnovationList />;
};

export default CommunityRoute;
