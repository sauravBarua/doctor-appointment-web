// The API takes multipart bodies: `data` is JSON text, `image` is the optional file.
export function toFormData(values: object, image?: File | null): FormData {
  const form = new FormData();
  form.append('data', JSON.stringify(values));
  if (image) form.append('image', image);
  return form;
}
