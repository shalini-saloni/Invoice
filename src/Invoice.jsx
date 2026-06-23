import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Plus, Trash2, Printer } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { numberToWordsINR, formatCurrency } from './utils';
import './index.css';

const initialItems = [
  { id: uuidv4(), hsn: '85411000', desc: '75G60HD', subdesc: 'IGBT — Insulated Gate Bipolar Transistor | Power Switching Device', qty: '30 Pcs', unit: 170, lead: 'Ready Stock' },
  { id: uuidv4(), hsn: '85411000', desc: '59N30', subdesc: 'N-Channel Power MOSFET | High Voltage Switching Device', qty: '30 Pcs', unit: 165, lead: 'Ready Stock' },
  { id: uuidv4(), hsn: '9965 00 00', desc: 'Courier / Shipping Charges', subdesc: '', qty: '1', unit: 240, lead: '—' },
];

export default function Invoice() {
  const componentRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Proforma_Invoice',
  });

  const [items, setItems] = useState(initialItems);
  const [taxRate, setTaxRate] = useState(18);
  const [taxName, setTaxName] = useState('IGST');
  
  const [invoiceMeta, setInvoiceMeta] = useState({
    piNumber: 'MT / PI / 2026 / 01',
    date: '20/05/2026',
    validTill: '27/05/2026',
    deliveryTime: '3–5 Working Days',
    placeOfSupply: 'Gujarat (24)',
    supplyType: 'Inter-State (IGST)',
    currency: 'INR (Indian Rupees)'
  });

  const [billTo, setBillTo] = useState({
    name: 'Urvisha Power System',
    address: 'Akashdeep Society, Street No. 5,\nNear Umiya Chowk, 150 Feet Ring Road,\nRajkot, Gujarat\n\nGSTIN: 24AETPV4726P1ZH\nState: Gujarat | Code: 24\n\nContact: Dilip Bhai\nMobile: +91 9375556057'
  });

  const [companyDetails, setCompanyDetails] = useState({
    name: 'MIRAI TECHNOLOGIES',
    tagline: 'Empowering Electronics Worldwide',
    address: '401, Aditya Residency, Chunam Lane,\nLamington Road, Mumbai 400 007\nTel: +91 9321398188 | +91 9820122744 | +91 9136810360\nEmail: sales@miraitechnologies.net | Web: www.miraitechnologies.net\nGSTIN: 27DEHPB4168C1ZR | State: Maharashtra'
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: 'ICICI Bank',
    branch: 'Opera House, Mumbai',
    accountName: 'Mirai Technologies',
    accountNo: '034805007802',
    ifsc: 'ICIC0000348',
    gstin: '27DEHPB4168C1ZR'
  });

  const [terms, setTerms] = useState(
    "100% Advance payment required.\nPrices valid for 7 days from PI date.\nDelivery 3–5 working days after payment.\nGoods once sold will not be taken back.\nSubject to Mumbai jurisdiction.\nE. & O.E."
  );

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => {
      const qtyNum = parseFloat(item.qty) || 0;
      return acc + (qtyNum * Number(item.unit));
    }, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = Math.round(subtotal + taxAmount);
    return { subtotal, taxAmount, grandTotal };
  };

  const { subtotal, taxAmount, grandTotal } = calculateTotals();

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: uuidv4(), hsn: '', desc: '', subdesc: '', qty: '1', unit: 0, lead: '' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleMetaChange = (field, value) => {
    setInvoiceMeta({ ...invoiceMeta, [field]: value });
  };

  const [logo, setLogo] = useState('/logo.png');
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="app-container">
      <button className="btn no-print" onClick={handlePrint}>
        <Printer size={18} /> Download PDF / Print
      </button>
      
      <div className="invoice-wrapper" ref={componentRef}>
        
        {/* ===== HEADER ===== */}
        <div className="invoice-header">
          <div className="company-info">
            <label className="logo-container">
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              {logo ? <img src={logo} alt="Logo" /> : <div className="logo-placeholder">Click to upload logo</div>}
            </label>
            <div className="company-details">
              <input 
                className="editable company-name-input" 
                value={companyDetails.name} 
                onChange={(e) => setCompanyDetails({...companyDetails, name: e.target.value})} 
              />
              <input 
                className="editable company-tagline-input" 
                value={companyDetails.tagline} 
                onChange={(e) => setCompanyDetails({...companyDetails, tagline: e.target.value})} 
              />
              <textarea 
                className="editable editable-textarea company-address-input" 
                value={companyDetails.address} 
                onChange={(e) => setCompanyDetails({...companyDetails, address: e.target.value})}
                rows={5}
              />
            </div>
          </div>
          
          <div className="invoice-title-block">
            <h2>PROFORMA<br/>INVOICE</h2>
            <p>ISO 9001:2015</p>
          </div>
        </div>

        {/* ===== BILL TO + INVOICE DETAILS ===== */}
        <div className="meta-section">
          <div className="bill-to">
            <div className="section-header">BILL TO / SHIP TO</div>
            <div className="bill-to-content">
              <input 
                className="editable bill-to-name-input" 
                value={billTo.name} 
                onChange={(e) => setBillTo({...billTo, name: e.target.value})} 
              />
              <textarea 
                className="editable editable-textarea bill-to-address-input" 
                value={billTo.address} 
                onChange={(e) => setBillTo({...billTo, address: e.target.value})}
                rows={10}
              />
            </div>
          </div>
          
          <div className="invoice-details">
            <div className="section-header">INVOICE DETAILS</div>
            <div className="details-grid">
              <div className="label">PI Number</div>
              <input className="editable" value={invoiceMeta.piNumber} onChange={(e) => handleMetaChange('piNumber', e.target.value)} />
              
              <div className="label">Date</div>
              <input className="editable" value={invoiceMeta.date} onChange={(e) => handleMetaChange('date', e.target.value)} />
              
              <div className="label">Valid Till</div>
              <input className="editable" value={invoiceMeta.validTill} onChange={(e) => handleMetaChange('validTill', e.target.value)} />
              
              <div className="label">Delivery Time</div>
              <input className="editable" value={invoiceMeta.deliveryTime} onChange={(e) => handleMetaChange('deliveryTime', e.target.value)} />
              
              <div className="label">Place of Supply</div>
              <input className="editable" value={invoiceMeta.placeOfSupply} onChange={(e) => handleMetaChange('placeOfSupply', e.target.value)} />
              
              <div className="label">Supply Type</div>
              <input className="editable" value={invoiceMeta.supplyType} onChange={(e) => handleMetaChange('supplyType', e.target.value)} />
              
              <div className="label">Currency</div>
              <input className="editable" value={invoiceMeta.currency} onChange={(e) => handleMetaChange('currency', e.target.value)} />
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th style={{width: '4%'}}>#</th>
              <th style={{width: '12%'}}>HSN Code</th>
              <th style={{width: '38%'}}>Description</th>
              <th style={{width: '9%'}}>Qty</th>
              <th style={{width: '9%'}}>Unit (₹)</th>
              <th style={{width: '12%'}}>Lead Time</th>
              <th style={{width: '16%'}}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="item-row">
                <td className="row-actions-td text-center">
                  <div className="row-actions no-print hover-visible">
                    <button className="btn-icon" onClick={() => removeItem(item.id)} title="Remove Row"><Trash2 size={14} /></button>
                  </div>
                  {index + 1}
                </td>
                <td className="text-center">
                  <input className="editable" style={{textAlign: 'center'}} value={item.hsn} onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)} />
                </td>
                <td>
                  <input className="editable item-desc" value={item.desc} onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} placeholder="Item Name" />
                  {(item.subdesc || item.subdesc === '') && (
                    <textarea className="editable editable-textarea item-subdesc" value={item.subdesc} onChange={(e) => handleItemChange(item.id, 'subdesc', e.target.value)} rows={item.subdesc ? 2 : 1} />
                  )}
                </td>
                <td className="text-center">
                  <input className="editable" style={{textAlign: 'center'}} value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} />
                </td>
                <td className="text-center">
                  <input type="number" className="editable" style={{textAlign: 'center'}} value={item.unit} onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)} />
                </td>
                <td className="text-center">
                  <input className="editable" style={{textAlign: 'center'}} value={item.lead} onChange={(e) => handleItemChange(item.id, 'lead', e.target.value)} />
                </td>
                <td className="text-right" style={{fontWeight: 'bold'}}>
                  {formatCurrency((parseFloat(item.qty) || 0) * Number(item.unit))}
                </td>
              </tr>
            ))}
            <tr className="no-print">
              <td colSpan={7} style={{border: 'none', padding: '8px 0'}}>
                <button className="btn" onClick={addItem} style={{fontSize: '0.75rem', padding: '6px 14px'}}><Plus size={14} /> Add Row</button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ===== TOTALS ===== */}
        <div className="totals-section">
          <table className="totals-table">
            <tbody>
              <tr>
                <td className="label">Taxable Value</td>
                <td className="value">₹{formatCurrency(subtotal)}</td>
              </tr>
              <tr>
                <td className="label">{taxName} @ {taxRate}%</td>
                <td className="value">₹{formatCurrency(taxAmount)}</td>
              </tr>
              <tr>
                <td className="label">Total GST ({taxRate}%)</td>
                <td className="value">₹{formatCurrency(taxAmount)}</td>
              </tr>
              <tr className="grand-total">
                <td className="label">GRAND TOTAL</td>
                <td className="amount-cell">₹{formatCurrency(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===== AMOUNT IN WORDS ===== */}
        <div className="amount-words">
          Amount in Words: <span>{numberToWordsINR(grandTotal)}</span>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="footer-grid">
          <div className="footer-section bank-details-container">
            <div className="section-header-blue">BANK DETAILS</div>
            <div className="bank-details-content">
              <div className="bd-row"><span className="bd-label">Bank Name:</span> <span className="bd-value">{bankDetails.bankName}</span></div>
              <div className="bd-row"><span className="bd-label">Branch:</span> <span className="bd-value">{bankDetails.branch}</span></div>
              <div className="bd-row"><span className="bd-label">Account Name:</span> <span className="bd-value">{bankDetails.accountName}</span></div>
              <div className="bd-row"><span className="bd-label">Account No.:</span> <span className="bd-value">{bankDetails.accountNo}</span></div>
              <div className="bd-row"><span className="bd-label">IFSC Code:</span> <span className="bd-value">{bankDetails.ifsc}</span></div>
              <div className="bd-row"><span className="bd-label">GSTIN:</span> <span className="bd-value">{bankDetails.gstin}</span></div>
            </div>
          </div>
          
          <div className="footer-section">
            <div className="section-header-text">TERMS & CONDITIONS</div>
            <ul className="terms-list">
              {terms.split('\n').map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section signature-block">
            <div className="signature-company">For Mirai Technologies</div>
            <div className="signature-bottom">
              <div className="signature-line">Authorised Signatory</div>
              <div className="computer-gen">This is a computer-generated document.</div>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM STRIP ===== */}
        <div className="bottom-strip">
          <h3>We appreciate your trust in Mirai Technologies — Thank You</h3>
          <p>sales@miraitechnologies.net | www.miraitechnologies.net</p>
        </div>
        
      </div>
    </div>
  );
}
