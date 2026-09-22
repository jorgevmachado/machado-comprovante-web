'use client';
import { Button ,FileUpload ,Text ,useUser } from '@machado-repo/ui';
import type { TUser } from '@/app/modules/auth';
import {
  PaymentsCount ,
  PaymentsMax ,
  PaymentsTotal ,
} from '@/app/modules/finance';
import PaymentsList
  from '../../modules/finance/payment/components/payments-list';
import { useCallback ,useState } from 'react';
import { HttpClient } from '@machado-repo/shared';
import {
  EReceiptFieldStatus ,EReceiptProcessingStatus ,ReceiptInfo ,
  TReceiptBatch ,
} from '@/app/modules/finance/receipt';
import ReceiptValidate from '../../modules/finance/receipt/components/validate';

const receiptBatchMock: TReceiptBatch = {
  total: 4,
  items: [
    {
      "id": "34e265aa-857f-405c-b6a5-032d6e465ebf",
      "data": {
        "fine": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "payer": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "barcode": {
          "value": "26091592453880672264120400000004515730000013298",
          "status": EReceiptFieldStatus.FOUND
        },
        "due_date": {
          "value": new Date("2026-09-18"),
          "status": EReceiptFieldStatus.FOUND
        },
        "discount": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "interest": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "paid_amount": {
          "value": 132.98,
          "status": EReceiptFieldStatus.FOUND
        },
        "beneficiary": {
          "value": "NU PAGAMENTOS SA",
          "status": EReceiptFieldStatus.FOUND
        },
        "payment_date": {
          "value": new Date("2026-09-14"),
          "status": EReceiptFieldStatus.FOUND
        },
        "total_charges": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "authentication": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "transaction_id": {
          "value": "6aa81d42-0310-4010-",
          "status": EReceiptFieldStatus.FOUND
        },
        "effective_payer": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "document_amount": {
          "value": 132.98,
          "status": EReceiptFieldStatus.FOUND
        },
        "source_institution": {
          "value": "Nubank",
          "status": EReceiptFieldStatus.FOUND
        },
        "destination_institution": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        }
      },
      "errors": [],
      "file_name": "WhatsApp Image 2026-09-14 at 13.14.20.jpeg",
      "file_type": "image/jpeg",
      "file_size": 62766,
      "error_message": undefined,
      "processing_status": EReceiptProcessingStatus.RECEIVED
    },
    {
      "id": "fef10244-c897-4105-8cc8-f52ced147802",
      "data": {
        "fine": {
          "value": 0.00,
          "status": EReceiptFieldStatus.FOUND
        },
        "payer": {
          "value": "VERA LUCIA VIEIRA MACHADO",
          "status": EReceiptFieldStatus.FOUND
        },
        "barcode": {
          "value": "48190000030043101057861809280144615650000087823",
          "status": EReceiptFieldStatus.FOUND
        },
        "due_date": {
          "value": new Date("2026-09-10"),
          "status": EReceiptFieldStatus.FOUND
        },
        "discount": {
          "value": 83.55,
          "status": EReceiptFieldStatus.FOUND
        },
        "interest": {
          "value": 0.00,
          "status": EReceiptFieldStatus.FOUND
        },
        "paid_amount": {
          "value": 794.68,
          "status": EReceiptFieldStatus.FOUND
        },
        "beneficiary": {
          "value": "CONDOMINIO EDIFICIO R M CARLO",
          "status": EReceiptFieldStatus.FOUND
        },
        "payment_date": {
          "value": new Date("2026-09-05"),
          "status": EReceiptFieldStatus.FOUND
        },
        "total_charges": {
          "value": 0.00,
          "status": EReceiptFieldStatus.FOUND
        },
        "authentication": {
          "value": "A24B374A0D33EAC43376A720AD84B2AA72049D71",
          "status": EReceiptFieldStatus.FOUND
        },
        "transaction_id": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "effective_payer": {
          "value": "JORGE LUIZ VIEIRA DA SILVA FILHO",
          "status": EReceiptFieldStatus.FOUND
        },
        "document_amount": {
          "value": 878.23,
          "status": EReceiptFieldStatus.FOUND
        },
        "source_institution": {
          "value": "Itaú",
          "status": EReceiptFieldStatus.FOUND
        },
        "destination_institution": {
          "value": "SUPERLÓGICA SCD S.A.",
          "status": EReceiptFieldStatus.FOUND
        }
      },
      "errors": [],
      "file_name": "comprovante_outro_banco.pdf",
      "file_type": "application/pdf",
      "file_size": 36160,
      "error_message": undefined,
      "processing_status": EReceiptProcessingStatus.RECEIVED
    },
    {
      "id": "12d7f685-326f-45d2-a3b2-4e8ebfeb5f08",
      "data": {
        "fine": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "payer": {
          "value": "JORGD LUIZ VIEIRA S FILHO",
          "status": EReceiptFieldStatus.FOUND
        },
        "barcode": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "due_date": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "discount": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "interest": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "paid_amount": {
          "value": 4186.17,
          "status": EReceiptFieldStatus.FOUND
        },
        "beneficiary": {
          "value": "ITAU UNIBANCO HOLDING S.A.",
          "status": EReceiptFieldStatus.FOUND
        },
        "payment_date": {
          "value": new Date("2026-09-08"),
          "status": EReceiptFieldStatus.FOUND
        },
        "total_charges": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "authentication": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "transaction_id": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "effective_payer": {
          "value": "JORGD LUIZ VIEIRA S FILHO",
          "status": EReceiptFieldStatus.FOUND
        },
        "document_amount": {
          "value": 4186.17,
          "status": EReceiptFieldStatus.FOUND
        },
        "source_institution": {
          "value": "Itaú",
          "status": EReceiptFieldStatus.FOUND
        },
        "destination_institution": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        }
      },
      "errors": [],
      "file_name": "comprovante.pdf",
      "file_type": "application/pdf",
      "file_size": 37453,
      "error_message": undefined,
      "processing_status": EReceiptProcessingStatus.RECEIVED
    },
    {
      "id": "9def0792-74d5-479c-b74f-00581abe25ae",
      "data": {
        "fine": {
          "value": 0.00,
          "status": EReceiptFieldStatus.FOUND
        },
        "payer": {
          "value": "VERA LUCIA VIEIRA MACHADO",
          "status": EReceiptFieldStatus.FOUND
        },
        "barcode": {
          "value": "00190000090360004100200002433175915650000474175",
          "status": EReceiptFieldStatus.FOUND
        },
        "due_date": {
          "value": new Date("2026-09-10"),
          "status": EReceiptFieldStatus.FOUND
        },
        "discount": {
          "value": 0.00,
          "status": EReceiptFieldStatus.FOUND
        },
        "interest": {
          "value": 0.00,
          "status": EReceiptFieldStatus.FOUND
        },
        "paid_amount": {
          "value": 4741.75,
          "status": EReceiptFieldStatus.FOUND
        },
        "beneficiary": {
          "value": "AS R ASSOCIACAO S. RADIOBRAS",
          "status": EReceiptFieldStatus.FOUND
        },
        "payment_date": {
          "value": new Date("2026-09-03"),
          "status": EReceiptFieldStatus.FOUND
        },
        "total_charges": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "authentication": {
          "value": undefined,
          "status": EReceiptFieldStatus.NOT_FOUND
        },
        "transaction_id": {
          "value": "71207347056",
          "status": EReceiptFieldStatus.FOUND
        },
        "effective_payer": {
          "value": "VERA LUCIA V MACHADO",
          "status": EReceiptFieldStatus.FOUND
        },
        "document_amount": {
          "value": 4741.75,
          "status": EReceiptFieldStatus.FOUND
        },
        "source_institution": {
          "value": "Caixa",
          "status": EReceiptFieldStatus.FOUND
        },
        "destination_institution": {
          "value": "BANCO DO BRASIL S/A",
          "status": EReceiptFieldStatus.FOUND
        }
      },
      "errors": [],
      "file_name": "caixa.pdf",
      "file_type": "application/pdf",
      "file_size": 342172,
      "error_message": undefined,
      "processing_status": EReceiptProcessingStatus.PROCESSED
    }
  ],
  failed: 0,
  received: 3,
  processed: 1,
  processing: 0
}
export default function HomeRouterPage() {
  const { user } = useUser<TUser>();
  const [files, setFiles] = useState<Array<File>>([]);
  const [receiptBatch, setReceiptBatch] = useState<TReceiptBatch | undefined>(receiptBatchMock);
  const [refresh, setRefresh] = useState<boolean>(false);

  const bachReceipts  = useCallback(async () => {
    if(!files.length) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await HttpClient.post<TReceiptBatch>({
      path: '/receipt/batch',
      baseUrl: '/api',
      config: { body: formData }
    });
    if(response.isOk){
      setReceiptBatch(response.instance);
      setRefresh(!refresh);
    }
  },[files, refresh]);

  return (
    <main className='min-h-screen px-6 py-10'>
      <div className='mx-auto flex max-w-7xl flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <Text as='h1' className='text-3xl font-bold text-slate-950 sm:text-4xl'>
            Olá, {user?.name} 👋
          </Text>
          <Text className='max-w-2xl text-slate-600'>
            Aqui está o resumo dos seus pagamentos.
          </Text>
        </div>
        <div className="flex flex-row gap-6">
          <PaymentsCount />
          <PaymentsTotal/>
          <PaymentsMax />
        </div>
        <div className="flex flex-col gap-6">
          <FileUpload multiple onFilesChange={(files) => setFiles(files)} />
          <Button onClick={bachReceipts}>Enviar</Button>
        </div>
        <div>
          <ReceiptInfo refresh={refresh} onUpdated={setRefresh} />
        </div>
        {/*<ReceiptValidate receiptBatch={receiptBatch} />*/}

        <div>
          <PaymentsList title="Pagamentos recentes"/>
        </div>
      </div>
    </main>
  );
}