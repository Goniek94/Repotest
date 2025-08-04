import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Save, X, Check } from 'lucide-react';

const DataCard = ({ 
  icon: Icon, 
  iconColor, 
  label, 
  value, 
  isVerified, 
  isEditable = false,
  editOptions = null,
  onSave = null,
  fieldName = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = () => {
    if (isEditable) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave(fieldName, editValue);
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Main Card Header */}
      <div 
        className={`p-4 flex items-center justify-between ${isEditable ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
        onClick={handleToggle}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center`}>
            <Icon className="text-white text-xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {label}
            </p>
            <p className="text-lg font-medium text-gray-900">
              {value || 'Nie podano'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Verification Badge */}
          {isVerified !== undefined && (
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <Check className="w-3 h-3 mr-1" />
              {isVerified ? 'Zweryfikowane' : 'Niezweryfikowane'}
            </div>
          )}
          
          {/* Expand/Collapse Arrow */}
          {isEditable && (
            <div className="text-gray-400">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isEditable && isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4">
            {!isEditing ? (
              // View Mode
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aktualna wartość:</span>
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edytuj
                  </button>
                </div>
                <div className="text-sm text-gray-900 font-medium bg-white p-3 rounded-lg border">
                  {value || 'Nie podano'}
                </div>
                
                {/* Custom Edit Options */}
                {editOptions && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Dostępne opcje:</p>
                    <div className="space-y-1">
                      {editOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={option.action}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nowa wartość dla: {label}
                  </label>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Wprowadź ${label.toLowerCase()}`}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Zapisywanie...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Zapisz
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Anuluj
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCard;
