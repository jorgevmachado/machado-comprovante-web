'use client';
import { useEffect ,useMemo } from 'react';
import { Filters ,Pagination ,Text ,useModal } from '@machado-repo/ui';

import {
  PaymentForm ,
  PaymentsList ,
  type TPayment ,TPaymentPersist ,
  usePayments ,
} from '@/src/features/payment';

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
    <main className="min-h-full flex-1 bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="min-w-0">
            <Text weight="bold" size="3xl">{'finance.payment.title'}</Text>
            <Text className="mt-1 text-slate-600">{'finance.payment.subtitle'}</Text>
          </div>
        </header>

        <Filters
          filters={[
            { name: 'start_date', label: 'finance.payment.start_date.label', placeholder: 'finance.payment.start_date.placeholder', type: 'date', value: '' },
            { name: 'end_date', label: 'finance.payment.end_date.label', placeholder: 'finance.payment.end_date.placeholder', type: 'date', value: defaultDate() },
            { name: 'payer', label: 'finance.payer.name.label', placeholder: 'finance.payer.name.placeholder', type: 'text', value: '' },
            { name: 'beneficiary', label: 'finance.beneficiary.name.label', placeholder: 'finance.beneficiary.name.placeholder', type: 'text', value: '' },
            { name: 'source_institution', label: 'finance.payment.source_institution.label', placeholder: 'finance.payment.source_institution.placeholder', type: 'text', value: '' },
            { name: 'destination_institution', label: 'finance.payment.destination_institution.label', placeholder: 'finance.payment.destination_institution.placeholder', type: 'text', value: '' },
          ]}
          onApply={(nextFilters) => getPayments(nextFilters)}
        />

        <section aria-live="polite" className="min-w-0">
          <PaymentsList
            resumed={false}
            onEdit={handleOpenFormModal}
            payments={payments}
            isLoading={isLoading}
          />

          {meta && (
            <div className="mt-5 sm:mt-6">
              <Pagination
                isLoading={isLoading}
                totalPages={meta.total_pages}
                currentPage={meta.current_page}
                onPageChange={(page) => goToPage(page)}
              />
            </div>
          )}
        </section>
        {modal}
      </div>
    </main>
  )
}