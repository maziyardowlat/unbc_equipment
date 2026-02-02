'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/InventoryForm.module.css';

const MANUFACTURERS = [
  'Apogee',
  'Brady',
  'Campbell Scientific',
  'Genesis',
  'Goodrich',
  'GoPro',
  'Hyquest Solutions',
  'Iron Wolf',
  'Kipp & Zonen',
  'MaxRad',
  'Metek',
  'MK Powered',
  'Odyssey',
  'Onset Computer Corporation',
  'OTT-Hydromet',
  'PBS',
  'Pond Engineering',
  'Purple Air',
  'RM Young',
  'Samsung',
  'Seagate',
  'Sierra Wireless',
  'SonTek',
  'StarTech',
  'Texas Electronics',
  'Unknown',
  'Vaisala',
  'Western Digital',
  'Yuasa'
];

const EQUIP_TYPES = [
  '12V Battery',
  'Air Quality Sensory',
  'Anemometer',
  'Barometric Pressure Sensor',
  'Battery',
  'Cell Modem',
  'Charge Regulator',
  'ClimaVUE50',
  'Compact Digital Weather Sensor',
  'Data Logger',
  'Discharge Meter',
  'Disdrometer',
  'Dock for Hard Drive',
  'Frost Soil Probe',
  'Galaxy Tablet',
  'Geonor',
  'GoPro Camera',
  'Hard Drive',
  'HOBO Micrologger',
  'Hotplate Total Precipitation Gauge',
  'Ice Detector',
  'Label Maker',
  'Net Radiometer',
  'Pyranometer',
  'Radar Dish',
  'RADAR control/processing device',
  'Soil Moisture Probe',
  'Sonic Ranger Sensor',
  'Temperature Probe',
  'Temperature/RH Sensor',
  'Tipping Bucket Data Logger',
  'Tipping Bucket Rain Gauge',
  'Ultrasonic Distance Sensor',
  'Water level logger',
  'Water Temperature Logger',
  'Yagi/omni antennae'
];

// Site list grouped by type
const SITE_LOCATIONS = {
  WT: [
    { code: '01FW001', name: 'Kuzkwa River Below Tezzeron Lake' },
    { code: '01FW002', name: 'Endako River Above Stellako River' },
    { code: '01FW003', name: 'Cheslatta Lake Above Sather Creek' },
    { code: '01FW004', name: 'Stellako River Above Fraser Lake' },
    { code: '01FW005', name: 'Nechako At Miworth' },
    { code: '01FW006', name: 'Glacier Creek Above Nadina Lake' },
    { code: '01FW007', name: 'Otter Creek Below Finger Lake' },
    { code: '01FW008', name: 'Cheslatta River Below Murray Lake' },
    { code: '01FW009', name: 'Nadina Lake' },
    { code: '01FW010', name: 'Skins Lake Spillway' },
    { code: '01FW011', name: 'Tachie River Above Stuart Lake' },
    { code: '01FW012', name: 'Nadina River Below Nadina Lake' },
    { code: '01FW013', name: 'Nechako River Off Dellwood Road' },
    { code: '01FW014', name: 'Nadina River Above Nadina Lake' },
    { code: '01FW015', name: 'Stuart River Above Nechako River' },
    { code: '01FW016', name: 'Necoslie River Above Stuart Lake' },
    { code: '01FW017', name: 'Nechako Above Cluculz Creek' },
    { code: '01FW018', name: 'Chilako River Below Tatuk Lake' },
    { code: '01FW019', name: 'Middle River Above Trembleur Lake' },
    { code: '01FW020', name: 'Tsilcoh River Above Pinchi Lake' },
    { code: '01FW021', name: 'Pinchi Creek Above Stuart Lake' },
    { code: '01FW022', name: 'Chilako River Above Nechako River' },
    { code: '01FW023', name: 'Kazchek Creek Above Middle River' },
    { code: '01FW024', name: 'McMillan Creek Above Nechako River' },
    { code: '01FW025', name: 'Nechako At Pulpmill Road' },
    { code: '01FW026', name: 'BlackWater' },
    { code: '01FW027', name: 'Ormond Creek' },
    { code: '01FW028', name: 'Nithi River' },
    { code: '01MF001', name: 'Horsefly River Downstream' },
    { code: '01MF002', name: 'Horsefly River Upstream' },
    { code: '01MF003', name: 'McKinley Creek Upstream' },
    { code: '01MF004', name: 'McKinley Creek Downstream' },
    { code: '01NE001', name: 'Kasalka Creek Above Tahtsa Lake' },
    { code: '01NE002', name: 'Whitesail Middle Creek Above Tahtsa Reach' },
    { code: '01NE003', name: 'Whiting Creek' },
    { code: '01NE004', name: 'Rhine Creek Above Sweeney Creek' },
    { code: '01NE005', name: 'Laventie Creek Above Tahtsa Lake' },
    { code: '01NE006', name: 'Chedakuz Creek Above Nechako Reservoir' }
  ],
  WX: [
    { code: '02FE001', name: 'Aleza Lake' },
    { code: '02FE002', name: 'Ancient Forest' },
    { code: '02FW001', name: 'Tatuk Lake' },
    { code: '02FW002', name: 'Ness Lake' },
    { code: '02FW003', name: 'Nadina Spawning Channel' },
    { code: '02FW005', name: 'Cheslatta Lake' },
    { code: '02FW006', name: 'Nulki Lake' },
    { code: '02FW007', name: 'Francois Lake' },
    { code: '02FW008', name: 'Isle Pierre' },
    { code: '02MF001', name: 'Dock Point' },
    { code: '02MF002', name: 'Goose Point' },
    { code: '02MF003', name: 'Plato Point' },
    { code: '02MF004', name: 'QRRC' },
    { code: '02MF005', name: 'Browntop Mountain' },
    { code: '02MF009', name: 'Quesnel Lake West Arm' },
    { code: '02NE003', name: 'Mt. Sweeney' },
    { code: '02NE005', name: 'Huckleberry Mines' },
    { code: '02SN001', name: 'Terrace' }
  ],
  TB: [
    { code: '03FW001', name: 'Nadina Spawning Channel' },
    { code: '03FW003', name: 'Cheslatta Lake' },
    { code: '03NE001', name: 'Chedakuz' },
    { code: '03NE003', name: 'Lower Mt. Sweeney' },
    { code: '03NE004', name: 'Mosquito Hill' },
    { code: '03NE005', name: 'Upper Mt. Sweeney' }
  ],
  GB: [
    { code: '04FW001', name: 'Stellako River Above Fraser Lake' },
    { code: '04MF001', name: 'Horsefly River Gravel Downstream' },
    { code: '04MF002', name: 'Horsefly River Gravel Upstream' },
    { code: '04MF003', name: 'McKinley Creek Gravel Upstream' },
    { code: '04MF004', name: 'McKinley Creek Gravel Downstream' }
  ],
  WL: [
    { code: '05NE001', name: 'Rhine Creek Water Level Logger' }
  ]
};

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
            <option value="Condition">Operational (Good)</option>
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
            {Object.entries(SITE_LOCATIONS).map(([type, sites]) => (
              <optgroup key={type} label={type}>
                {sites.map(site => (
                  <option key={site.code} value={site.code}>
                    ({site.name}) {site.code}
                  </option>
                ))}
              </optgroup>
            ))}
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
