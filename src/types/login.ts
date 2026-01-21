export type LoginFormState = {
  error?: string;
};

export type LoginFormAction = (
  prevState: LoginFormState,
  formData: FormData
) => Promise<LoginFormState>;
