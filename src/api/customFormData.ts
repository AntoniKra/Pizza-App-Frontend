const appendValue = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendValue(formData, key, item));
    return;
  }

  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  formData.append(key, String(value));
};

export const customFormData = <Body>(body: Body): FormData => {
  const formData = new FormData();

  Object.entries(body as Record<string, unknown>).forEach(([key, value]) => {
    appendValue(formData, key, value);
  });

  return formData;
};
