// type for the action function
export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>;

// type for the property card props
export type PropertyCardProps = {
  image: string;
  id: string;
  name: string;
  tagline: string;
  country: string;
  price: number;
};
