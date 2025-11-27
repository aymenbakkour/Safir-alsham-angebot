
import React from 'react';
import Input from './Input';

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-5">
      <Input
        id="productSearch"
        placeholder="بحث عن منتج..."
        value={searchTerm}
        onChange={onSearchChange}
        className="text-right"
      />
    </div>
  );
};

export default ProductSearch;
