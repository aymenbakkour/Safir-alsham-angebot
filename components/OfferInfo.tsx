
import React from 'react';
import Input from './Input';
import Button from './Button';

interface OfferInfoProps {
  offerTitle: string;
  onOfferTitleChange: (value: string) => void;
  deliveryCost: number;
  onDeliveryCostChange: (value: number) => void;
  transferCost: number;
  onTransferCostChange: (value: number) => void;
  onGenerateSpecialOffer: () => void;
  onClearPreview: () => void;
}

const OfferInfo: React.FC<OfferInfoProps> = ({
  offerTitle,
  onOfferTitleChange,
  deliveryCost,
  onDeliveryCostChange,
  transferCost,
  onTransferCostChange,
  onGenerateSpecialOffer,
  onClearPreview,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-5">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">معلومات العرض</h3>

      <Input
        id="offerTitle"
        className="mb-4 text-right"
        placeholder="عنوان العرض"
        value={offerTitle}
        onChange={onOfferTitleChange}
      />

      <Input
        id="deliveryCost"
        type="number"
        className="mb-4 text-right"
        placeholder="أدخل تكلفة التوصيل"
        min={0}
        step={0.01}
        value={deliveryCost}
        onChange={onDeliveryCostChange}
      />

      <Input
        id="transferCost"
        type="number"
        className="mb-4 text-right"
        placeholder="أدخل تكلفة التحويل"
        min={0}
        step={0.01}
        value={transferCost}
        onChange={onTransferCostChange}
      />

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button
          onClick={onGenerateSpecialOffer}
          className="bg-indigo-600 text-white hover:bg-indigo-700 flex-1"
        >
          إنشاء العرض الخاص
        </Button>
        <Button
          onClick={onClearPreview}
          className="bg-red-600 text-white hover:bg-red-700 flex-1"
        >
          تفريغ المعاينة
        </Button>
      </div>
    </div>
  );
};

export default OfferInfo;
