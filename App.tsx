
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Product, OfferItem } from './types';
import { PRODUCTS, SPECIAL_OFFER_ITEMS } from './constants';
import ProductSearch from './components/ProductSearch';
import ProductList from './components/ProductList';
import OfferInfo from './components/OfferInfo';
import OfferPreview from './components/OfferPreview';
import Button from './components/Button';

// Declare html2canvas globally since it's loaded via CDN
declare const html2canvas: any;

const App: React.FC = () => {
  const [offerItems, setOfferItems] = useState<OfferItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [offerTitle, setOfferTitle] = useState<string>('عرض خاص');
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  const [transferCost, setTransferCost] = useState<number>(0);
  const [isDownloadMode, setIsDownloadMode] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleAddProduct = useCallback((id: string) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
      setOfferItems(prevItems => [...prevItems, { ...product }]);
    }
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setOfferItems(prevItems => prevItems.filter((_, i) => i !== index));
  }, []);

  const handleGenerateSpecialOffer = useCallback(() => {
    setOfferItems([...SPECIAL_OFFER_ITEMS]);
    setOfferTitle('عرض سفير الشام'); // Set a default title for the special offer
    setDeliveryCost(0);
    setTransferCost(0);
  }, []);

  const handleClearPreview = useCallback(() => {
    setOfferItems([]);
    setOfferTitle('عرض خاص');
    setDeliveryCost(0);
    setTransferCost(0);
  }, []);

  const handleDownloadImage = useCallback(async () => {
    if (offerItems.length === 0) return;

    // Temporarily enable download mode to hide buttons within the preview
    setIsDownloadMode(true);

    // Wait for React to render the component in download mode
    await new Promise(resolve => setTimeout(resolve, 50));

    if (previewRef.current) {
      try {
        const canvas = await html2canvas(previewRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
        });

        const a = document.createElement('a');
        a.download = `${offerTitle || 'offer'}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      } catch (error) {
        console.error("Error generating image:", error);
        alert("فشل تنزيل الصورة. يرجى المحاولة مرة أخرى.");
      } finally {
        // Reset download mode
        setIsDownloadMode(false);
      }
    }
  }, [offerItems.length, offerTitle]);


  // Ensure the download button is enabled only when there are items
  const isDownloadButtonDisabled = offerItems.length === 0;

  useEffect(() => {
    // This effect runs only once on mount to ensure initial setup
    // For `html2canvas`, there's no direct DOM manipulation here,
    // so no `eslint-disable-next-line` is needed for `useEffect` with empty deps.
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl font-['Tahoma']">
      <h2 className="text-center text-3xl font-bold mb-6 text-gray-900">سفير الشام – إنشاء العرض</h2>

      <ProductSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <ProductList searchTerm={searchTerm} onAddProduct={handleAddProduct} />

      <OfferInfo
        offerTitle={offerTitle}
        onOfferTitleChange={setOfferTitle}
        deliveryCost={deliveryCost}
        onDeliveryCostChange={setDeliveryCost}
        transferCost={transferCost}
        onTransferCostChange={setTransferCost}
        onGenerateSpecialOffer={handleGenerateSpecialOffer}
        onClearPreview={handleClearPreview}
      />

      <div className="bg-white p-4 rounded-lg shadow-md mb-5">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">معاينة العرض</h3>
        <OfferPreview
          offerItems={offerItems}
          offerTitle={offerTitle}
          deliveryCost={deliveryCost}
          transferCost={transferCost}
          onRemoveItem={handleRemoveItem}
          previewRef={previewRef}
          isDownloadMode={isDownloadMode}
        />
        <Button
          onClick={handleDownloadImage}
          className="bg-primary text-white hover:bg-blue-700 mt-4"
          disabled={isDownloadButtonDisabled}
        >
          تنزيل العرض كصورة
        </Button>
      </div>
    </div>
  );
};

export default App;
