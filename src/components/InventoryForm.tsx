'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/InventoryForm.module.css';

const MANUFACTURERS = [
  'Onset Computer Corporation',
  'Campbell Scientific',
  'Texas Electronics',
  'RM Young'
];

const EQUIP_TYPES = [
  'Temperature Probe',
  'Sonic Ranger Sensor',
  'ClimaVUE50',
  'Data Logger',
  'Water Temperature Logger',
  'Net Radiometer'
];

// Site list provided by user
const SITES = [
  '01FW001', '01FW002', '01FW003', '01FW004', '01FW005', '01FW006', '01FW007', '01FW008', '01FW009', '01FW010',
  '01FW011', '01FW012', '01FW013', '01FW014', '01FW015', '01FW016', '01FW017', '01FW018', '01FW019', '01FW020',
  '01FW021', '01FW022', '01FW023', '01FW024', '01FW025', '01FW026', '01FW027', '01FW028', '01MF001', '01MF002',
  '01MF003', '01MF004', '01NE001', '01NE002', '01NE003', '01NE004', '01NE005', '01NE006', '02FE001', '02FE002',
  '02FW001', '02FW002', '02FW003', '02FW005', '02FW006', '02FW007', '02FW008', '02MF001', '02MF002', '02MF003',
  '02MF004', '02MF005', '02MF009', '02NE003', '02NE005', '02SN001', '03FW001', '03FW003', '03NE001', '03NE003',
  '03NE004', '03NE005', '04FW001', '04MF001', '04MF002', '04MF003', '04MF004', '05NE001'
];

export default function InventoryForm() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nextId, setNextId] = useState<string>('Loading...');

  // Form State
  const [formData, setFormData] = useState({
    Equip_code: '',
    Equip_type: '',
    Equip_type_custom: '',
    Equip_serial: '',
    Equip_asset: '',
    Model: '',
    Manufacturer: '',
    Manufacturer_custom: '',
    Condition: 'Condition',
    Deployed: 'No',
  });

  // Fetch the next ID on mount
  useEffect(() => {
    fetch('/api/inventory/latest-id')
      .then(res => res.json())
      .then(data => {
        setNextId(data.nextId);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch ID', err);
        setNextId('Error');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const finalType = formData.Equip_type === 'Other' ? formData.Equip_type_custom : formData.Equip_type;
    const finalManufacturer = formData.Manufacturer === 'Other' ? formData.Manufacturer_custom : formData.Manufacturer;

    const payload = {
      Equip_ID: nextId,
      ...formData,
      Equip_type: finalType,
      Manufacturer: finalManufacturer
    };

    try {
      const res = await fetch('/api/inventory/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to submit');

      alert('Inventory added successfully!');
      // Reset form or redirect
      window.location.reload(); 
    } catch (error) {
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading form data...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Equipment</h2>
      <form onSubmit={handleSubmit}>
        
        {/* ID */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Equip ID</label>
          <input
            className={styles.input}
            type="text"
            value={nextId}
            disabled
            readOnly
          />
        </div>

        {/* Code */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Equip Code</label>
          <input
            className={styles.input}
            name="Equip_code"
            value={formData.Equip_code}
            onChange={handleChange}
            required
            placeholder="e.g. 02FW005"
          />
        </div>

        {/* Type */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Equipment Type</label>
          <select
            className={styles.select}
            name="Equip_type"
            value={formData.Equip_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type...</option>
            {EQUIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="Other">Other (Specify)</option>
          </select>
          {formData.Equip_type === 'Other' && (
            <input
              className={styles.input}
              style={{ marginTop: '10px' }}
              name="Equip_type_custom"
              value={formData.Equip_type_custom}
              onChange={handleChange}
              placeholder="Enter Custom Type"
              required
            />
          )}
        </div>

        {/* Serial */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Serial Number</label>
          <input
            className={styles.input}
            name="Equip_serial"
            value={formData.Equip_serial}
            onChange={handleChange}
            required
            placeholder="Serial # (e.g. 109238)"
          />
        </div>

        {/* Asset */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Asset Tag</label>
          <input
            className={styles.input}
            name="Equip_asset"
            value={formData.Equip_asset}
            onChange={handleChange}
            placeholder="Number or NA"
            required
          />
        </div>

        {/* Model */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Model</label>
          <input
            className={styles.input}
            name="Model"
            value={formData.Model}
            onChange={handleChange}
            placeholder="Model Name"
            required
          />
        </div>

        {/* Manufacturer */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Manufacturer</label>
          <select
            className={styles.select}
            name="Manufacturer"
            value={formData.Manufacturer}
            onChange={handleChange}
            required
          >
            <option value="">Select Manufacturer...</option>
            {MANUFACTURERS.map(m => <option key={m} value={m}>{m}</option>)}
            <option value="Other">Other (Specify)</option>
          </select>
          {formData.Manufacturer === 'Other' && (
            <input
              className={styles.input}
              style={{ marginTop: '10px' }}
              name="Manufacturer_custom"
              value={formData.Manufacturer_custom}
              onChange={handleChange}
              placeholder="Enter Custom Manufacturer"
              required
            />
          )}
        </div>

        {/* Condition */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Condition</label>
          <select
            className={styles.select}
            name="Condition"
            value={formData.Condition}
            onChange={handleChange}
          >
            <option value="Condition">Condition (Good)</option>
            <option value="Decommissioned">Decommissioned</option>
          </select>
        </div>

        {/* Deployed */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Deployed Location</label>
          <select
            className={styles.select}
            name="Deployed"
            value={formData.Deployed}
            onChange={handleChange}
          >
            <option value="No">No (Not Deployed)</option>
            {SITES.map(site => <option key={site} value={site}>{site}</option>)}
          </select>
        </div>

        <button 
            type="submit" 
            className={styles.submitButton}
            disabled={submitting}
        >
            {submitting ? 'Adding...' : 'Add Inventory'}
        </button>
      </form>
    </div>
  );
}
