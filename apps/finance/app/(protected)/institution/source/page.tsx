'use client';
import { useEffect } from 'react';

import {
  InstitutionList ,
  useInstitution,
} from '@/app/modules/finance/institution';

export default function InstitutionSourceRouterPage() {
  const { institutions, getInstitutions, isLoading } = useInstitution();

  useEffect(() => {
    void getInstitutions({institution_type: 'source'});
  } ,[getInstitutions]);

  return <InstitutionList type="source" institutions={institutions} isLoading={isLoading} />;
}