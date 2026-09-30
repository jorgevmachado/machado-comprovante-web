'use client';
import { useEffect } from 'react';

import {
  InstitutionList ,
  useInstitution,
} from '@/app/modules/finance/institution';

export default function InstitutionDestinationRouterPage() {
  const { items, fetchList, isLoading } = useInstitution();

  useEffect(() => {
    void fetchList({institution_type: 'destination'});
  } ,[fetchList]);

  return <InstitutionList type="destination" institutions={items} isLoading={isLoading} />;
}