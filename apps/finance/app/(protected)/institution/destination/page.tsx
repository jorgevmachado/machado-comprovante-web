'use client';
import { useEffect } from 'react';

import {
  InstitutionList ,
  useInstitution,
} from '@/app/modules/finance/institution';

export default function InstitutionDestinationRouterPage() {
  const { institutions, getInstitutions, isLoading } = useInstitution();

  useEffect(() => {
    void getInstitutions({institution_type: 'destination'});
  } ,[getInstitutions]);

  return <InstitutionList type="destination" institutions={institutions} isLoading={isLoading} />;
}