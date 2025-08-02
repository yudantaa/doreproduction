import { useState } from 'react';
import { router } from "@inertiajs/react";
import { useToast } from "@/components/hooks/use-toast";

export const useFormState = <T>(initialData: T | null) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<T | null>(initialData);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({...prev, [name]: value}) : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => prev ? ({...prev, [name]: value}) : null);
  };

  const openModal = (data: T) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (
    resourcePath: string,
    id: string,
    data: any,
    hasFileUploads: boolean = false
  ) => {
    const method = hasFileUploads ? 'post' : 'put';
    const submitData = hasFileUploads ? createFormData(data) : data;

    router[method](`${resourcePath}/${id}`, submitData, {
      onSuccess: () => {
        toast({ description: "Data berhasil diubah" });
        closeModal();
      },
      onError: (errors) => {
        console.error("Update failed:", errors);
        toast({
          description: "Gagal mengubah data",
          variant: "destructive"
        });
      }
    });
  };

  return {
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    openModal,
    closeModal,
    handleUpdate
  };
};

export const createFormData = (data: any): FormData => {
  const formData = new FormData();

  // Add all regular fields
  Object.keys(data).forEach(key => {
    if (key !== 'image' && data[key] != null) {
      formData.append(key, data[key].toString());
    }
  });

  // Handle image separately if it exists
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }

  // Add _method for PUT simulation when using POST
  formData.append('_method', 'put');

  return formData;
};
