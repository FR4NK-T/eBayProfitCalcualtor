import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, ChevronDown, ChevronUp, DollarSign, HelpCircle, LineChart, Moon, Pencil, Percent, PiggyBank, Sun, TrendingUp, Truck } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 
      group-hover:opacity-100 transition-opacity duration-200 z-50">
      <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent 
          border-t-gray-900"></div>
      </div>
    </div>
  </div>
);

interface CalculationResult {
  netProfit: number;
  profitMargin: number;
  roi: number;
  totalFees: number;
  fvf: number;
  fixedFee: number;
  adFeeAmount: number;
  totalCost: number;
}

function App() {
  const [listingPrice, setListingPrice] = useState<string>('');
  const [costPrice, setCostPrice] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [shippingCharged, setShippingCharged] = useState<string>('');
  const [adFeePercent, setAdFeePercent] = useState<string>('');
  const [fvfRate, setFvfRate] = useState<string>('13.25');
  const [editingFvf, setEditingFvf] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [calculations, setCalculations] = useState<CalculationResult>({
    netProfit: 0,
    profitMargin: 0,
    roi: 0,
    totalFees: 0,
    fvf: 0,
    fixedFee: 0,
    adFeeAmount: 0,
    totalCost: 0
  });

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    chrome.storage?.sync?.get(['adFeePercent'], (result) => {
      if (result.adFeePercent) {
        setAdFeePercent(result.adFeePercent);
      }
    });
  }, []);

  useEffect(() => {
    if (adFeePercent) {
      chrome.storage?.sync?.set({ adFeePercent });
    }
  }, [adFeePercent]);

  useEffect(() => {
    calculateProfit();
  }, [listingPrice, costPrice, adFeePercent, shippingCost, shippingCharged, fvfRate]);

  const calculateProfit = () => {
    const price = parseFloat(listingPrice) || 0;
    const cost = parseFloat(costPrice) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const charged = parseFloat(shippingCharged) || 0;
    const adFee = parseFloat(adFeePercent) || 0;
    const fvfRateDecimal = parseFloat(fvfRate) / 100;

    const fixedFee = price <= 10 ? 0.30 : 0.40;
    const fvf = (price + charged) * fvfRateDecimal;
    const adFeeAmount = (price + charged) * (adFee / 100);
    const totalFees = fvf + fixedFee + adFeeAmount;
    const totalCost = cost + shipping + totalFees;
    
    const netProfit = price + charged - totalFees - shipping - cost;
    const profitMargin = (price + charged) > 0 ? (netProfit / (price + charged)) * 100 : 0;
    const roi = cost > 0 ? (netProfit / cost) * 100 : 0;

    setCalculations({
      netProfit,
      profitMargin,
      roi,
      totalFees,
      fvf,
      fixedFee,
      adFeeAmount,
      totalCost
    });
  };

  return (
    <div className={`w-[400px] ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} transition-all duration-200 shadow-lg`}>
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} p-3 border-b flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <Calculator className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </div>
          <h1 className="text-sm font-semibold">eBay Profit Calculator</h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-150`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-4 space-y-3">
        <table className="w-full text-sm">
          <tbody>
            {[
              { 
                label: 'Cost Price',
                value: costPrice,
                setter: setCostPrice,
                icon: <DollarSign className="w-3 h-3" />,
                tooltip: 'Your purchase cost for the item'
              },
              { 
                label: 'Sale Price',
                value: listingPrice,
                setter: setListingPrice,
                icon: <DollarSign className="w-3 h-3" />,
                tooltip: 'The price you\'re listing the item for'
              },
              { 
                label: 'Shipping Charged',
                value: shippingCharged,
                setter: setShippingCharged,
                icon: <Truck className="w-3 h-3" />,
                tooltip: 'What you charged for shipping'
              },
              { 
                label: 'Est. Shipping Cost',
                value: shippingCost,
                setter: setShippingCost,
                icon: <Truck className="w-3 h-3" />,
                tooltip: 'Your cost to ship the item'
              },
              { 
                label: 'Ad / Promoted Listing Fee',
                value: adFeePercent,
                setter: setAdFeePercent,
                icon: <Percent className="w-3 h-3" />,
                tooltip: 'Optional: Percentage fee for promoted listings'
              }
            ].map((item) => (
              <tr
                key={item.label}
                onMouseEnter={() => setHoveredRow(item.label)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'} 
                  ${hoveredRow === item.label ? (darkMode ? 'bg-gray-800/50' : 'bg-gray-50') : ''}
                  transition-colors duration-150`}
              >
                <td className={`py-2 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1">
                    {item.icon}
                    {item.label}
                    <Tooltip content={item.tooltip}>
                      <HelpCircle className="w-3 h-3 opacity-50" />
                    </Tooltip>
                  </div>
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                    className={`w-full border-0 p-0 text-right focus:ring-0 bg-transparent
                      transition-colors duration-150`}
                    placeholder="0.00"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="space-y-2 pt-2">
          <div className={`space-y-2 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} pt-2`}>
            <button 
              onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              className={`w-full flex items-center justify-between font-medium py-1 
                ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} 
                rounded transition-colors duration-150`}
            >
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Cost</span>
              <div className="flex items-center gap-2">
              <span>${calculations.totalCost.toFixed(2)}</span>
                {showCostBreakdown ? 
                  <ChevronUp className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} /> : 
                  <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                }
              </div>
            </button>
            
            {showCostBreakdown && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-sm">
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Item Cost</div>
                  <span>${parseFloat(costPrice || '0').toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping Cost</div>
                  <span>${parseFloat(shippingCost || '0').toFixed(2)}</span>
                </div>
                
                <div className={`pt-1.5 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1 text-xs">
                    <span>eBay Fees</span>
                    {!editingFvf && (
                      <span className="opacity-75">
                        (FVF: {fvfRate}%)
                      </span>
                    )}
                    {editingFvf ? (
                      <input
                        type="number"
                        value={fvfRate}
                        onChange={(e) => setFvfRate(e.target.value)}
                        onBlur={() => setEditingFvf(false)}
                        className="w-12 text-xs border-0 p-0 bg-transparent text-right focus:ring-0"
                        autoFocus
                        placeholder="13.25"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingFvf(true)}
                        className={`p-0.5 opacity-50 hover:opacity-100 transition-opacity duration-150`}
                      >
                        <Pencil className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="pl-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <div>Final Value Fee</div>
                      <span>${calculations.fvf.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>Fixed Fee</div>
                      <span>${calculations.fixedFee.toFixed(2)}</span>
                    </div>
                    {adFeePercent && (
                      <div className="flex justify-between text-sm">
                        <div>Ad Fee ({adFeePercent}%)</div>
                        <span>${calculations.adFeeAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} pt-3 mt-2 space-y-2`}>
            {[
              { 
                label: 'Net Profit', 
                value: calculations.netProfit,
                tooltip: 'Total profit after all fees and costs',
                className: calculations.netProfit >= 0 ? 
                  (darkMode ? 'text-green-400' : 'text-green-600') : 
                  (darkMode ? 'text-red-400' : 'text-red-600'),
                prefix: '$',
                icon: <PiggyBank className="w-4 h-4" />
              },
              { 
                label: 'ROI', 
                value: calculations.roi,
                tooltip: 'Return on Investment: Profit as a percentage of cost',
                className: calculations.roi >= 0 ? 
                  (darkMode ? 'text-indigo-400' : 'text-indigo-600') : 
                  (darkMode ? 'text-red-400' : 'text-red-600'),
                prefix: '',
                suffix: '%',
                icon: <TrendingUp className="w-4 h-4" />
              },
              { 
                label: 'Profit Margin', 
                value: calculations.profitMargin,
                tooltip: 'Profit as a percentage of sale price',
                className: calculations.profitMargin >= 0 ? 
                  (darkMode ? 'text-indigo-400' : 'text-indigo-600') : 
                  (darkMode ? 'text-red-400' : 'text-red-600'),
                prefix: '',
                suffix: '%',
                icon: <LineChart className="w-4 h-4" />
              }
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center group">
                <div className="flex items-center gap-1">
                  {item.icon && (
                    <div className={item.className}>
                      {item.icon}
                    </div>
                  )}
                  <span className={`font-medium text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.label}</span>
                  <Tooltip content={item.tooltip}>
                    <HelpCircle className="w-3 h-3 opacity-50" />
                  </Tooltip>
                </div>
                <span className={`font-bold text-base ${item.className} transition-all duration-150 
                  group-hover:scale-105 transform`}>
                  {item.prefix}{item.value.toFixed(2)}{item.suffix}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;