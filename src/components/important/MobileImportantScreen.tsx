import React, { useState } from 'react';
import { 
  Building, 
  Car, 
  Gem, 
  FileText, 
  Plus, 
  Trash2, 
  X, 
  MapPin, 
  CheckCircle2, 
  Lock,
  Calendar
} from 'lucide-react';
import { VaultState, PropertyItem, VehicleItem, ValuableAsset, DocumentItem } from '../../types';
import { storageService } from '../../services/storage';

interface MobileImportantScreenProps {
  state: VaultState;
  initialSubtab?: string;
}

type ImportantTab = 'properties' | 'vehicles' | 'valuables' | 'documents';

export const MobileImportantScreen: React.FC<MobileImportantScreenProps> = ({
  state,
  initialSubtab = 'properties'
}) => {
  const [subtab, setSubtab] = useState<ImportantTab>(
    (initialSubtab as ImportantTab) || 'properties'
  );

  const [modalType, setModalType] = useState<'NONE' | 'PROPERTY' | 'VEHICLE' | 'VALUABLE' | 'DOCUMENT'>('NONE');

  // Form States - ZERO PREFILLED DATA
  const [propCategory, setPropCategory] = useState<'PROPERTY' | 'HOUSE' | 'LAND'>('HOUSE');
  const [propName, setPropName] = useState('');
  const [propLocation, setPropLocation] = useState('');
  const [propOwnership, setPropOwnership] = useState<'SOLE_OWNER' | 'JOINT_OWNER' | 'INHERITED' | 'MORTGAGED'>('SOLE_OWNER');
  const [propValue, setPropValue] = useState('');
  const [propDetails, setPropDetails] = useState('');

  // Vehicle Form State
  const [vehType, setVehType] = useState<'CAR' | 'TWO_WHEELER' | 'COMMERCIAL' | 'ELECTRIC' | 'OTHER'>('CAR');
  const [vehBrand, setVehBrand] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehRegNo, setVehRegNo] = useState('');
  const [vehInsuranceExp, setVehInsuranceExp] = useState('');

  // Valuable Asset Form State
  const [valName, setValName] = useState('');
  const [valCategory, setValCategory] = useState<'GOLD' | 'JEWELRY' | 'DIAMONDS' | 'PRECIOUS_STONES' | 'SILVER' | 'HEIRLOOM' | 'OTHER'>('GOLD');
  const [valEstimated, setValEstimated] = useState('');
  const [valWeight, setValWeight] = useState('');
  const [valLocation, setValLocation] = useState('');

  // Document Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'HOME_LOAN' | 'PROPERTY' | 'HOUSE' | 'LAND' | 'INSURANCE' | 'VEHICLE' | 'BANK' | 'LOAN' | 'EMI' | 'OTHER'>('PROPERTY');
  const [docNotes, setDocNotes] = useState('');
  const [docHumanVerified, setDocHumanVerified] = useState(true);

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName.trim() || !propLocation.trim()) return;

    const item: PropertyItem = {
      id: `prop-${Date.now()}`,
      category: propCategory,
      name: propName.trim(),
      property_type: propCategory,
      location: propLocation.trim(),
      ownership: propOwnership,
      estimated_value: parseFloat(propValue) || 0,
      notes: propDetails.trim(),
      created_at: new Date().toISOString(),
    };

    storageService.updateState((prev) => ({
      ...prev,
      properties: [item, ...prev.properties],
    }));
    storageService.logAudit('ADD_PROPERTY', state.user?.full_name || 'Owner', `Added ${propCategory}: ${propName}`);

    setPropName('');
    setPropLocation('');
    setPropValue('');
    setPropDetails('');
    setModalType('NONE');
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehBrand.trim() || !vehRegNo.trim()) return;

    const item: VehicleItem = {
      id: `veh-${Date.now()}`,
      vehicle_type: vehType,
      brand: vehBrand.trim(),
      model: vehModel.trim(),
      registration_number: vehRegNo.trim().toUpperCase(),
      insurance_expiry: vehInsuranceExp,
      created_at: new Date().toISOString(),
    };

    storageService.updateState((prev) => ({
      ...prev,
      vehicles: [item, ...prev.vehicles],
    }));
    storageService.logAudit('ADD_VEHICLE', state.user?.full_name || 'Owner', `Added ${vehBrand} ${vehModel}`);

    setVehBrand('');
    setVehModel('');
    setVehRegNo('');
    setVehInsuranceExp('');
    setModalType('NONE');
  };

  const handleSaveValuable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valName.trim()) return;

    const item: ValuableAsset = {
      id: `val-${Date.now()}`,
      name: valName.trim(),
      category: valCategory,
      estimated_value: parseFloat(valEstimated) || 0,
      weight_grams: parseFloat(valWeight) || undefined,
      location_stored: valLocation.trim(),
      created_at: new Date().toISOString(),
    };

    storageService.updateState((prev) => ({
      ...prev,
      valuableAssets: [item, ...prev.valuableAssets],
    }));
    storageService.logAudit('ADD_VALUABLE_ASSET', state.user?.full_name || 'Owner', `Added ${valCategory}: ${valName}`);

    setValName('');
    setValEstimated('');
    setValWeight('');
    setValLocation('');
    setModalType('NONE');
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const item: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      category: docCategory,
      file_type: 'PDF',
      file_size_kb: 450,
      is_ai_extracted: true,
      is_verified_by_user: docHumanVerified,
      extracted_summary: `Verified legal document for ${docCategory}.`,
      notes: docNotes.trim(),
      created_at: new Date().toISOString(),
    };

    storageService.updateState((prev) => ({
      ...prev,
      documents: [item, ...prev.documents],
    }));
    storageService.logAudit('ADD_DOCUMENT', state.user?.full_name || 'Owner', `Stored document: ${docTitle}`);

    setDocTitle('');
    setDocNotes('');
    setModalType('NONE');
  };

  const handleDeleteItem = (category: 'PROP' | 'VEH' | 'VAL' | 'DOC', id: string) => {
    storageService.updateState((prev) => {
      switch (category) {
        case 'PROP':
          return { ...prev, properties: prev.properties.filter(p => p.id !== id) };
        case 'VEH':
          return { ...prev, vehicles: prev.vehicles.filter(v => v.id !== id) };
        case 'VAL':
          return { ...prev, valuableAssets: prev.valuableAssets.filter(v => v.id !== id) };
        case 'DOC':
          return { ...prev, documents: prev.documents.filter(d => d.id !== id) };
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Subtab Switcher */}
      <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-[11px] overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSubtab('properties')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            subtab === 'properties' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Properties ({state.properties.length})
        </button>
        <button
          onClick={() => setSubtab('vehicles')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            subtab === 'vehicles' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Vehicles ({state.vehicles.length})
        </button>
        <button
          onClick={() => setSubtab('valuables')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            subtab === 'valuables' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Valuables ({state.valuableAssets.length})
        </button>
        <button
          onClick={() => setSubtab('documents')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            subtab === 'documents' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Documents ({state.documents.length})
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. PROPERTIES & LAND */}
      {/* ------------------------------------------------------------- */}
      {subtab === 'properties' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Land, House & Properties
            </h3>
            <button
              onClick={() => setModalType('PROPERTY')}
              className="py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Property</span>
            </button>
          </div>

          {state.properties.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-stone-300 text-center">
              <Building className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-800">No properties recorded yet</p>
              <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                Record your residential houses, land parcels, commercial plots, and ownership details.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {state.properties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-stone-900">{prop.name}</h4>
                        <span className="text-[10px] text-stone-500">
                          · {prop.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{prop.location}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                        <span>{prop.ownership.replace('_', ' ')}</span>
                        {prop.estimated_value > 0 && (
                          <span>· Est: ₹{prop.estimated_value.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('PROP', prop.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. VEHICLES */}
      {/* ------------------------------------------------------------- */}
      {subtab === 'vehicles' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Vehicles & Registration Details
            </h3>
            <button
              onClick={() => setModalType('VEHICLE')}
              className="py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {state.vehicles.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-stone-300 text-center">
              <Car className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-800">No vehicles recorded yet</p>
              <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                Record your cars, two-wheelers, license numbers, and insurance dates.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {state.vehicles.map((veh) => (
                <div
                  key={veh.id}
                  className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        {veh.brand} {veh.model}
                      </h4>
                      <p className="text-xs font-semibold font-mono text-stone-800 tracking-wider mt-0.5">
                        {veh.registration_number}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                        <span>{veh.vehicle_type}</span>
                        {veh.insurance_expiry && (
                          <span>· Ins. Expiry: {veh.insurance_expiry}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('VEH', veh.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. VALUABLES */}
      {/* ------------------------------------------------------------- */}
      {subtab === 'valuables' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Valuable Assets & Gold
            </h3>
            <button
              onClick={() => setModalType('VALUABLE')}
              className="py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Valuable</span>
            </button>
          </div>

          {state.valuableAssets.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-stone-300 text-center">
              <Gem className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-800">No valuable assets listed yet</p>
              <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                Record gold jewelry, precious stones, heirloom items, and safe deposit locker locations.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {state.valuableAssets.map((val) => (
                <div
                  key={val.id}
                  className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-800 flex items-center justify-center shrink-0">
                      <Gem className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-stone-900">{val.name}</h4>
                        <span className="text-[10px] text-stone-500">· {val.category}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-600">
                        {val.weight_grams && (
                          <span>{val.weight_grams}g</span>
                        )}
                        {val.estimated_value > 0 && (
                          <span className="font-semibold text-stone-900">
                            · ₹{val.estimated_value.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {val.location_stored && (
                        <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-stone-400" />
                          <span>Locker: {val.location_stored}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('VAL', val.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. DOCUMENTS VAULT */}
      {/* ------------------------------------------------------------- */}
      {subtab === 'documents' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Document Vault
            </h3>
            <button
              onClick={() => setModalType('DOCUMENT')}
              className="py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          {state.documents.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-stone-300 text-center">
              <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-800">No documents saved in vault</p>
              <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                Securely catalog property sale deeds, insurance bonds, loan sanction letters, and wills.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {state.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-stone-900">{doc.title}</h4>
                        <span className="text-[10px] text-stone-500">· {doc.category}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        {doc.notes || doc.extracted_summary}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Verified in Vault</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem('DOC', doc.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD MODAL */}
      {/* ------------------------------------------------------------- */}
      {modalType !== 'NONE' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white border border-stone-200 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                {modalType === 'PROPERTY' && 'Add Property / Land'}
                {modalType === 'VEHICLE' && 'Add Vehicle'}
                {modalType === 'VALUABLE' && 'Add Valuable Asset'}
                {modalType === 'DOCUMENT' && 'Add Document'}
              </h3>
              <button onClick={() => setModalType('NONE')} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalType === 'PROPERTY' && (
              <form onSubmit={handleSaveProperty} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                  >
                    <option value="HOUSE">House / Flat / Villa</option>
                    <option value="LAND">Land / Plot</option>
                    <option value="PROPERTY">Commercial Property</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Property Name / Title</label>
                  <input
                    type="text"
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    placeholder="e.g. Ancestral Home, OMR Apartment"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
                    placeholder="e.g. Anna Nagar, Chennai"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Ownership</label>
                    <select
                      value={propOwnership}
                      onChange={(e) => setPropOwnership(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                    >
                      <option value="SOLE_OWNER">Sole Owner</option>
                      <option value="JOINT_OWNER">Joint Owner</option>
                      <option value="INHERITED">Inherited</option>
                      <option value="MORTGAGED">Mortgaged</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Estimated Value (₹)</label>
                    <input
                      type="number"
                      value={propValue}
                      onChange={(e) => setPropValue(e.target.value)}
                      placeholder="e.g. 7500000"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-mono shadow-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Deed Details / Notes</label>
                  <input
                    type="text"
                    value={propDetails}
                    onChange={(e) => setPropDetails(e.target.value)}
                    placeholder="e.g. Survey #48/2, original in SBI Locker"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs mt-3 shadow-xs"
                >
                  Save Property
                </button>
              </form>
            )}

            {modalType === 'VEHICLE' && (
              <form onSubmit={handleSaveVehicle} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Vehicle Type</label>
                    <select
                      value={vehType}
                      onChange={(e) => setVehType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                    >
                      <option value="CAR">Car</option>
                      <option value="TWO_WHEELER">Two Wheeler</option>
                      <option value="ELECTRIC">Electric</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={vehBrand}
                      onChange={(e) => setVehBrand(e.target.value)}
                      placeholder="e.g. Hyundai, Honda"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={vehModel}
                    onChange={(e) => setVehModel(e.target.value)}
                    placeholder="e.g. Creta SX, Activa"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={vehRegNo}
                      onChange={(e) => setVehRegNo(e.target.value.toUpperCase())}
                      placeholder="e.g. TN 07 CM 9821"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-mono shadow-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Insurance Expiry</label>
                    <input
                      type="date"
                      value={vehInsuranceExp}
                      onChange={(e) => setVehInsuranceExp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs mt-3 shadow-xs"
                >
                  Save Vehicle
                </button>
              </form>
            )}

            {modalType === 'VALUABLE' && (
              <form onSubmit={handleSaveValuable} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={valCategory}
                    onChange={(e) => setValCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                  >
                    <option value="GOLD">Gold Jewelry</option>
                    <option value="DIAMONDS">Diamonds</option>
                    <option value="SILVER">Silver</option>
                    <option value="HEIRLOOM">Heirloom</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={valName}
                    onChange={(e) => setValName(e.target.value)}
                    placeholder="e.g. Wedding Gold Ornaments"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Weight (Grams)</label>
                    <input
                      type="number"
                      value={valWeight}
                      onChange={(e) => setValWeight(e.target.value)}
                      placeholder="e.g. 120"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-mono shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Estimated Value (₹)</label>
                    <input
                      type="number"
                      value={valEstimated}
                      onChange={(e) => setValEstimated(e.target.value)}
                      placeholder="e.g. 720000"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-mono shadow-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Locker / Storage Location</label>
                  <input
                    type="text"
                    value={valLocation}
                    onChange={(e) => setValLocation(e.target.value)}
                    placeholder="e.g. SBI Main Branch Safe Locker #214"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs mt-3 shadow-xs"
                >
                  Save Asset
                </button>
              </form>
            )}

            {modalType === 'DOCUMENT' && (
              <form onSubmit={handleSaveDocument} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                  >
                    <option value="PROPERTY">Property Sale Deed</option>
                    <option value="HOUSE">House Construction Papers</option>
                    <option value="INSURANCE">Insurance Policy Bond</option>
                    <option value="LOAN">Loan Sanction Agreement</option>
                    <option value="VEHICLE">Vehicle RC</option>
                    <option value="OTHER">Will / Other Legal Paper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Document Title</label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Sale Deed of Anna Nagar House"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Storage Location & Notes</label>
                  <input
                    type="text"
                    value={docNotes}
                    onChange={(e) => setDocNotes(e.target.value)}
                    placeholder="e.g. Original stored in safe locker key 4"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs mt-3 shadow-xs"
                >
                  Save Document
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
