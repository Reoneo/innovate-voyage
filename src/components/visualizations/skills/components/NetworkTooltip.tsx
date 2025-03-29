
import React from 'react';
import { PassportSkill } from '@/lib/utils';

interface NetworkTooltipProps {
  data: any;
  dataType: 'node' | 'link';
  skills: PassportSkill[];
  nodes?: any[];
}

const NetworkTooltip: React.FC<NetworkTooltipProps> = ({ 
  data, 
  dataType,
  skills,
  nodes
}) => {
  if (dataType === 'node') {
    if (data.type === "user") {
      return <div><strong>{data.name}</strong><br />Main profile</div>;
    } else if (data.type === "ens") {
      return <div><strong>{data.name}</strong><br />ENS Domain</div>;
    } else {
      const skill = skills.find(s => s.name === data.name);
      return (
        <div>
          <strong>{data.name}</strong><br />
          {data.verified ? "Verified skill" : "Unverified skill"}
          {skill?.issued_by ? <><br />Issued by: {skill.issued_by}</> : ""}
        </div>
      );
    }
  } else if (dataType === 'link' && nodes) {
    const source = nodes.find(n => n.id === (data.source.id !== undefined ? data.source.id : data.source));
    const target = nodes.find(n => n.id === (data.target.id !== undefined ? data.target.id : data.target));
    
    if (source && target) {
      if (target.type === "ens") {
        return (
          <div>
            <strong>ENS Connection</strong><br />
            {source.name} → {target.name}<br />
            Domain ownership
          </div>
        );
      }
      
      return (
        <div>
          <strong>Connection</strong><br />
          {source.name} → {target.name}<br />
          {data.verified ? "Verified" : "Unverified"}
        </div>
      );
    }
  }
  
  return <div>Connection</div>;
};

export default NetworkTooltip;
