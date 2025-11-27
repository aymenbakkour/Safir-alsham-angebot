
import React, { useState, useCallback, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface ProductListProps {
  searchTerm: string;
  onAddProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ searchTerm, onAddProduct }) => {
  const [openCategories, setOpenCategories] = useState<{[key: string]: boolean}>({});

  const toggleCategory = useCallback((category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const filteredAndGroupedProducts = useMemo(() => {
    const grouped: {[category: string]: Product[]} = {};
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    PRODUCTS.forEach(p => {
      if (searchTerm && !p.name.toLowerCase().includes(lowerCaseSearchTerm)) {
        return;
      }
      if (!grouped[p.category]) {
        grouped[p.category] = [];
      }
      grouped[p.category].push(p);
    });
    return grouped;
  }, [searchTerm]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-5">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">المنتجات</h3>
      <div id="productsArea">
        {Object.keys(filteredAndGroupedProducts).length === 0 && (
          <p className="text-gray-500 text-center">لا توجد منتجات مطابقة للبحث.</p>
        )}
        {Object.keys(filteredAndGroupedProducts).map(cat => (
          <div key={cat} className="mb-2 last:mb-0">
            <div
              className="category-header bg-gray-100 p-3 rounded-md cursor-pointer flex justify-between items-center mt-2 font-bold text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              onClick={() => toggleCategory(cat)}
            >
              <span>{cat}</span>
              <span>{openCategories[cat] ? '▲' : '▼'}</span>
            </div>

            {openCategories[cat] && (
              <div className="border border-gray-200 rounded-b-md">
                {filteredAndGroupedProducts[cat].map(p => (
                  <div key={p.id} className="product-row flex justify-between items-center p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <span className="product-name flex-1 text-gray-800">{p.name}</span>
                    <span className="product-price ml-2 text-gray-600">{p.price.toFixed(2)} €</span>
                    <button
                      className="add-btn w-8 h-8 rounded-full bg-blue-500 text-white text-xl flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => onAddProduct(p.id)}
                      aria-label={`أضف ${p.name}`}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
