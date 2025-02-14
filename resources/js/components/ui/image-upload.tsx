import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload } from "lucide-react";
import { toast } from "@/components/hooks/use-toast";

interface ImageUploadProps {
    initialImage?: string | null;
    onImageChange: (file: File | null) => void;
    maxSizeInMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    initialImage = null,
    onImageChange,
    maxSizeInMB = 5, // Default 5MB max file size
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(
        initialImage
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSizeInMB * 1024 * 1024) {
            toast({
                title: "Ukuran Gambar Terlalu Besar",
                description: `Maksimal ukuran gambar adalah ${maxSizeInMB}MB`,
                variant: "destructive",
            });
            return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Tipe Gambar Tidak Didukung",
                description: "Hanya JPEG, PNG, dan WebP yang diizinkan",
                variant: "destructive",
            });
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                onImageChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        onImageChange(null); // Notify parent that the image is removed
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click(); // Trigger the file input dialog
    };

    return (
        <div className="flex items-center space-x-4">
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
            />
            {previewImage ? (
                <div className="relative">
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-md"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 w-6 h-6 rounded-full"
                        onClick={handleRemoveImage}
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    variant="outline"
                    onClick={triggerFileInput}
                    type="button"
                >
                    <Upload className="mr-2 h-4 w-4" /> Upload Gambar
                </Button>
            )}
        </div>
    );
};
