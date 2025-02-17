import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import ImageInputContainer from "@/components/form/ImageInputContainer";
import {
  fetchProfile,
  updateProfileAction,
  updateProfileImageAction,
} from "@/utils/actions";

const ProfilePage = async () => {
  const profile = await fetchProfile();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-8 capitalize">user profile</h1>
      <div className="border p-8 rounded-md">
        <ImageInputContainer
          image={profile.profileImage}
          name={profile.username}
          action={updateProfileImageAction}
          text="Update Profile Image"
        />

        <FormContainer action={updateProfileAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <FormInput
              name="firstName"
              label="First Name"
              type="text"
              defaultValue={profile.firstName}
            />
            <FormInput
              name="lastName"
              label="Last Name"
              type="text"
              defaultValue={profile.lastName}
            />
            <FormInput
              name="username"
              label="Username"
              type="text"
              defaultValue={profile.username}
            />
          </div>

          <SubmitButton className="mt-7" text="Update Profile" />
        </FormContainer>
      </div>
    </section>
  );
};
export default ProfilePage;
