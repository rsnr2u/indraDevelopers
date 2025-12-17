import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { imageToBase64 } from '../utils/localStorage';

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
}

export function ImageUpload({ value, onChange, multiple = false, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple) {
        const base64Array: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const base64 = await imageToBase64(files[i]);
          base64Array.push(base64);
        }
        onChange([...(Array.isArray(value) ? value : []), ...base64Array]);
      } else {
        const base64 = await imageToBase64(files[0]);
        onChange(base64);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const removeImage = (index?: number) => {
    if (multiple && Array.isArray(value) && index !== undefined) {
      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
    } else {
      onChange(multiple ? [] : '');
    }
  };

  const images = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

  return (
    <div className="space-y-2">
      {label && <label className="block">{label}</label>}
      
      <div className="flex flex-wrap gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img}
              alt={`Upload ${index + 1}`}
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(multiple ? index : undefined)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Upload className="h-6 w-6 text-gray-400" />
          <span className="text-sm text-gray-500">
            {uploading ? 'Uploading...' : 'Upload'}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
