
import React, { useState, useRef } from 'react';
import { User, Product, ProductStatus } from '../types';
import { dbService } from '../services/dbService';

interface ListProductProps {
  user: User;
  onComplete: () => void;
}

const ListProduct: React.FC<ListProductProps> = ({ user, onComplete }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState<string>('');
  const [duration, setDuration] = useState('24'); // hours
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle local image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (optional, but good for LocalStorage limits)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // This is the Base64 string of the image
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageData) {
      alert("Please upload an image for your product.");
      return;
    }

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      startingPrice: parseFloat(price),
      currentPrice: parseFloat(price),
      imageUrl: imageData, // Now contains the Base64 encoded image
      sellerId: user.id,
      sellerName: user.name,
      status: ProductStatus.PENDING,
      endTime: Date.now() + (parseInt(duration) * 60 * 60 * 1000),
      bids: []
    };

    dbService.saveProduct(newProduct);
    alert('SUCCESS: Your item has been uploaded! It will appear on the Home page once an Admin verifies it.');
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-2">List Your Item</h1>
        <p className="text-slate-500">Upload a photo and details to start your auction.</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl flex flex-col lg:flex-row gap-12">
        {/* Preview & Upload Panel */}
        <div className="lg:w-1/3 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-50 rounded-2xl aspect-square overflow-hidden border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative cursor-pointer hover:border-indigo-400 hover:bg-slate-100 transition-all group"
          >
            {imageData ? (
              <img src={imageData} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <div className="text-center p-8">
                <i className="fas fa-cloud-upload-alt text-4xl text-slate-300 mb-4 group-hover:text-indigo-400 transition-colors"></i>
                <p className="text-sm text-slate-500 font-bold">Click to Upload Image</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase">PNG, JPG up to 2MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-xl">
            <h4 className="text-xs font-black uppercase text-indigo-400 mb-2 tracking-widest">Verification Tip</h4>
            <p className="text-[10px] text-indigo-800 leading-relaxed">
              Items with high-quality photos are approved faster by our admin team. Ensure your product is clearly visible.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <form onSubmit={handleSubmit} className="lg:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Product Title</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vintage Camera 1970s"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Starting Price ($)</label>
              <input 
                required
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Auction Duration</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="72">3 Days</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Description</label>
              <textarea 
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item's condition, features, and history..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              ></textarea>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-1"
          >
            Upload & Submit for Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListProduct;
