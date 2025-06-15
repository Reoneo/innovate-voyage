
export interface EducationalCredential {
  id: string;
  type: string[];
  issuer: {
    name: string;
    did: string;
    logo?: string;
  };
  credentialSubject: {
    degree?: string;
    institution: string;
    completionDate: string;
    grade?: string;
    skills?: string[];
    fieldOfStudy?: string;
  };
  issuanceDate: string;
  expirationDate?: string;
  verified: boolean;
  verificationMethod?: string;
}

export interface EducationSectionProps {
  walletAddress?: string;
}
