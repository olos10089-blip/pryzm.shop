import React, { useState } from 'react';
import { CommunityPost, Product } from '../types';
import { Heart, Upload, Sparkles, MapPin, Camera, Check, Plus, Tag } from 'lucide-react';

interface CommunityGalleryProps {
  posts: CommunityPost[];
  products: Product[];
  onUploadPost: (newPost: CommunityPost) => void;
  onLikePost: (postId: string) => void;
}

export const CommunityGallery: React.FC<CommunityGalleryProps> = ({
  posts,
  products,
  onUploadPost,
  onLikePost
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [filterSetting, setFilterSetting] = useState<string>('all');
  
  // Upload form state
  const [author, setAuthor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [productReferenced, setProductReferenced] = useState<string>(products[0]?.name || 'Vessel No. IV');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: author.trim(),
      location: location.trim() || 'Global Residence',
      title: title.trim(),
      productReferenced,
      image: imagePreview || '/src/assets/images/community_client_loft_1790949097239.jpg',
      likes: 1,
      date: new Date().toISOString().split('T')[0],
      approved: true, // Auto-approved for immediate delight
      featured: false
    };

    onUploadPost(newPost);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setImagePreview(null);
      setTitle('');
      setAuthor('');
      setLocation('');
    }, 1500);
  };

  const visiblePosts = posts.filter((p) => p.approved);

  return (
    <section id="community" className="py-20 border-t border-neutral-800/80 bg-[#121316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-spec tracking-widest uppercase text-[#c5a880] mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>COMMUNITY ARCHIVES</span>
            </div>
            <h2 className="font-serif-brand text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Client Installations & Living Spaces
            </h2>
            <p className="text-neutral-400 text-sm mt-2 max-w-xl">
              Grounded in diverse architectural landscapes. Explore genuine client living spaces, private penthouses, and reading salons featuring PRYZM hand-cast pieces.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#202228] hover:bg-[#2a2d36] text-neutral-100 text-xs font-semibold uppercase tracking-wider rounded-lg border border-neutral-700 transition-colors self-start md:self-auto"
          >
            <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Submit Space (+300 VIP Pts)</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map((post) => (
            <div
              key={post.id}
              className="group bg-[#16171b] border border-neutral-800 rounded-xl overflow-hidden flex flex-col hover:border-neutral-700 transition-all shadow-lg"
            >
              {/* Photo Showcase */}
              <div className="relative h-64 overflow-hidden bg-neutral-900">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => onLikePost(post.id)}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white border border-white/10 hover:bg-black/90 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
                  <span className="font-mono-spec text-[11px]">{post.likes}</span>
                </button>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-neutral-300 font-mono-spec">
                  <MapPin className="w-3 h-3 text-[#c5a880]" />
                  <span>{post.location}</span>
                </div>
              </div>

              {/* Information */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif-brand text-base font-semibold text-white leading-snug">
                    {post.title}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-1">Patron: {post.author}</div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 font-mono-spec">
                  <span className="text-[#c5a880] truncate max-w-[200px]">{post.productReferenced}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-[#15161a] rounded-xl border border-neutral-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono-spec text-[#c5a880] tracking-widest">
                  PATRON ARCHIVES SUBMISSION
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-white mt-0.5">
                  Showcase Your Architectural Space
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif-brand text-lg text-white font-semibold">
                  Installation Submitted
                </h4>
                <p className="text-xs text-neutral-400">
                  +300 VIP Patron Points added to your foundry balance! Your space is now featured.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitUpload} className="space-y-4">
                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Installation Photo *
                  </label>
                  <div className="border border-dashed border-neutral-700 rounded-lg p-4 text-center hover:border-[#c5a880] transition-colors relative cursor-pointer bg-[#111215]">
                    {imagePreview ? (
                      <div className="relative h-40 w-full">
                        <img
                          src={imagePreview}
                          alt="Upload preview"
                          className="h-full w-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute top-2 right-2 bg-black/70 px-2 py-1 text-[10px] text-white rounded"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-4">
                        <Camera className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                        <span className="text-xs text-neutral-300 font-medium block">
                          Click to select room photograph
                        </span>
                        <span className="text-[10px] text-neutral-500 block mt-1">
                          PNG, JPG up to 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase text-neutral-400 mb-1">
                      Your Name / Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Marc Jacobs / @arch_loft"
                      className="w-full bg-[#18191d] border border-neutral-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#c5a880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-neutral-400 mb-1">
                      City & Setting
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Kyoto, JP · Garden Studio"
                      className="w-full bg-[#18191d] border border-neutral-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-neutral-400 mb-1">
                    Installation Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dusk shadows resting on the brutalist plinth"
                    className="w-full bg-[#18191d] border border-neutral-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-neutral-400 mb-1">
                    Referenced PRYZM Cast Piece
                  </label>
                  <select
                    value={productReferenced}
                    onChange={(e) => setProductReferenced(e.target.value)}
                    className="w-full bg-[#18191d] border border-neutral-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#c5a880]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="Bespoke Studio Commission">Bespoke Studio Commission</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 bg-neutral-800 text-xs text-neutral-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    Publish to Gallery
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
