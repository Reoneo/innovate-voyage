
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTalentProtocolSkills = (userId?: string) => {
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchVerifiedSkills = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('proxy-talent-protocol', {
          body: { username: userId }
        });

        if (error) {
          throw error;
        }

        // Correctly parse the skills from the Talent Protocol API response structure
        const skills = (data as any)?.talent?.verified_skills
          ?.map((s: any) => s.skill.name)
          .filter(Boolean) || [];
          
        setVerifiedSkills(skills);

      } catch (err) {
        console.error("Error fetching talent protocol skills:", err);
        setVerifiedSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedSkills();
  }, [userId]);

  return { verifiedSkills, loading };
};
