import AmenitiesInput from "@/components/form/AmenitiesInput";
import { SubmitButton } from "@/components/form/Buttons";
import CategoriesInput from "@/components/form/CategoriesInput";
import CounterInput from "@/components/form/CounterInput";
import CountriesInput from "@/components/form/CountriesInput";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import ImageInput from "@/components/form/ImageInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { createPropertyAction } from "@/utils/actions";

const CreatePropertyPage = () => {
  return (
    <section>
      <h1 className="font-bold text-2xl mb-8 capitalize">create property</h1>

      <div className="border rounded p-8">
        <h3 className="font-semibold text-lg mb-4">Property Details</h3>
        <FormContainer action={createPropertyAction}>
          <div className="grid grid-cols-2 gap-8 mb-4">
            {/* Form Inputs for name and tagline */}
            <FormInput
              name="name"
              type="text"
              label="Name (20 chars max)"
              defaultValue="Cabin in India"
            />
            <FormInput
              name="tagline"
              type="text"
              label="Tagline (30 chars max)"
              defaultValue="Your dream getaway awaits you"
            />

            {/* price input */}
            <PriceInput />

            {/* categories input */}
            <CategoriesInput />
          </div>

          {/* description/textarea input */}
          <TextAreaInput
            name="description"
            labelText="Description (10-1000 words)"
          />

          {/* countries and images input */}
          <div className="grid sm:grid-cols-2 gap-8 mt-4">
            <CountriesInput />
            <ImageInput />
          </div>

          {/* counter inputs for accomodation details  */}
          <h3 className="font-semibold text-lg mb-4 mt-8">
            Accomodation Details
          </h3>
          <CounterInput detail="guests" />
          <CounterInput detail="bedrooms" />
          <CounterInput detail="beds" />
          <CounterInput detail="baths" />

          {/* amenities input */}
          <h3 className="font-semibold text-lg mb-6 mt-10">Amenities</h3>
          <AmenitiesInput />

          {/* submit button */}
          <SubmitButton text="Create Rental" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
};
export default CreatePropertyPage;
