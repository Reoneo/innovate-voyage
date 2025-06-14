
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText } from 'lucide-react';

interface EnsTextRecordsProps {
  records?: Record<string, string>;
}

const EnsTextRecords: React.FC<EnsTextRecordsProps> = ({ records }) => {
  if (!records || Object.keys(records).length === 0) {
    return null;
  }

  // Filter out any records with empty values, just in case
  const validRecords = Object.entries(records).filter(([_, value]) => value && value.trim() !== '');

  if (validRecords.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <BookText className="h-5 w-5 text-sky-600" />
          Additional ENS Records
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 pt-0 pb-3">
        <ul className="space-y-1 list-none pl-0 text-left">
          {validRecords.map(([key, value]) => (
            <li key={key} className="break-all">
              <span className="font-medium text-gray-600">{key}:</span> {value}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EnsTextRecords;
