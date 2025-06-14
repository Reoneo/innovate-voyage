
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

interface ProfessionalSummaryProps {
  passportData: any;
}

const fetchSummary = async (passportData: any) => {
  const { data, error } = await supabase.functions.invoke('generate-cv-summary', {
    body: { passportData },
  });

  if (error) {
    throw new Error(error.message);
  }
  return data.summary;
};

const ProfessionalSummary: React.FC<ProfessionalSummaryProps> = ({ passportData }) => {
  const queryClient = useQueryClient();
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  const { mutate: generateSummary, isPending } = useMutation({
    mutationFn: () => fetchSummary(passportData),
    onSuccess: (data) => {
      setGeneratedSummary(data);
      queryClient.setQueryData(['cv-summary', passportData.owner_address], data);
    },
    onError: (error) => {
      console.error('Failed to generate summary:', error);
    },
  });
  
  const handleGenerateClick = () => {
    generateSummary();
  };

  const containerClasses = "rounded-xl bg-gradient-to-br from-[#1A1F2C]/80 via-[#7E69AB]/30 to-[#0FA0CE]/20 shadow-[0_2px_10px_#3f397cee,0_0px_0px_#7E69AB00_inset] p-0";

  return (
    <section id="professional-summary-section" className={"mt-4 " + containerClasses}>
      <CardHeader className="pb-2 bg-transparent flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-gradient-primary text-lg font-semibold tracking-wide">
          <Bot className="h-6 w-6" />
          AI-Generated Summary
        </CardTitle>
        <Button onClick={handleGenerateClick} disabled={isPending} size="sm">
          {isPending ? 'Generating...' : (generatedSummary ? 'Regenerate' : 'Generate Summary')}
        </Button>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : generatedSummary ? (
          <p className="text-sm text-gray-300">{generatedSummary}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Click "Generate Summary" to create a professional summary for your CV using AI.</p>
        )}
      </CardContent>
    </section>
  );
};

export default ProfessionalSummary;
