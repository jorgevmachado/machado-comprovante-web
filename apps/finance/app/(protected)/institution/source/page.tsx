'use client';
import { useEffect } from 'react';

import {
  InstitutionList ,
  useInstitution,
} from '@/app/modules/finance/institution';

export default function InstitutionSourceRouterPage() {
  const { items, fetchList, isLoading } = useInstitution();

  useEffect(() => {
    void fetchList({institution_type: 'source'});
  } ,[fetchList]);

  return <InstitutionList type="source" institutions={items} isLoading={isLoading} />;
}