
import React from 'react';
import { OfferItem } from '../types';

interface OfferPreviewProps {
  offerItems: OfferItem[];
  offerTitle: string;
  deliveryCost: number;
  transferCost: number;
  onRemoveItem: (index: number) => void;
  // Ref for html2canvas
  previewRef: React.RefObject<HTMLDivElement>;
  isDownloadMode?: boolean; // New prop to hide buttons during download
}

const OfferPreview: React.FC<OfferPreviewProps> = ({
  offerItems,
  offerTitle,
  deliveryCost,
  transferCost,
  onRemoveItem,
  previewRef,
  isDownloadMode = false,
}) => {
  const subtotal = offerItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + (deliveryCost || 0) + (transferCost || 0);

  return (
    <div
      ref={previewRef}
      id="preview"
      className="border-2 border-primary bg-white p-4 rounded-xl min-h-[150px] shadow-lg flex flex-col"
    >
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
        سفير الشام – {offerTitle || 'عرض جديد'}
      </h3>

      {offerItems.length === 0 ? (
        <p className="text-gray-500 text-center py-4">لا توجد منتجات.</p>
      ) : (
        <div className="flex-1">
          {offerItems.map((item, i) => (
            <div
              key={`${item.id}-${i}`} // Use item ID + index for a more robust key
              className="preview-item bg-gray-50 p-2 rounded-md flex justify-between items-center mb-2 last:mb-0 shadow-sm"
            >
              <span className="flex-1 text-gray-700">{item.name}</span>
              <span className="text-gray-600 font-medium ml-2">{item.price.toFixed(2)} €</span>
              {!isDownloadMode && (
                <button
                  onClick={() => onRemoveItem(i)}
                  className="ml-3 px-2 py-1 text-sm bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label={`حذف ${item.name}`}
                >
                  حذف
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {(offerItems.length > 0 || (deliveryCost > 0 || transferCost > 0)) && (
        <div className="preview-cost mt-4 pt-4 border-t border-gray-200 flex flex-col items-end gap-2 text-primary font-bold">
          {deliveryCost > 0 && (
            <span>تكلفة التوصيل: {deliveryCost.toFixed(2)} €</span>
          )}
          {transferCost > 0 && (
            <span>تكلفة التحويل: {transferCost.toFixed(2)} €</span>
          )}
          <span className="text-xl text-danger mt-2">
            المجموع النهائي: {total.toFixed(2)} €
          </span>
        </div>
      )}
    </div>
  );
};

export default OfferPreview;
