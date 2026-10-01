'use client';
import { useEffect ,useMemo } from 'react';
import { Filters ,Pagination ,Text ,useModal } from '@machado-repo/ui';

import {
  PaymentForm ,
  PaymentsList ,
  type TPayment ,TPaymentPersist ,
  usePayments ,
} from '@/app/modules/finance';

export default function PaymentRouterPage() {
  const { modal, openModal, closeModal } = useModal();
  const { getPayments, goToPage, meta, payments, isLoading, updatePayment } = usePayments();

  const defaultEndData = useMemo(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    if(!currentDate) {
      return '';
    }
    return currentDate;
  }, []);


  useEffect(() => {
    void getPayments({ page: '1', end_date: new Date(defaultEndData) });
  } ,[defaultEndData, getPayments]);

  const defaultDate = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    if(!currentDate) {
      return '';
    }
    return currentDate;
  };

  const handleUpdatePayment = async (item: TPaymentPersist) => {
    await updatePayment(item);
    await getPayments({ page: '1', end_date: new Date(defaultEndData) });
    closeModal();
  }

  const handleOpenFormModal = (item: TPayment) => {
    openModal({
      title: 'finance.payment.edit.title',
      children: (
        <PaymentForm item={item} onSubmit={handleUpdatePayment} onCancel={closeModal} />
      )
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text weight="bold" size="3xl">{'finance.payment.title'}</Text>
            <Text>{'finance.payment.subtitle'}</Text>
          </div>
        </header>


        <Filters
          filters={[
            { name: 'start_date', label: 'finance.payment.start_date.label', placeholder: 'finance.payment.start_date.placeholder', type: 'date', value: '' },
            { name: 'end_date', label: 'finance.payment.end_date.label', placeholder: 'finance.payment.end_date.placeholder', type: 'date', value: defaultDate() },
            { name: 'beneficiary', label: 'finance.beneficiary.name.label', placeholder: 'finance.beneficiary.name.placeholder', type: 'text', value: '' },
            { name: 'source_institution', label: 'finance.payment.source_institution.label', placeholder: 'finance.payment.source_institution.placeholder', type: 'text', value: '' },
            { name: 'destination_institution', label: 'finance.payment.destination_institution.label', placeholder: 'finance.payment.destination_institution.placeholder', type: 'text', value: '' },
          ]}
          onApply={(nextFilters) => getPayments(nextFilters)}
        />

        <PaymentsList
          resumed={false}
          onEdit={handleOpenFormModal}
          payments={ payments }
          isLoading={ isLoading}
        />
        {modal}
        {meta && (
          <Pagination
            isLoading={isLoading}
            totalPages={meta.total_pages}
            currentPage={meta.current_page}
            onPageChange={(page) => goToPage(page)}
          />
        )}

      </div>
    </main>
  )
}