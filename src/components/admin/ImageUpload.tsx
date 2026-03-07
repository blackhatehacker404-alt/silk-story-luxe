import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  bucket?: string;
  folder?: string;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  bucket = "product-images",
  folder = "uploads",
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    for (const file of Array.from(files)) {
      if (newImages.length >= maxImages) break;

      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      newImages.push(urlData.publicUrl);
    }

    onImagesChange(newImages);
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative h-20 w-20 rounded border border-border overflow-hidden group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="h-20 w-20 rounded border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground mt-1">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
