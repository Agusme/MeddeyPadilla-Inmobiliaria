"use client";

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { createAdminProperty, propertyMutationNotice, updateAdminProperty } from "@/lib/api";
import { createDirectPropertySaver, type PropertyUploadProgress } from "@/lib/propertyDirectUpload";

type PropertyToEdit = { id: string; revision?: string };

export function usePropertySave() {
  const [progress, setProgress] = useState<PropertyUploadProgress>();
  const [saving, setSaving] = useState(false);
  const saveInProgress = useRef(false);
  const direct = useRef<ReturnType<typeof createDirectPropertySaver> | null>(null);

  function persist(data: FormData, files: File[], order: string[], onProgress: (value: PropertyUploadProgress) => void, property?: PropertyToEdit) {
    data.delete("images");
    if (process.env.NEXT_PUBLIC_PROPERTY_IMAGE_UPLOAD !== "direct") {
      files.forEach(file => data.append("images", file));
      data.set("imageOrder", JSON.stringify(order));
      return property ? updateAdminProperty(property.id, data) : createAdminProperty(data);
    }

    const fields: Record<string, string> = Object.create(null);
    data.forEach((value, key) => { if (typeof value === "string") fields[key] = value; });
    if (!direct.current) direct.current = createDirectPropertySaver();
    return direct.current(fields, files, order, { propertyId: property?.id, revision: property?.revision }, onProgress);
  }

  async function save(data: FormData, files: File[], order: string[], property?: PropertyToEdit) {
    if (saveInProgress.current) return false;
    saveInProgress.current = true;
    setSaving(true);

    try {
      void Swal.fire({
        title: "Guardando propiedad...",
        text: "Estamos procesando la información y las fotografías.",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: { loader: "border-t-[#B71C1C]! border-b-[#B71C1C]!" },
      });
      const popup = Swal.getPopup();
      const uploadStatus = document.createElement("p");
      uploadStatus.className = "mt-3 text-sm font-medium";
      uploadStatus.setAttribute("role", "status");
      uploadStatus.hidden = true;
      Swal.getHtmlContainer()?.append(uploadStatus);
      Swal.showLoading();

      try {
        await persist(data, files, order, (value) => {
          setProgress(value);
          if (value.total > 0 && Swal.getPopup() === popup) {
            uploadStatus.hidden = false;
            uploadStatus.textContent = value.uploaded === value.total
              ? `Fotos subidas: ${value.uploaded} de ${value.total}. Guardando la propiedad...`
              : `Subiendo fotos: ${value.uploaded} de ${value.total}`;
          }
        }, property);
      } finally {
        if (popup && Swal.getPopup() === popup) Swal.close();
      }

      await Swal.fire({
        title: property ? "Los cambios se guardaron correctamente" : "La propiedad se guardó correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
      return true;
    } catch (error) {
      await Swal.fire(propertyMutationNotice(error, "save"));
      return false;
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  return { save, saving, progress, clearProgress: () => setProgress(undefined) };
}
