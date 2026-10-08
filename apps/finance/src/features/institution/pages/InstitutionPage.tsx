import { InstitutionList } from '../components';
import type { TInstitutionType } from '../types';

type InstitutionPageProps = {
  type: TInstitutionType;
};

export default function InstitutionPage({ type }: InstitutionPageProps) {
  return <InstitutionList type={type} />;
}
