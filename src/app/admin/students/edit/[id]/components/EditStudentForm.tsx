"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
} from "@/lib/features/students/studentsApiSlice";
import Card from "@/components/card/index";
import QualificationSelect from "@/components/select/QualificationSelect";
import AccommodationSelect from "./AccomodationSelect";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface Student {
  admissionNumber: string;
  profile: {
    cityAndGuildNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    idNumber: string;
    mobileNumber: string;
    gender: string;
    homeLanguage: string;
    admissionDate: string;
    avatar: string;
    address: Address;
    postalAddress: Address;
  };
  qualification: {
    _id: string;
  }[];
  email: string;
  guardians?: Guardian[];
  currentAccommodation?: string;
}

interface Address {
  street1: string;
  street2: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

interface Guardian {
  firstName: string;
  lastName: string;
  email: string;
  relation: string;
  mobileNumber: string;
}

export default function StudentForm({ id }: { id: string }) {
  const { data: studentData, isSuccess } = useGetStudentByIdQuery(id);
  const [updateStudent, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateStudentMutation();

  const student: Student | undefined = studentData?.entities[id];

  const router = useRouter();

  // Initialize state for form fields
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [admissionNumber, setAdmissionNumber] = useState<string>("");
  const [cityAndGuildNumber, setCityAndGuildNumber] = useState<string>("");
  const [qualification, setQualification] = useState<string>("");
  const [accommodation, setAccommodation] = useState<string>("");
  const [admissionDate, setAdmissionDate] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [homeLanguage, setHomeLanguage] = useState<string>("");
  const [address, setAddress] = useState<Address>({
    street1: "",
    street2: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
  });
  const [postalAddress, setPostalAddress] = useState<Address>({
    street1: "",
    street2: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
  });
  const [useAsPostalAddress, setUseAsPostalAddress] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      firstName: "",
      lastName: "",
      email: "",
      relation: "",
      mobileNumber: "",
    },
  ]);

  // Handle photo change

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      alert("File is too large. Maximum size is 5MB.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  // Handle guardian change
  const handleGuardianChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newGuardians = guardians.map((guardian, i) =>
      i === index ? { ...guardian, [field]: value } : guardian
    );
    setGuardians(newGuardians);
  };

  const addGuardian = () => {
    setGuardians([
      ...guardians,
      {
        firstName: "",
        lastName: "",
        email: "",
        relation: "",
        mobileNumber: "",
      },
    ]);
  };

  const removeGuardian = (index: number) => {
    setGuardians(guardians.filter((_, i) => i !== index));
  };

  // Set form fields with fetched data when available
  useEffect(() => {
    if (isSuccess && student) {
      setAdmissionNumber(student.admissionNumber || "");
      setCityAndGuildNumber(student.profile?.cityAndGuildNumber || "");
      setQualification(
        student.qualification?.length > 0 ? student.qualification[0]._id : ""
      );
      setAccommodation(student.currentAccommodation || "");
      setAdmissionDate(student.profile?.admissionDate || "");
      setFirstName(student.profile?.firstName || "");
      setMiddleName(student.profile?.middleName || "");
      setLastName(student.profile?.lastName || "");
      setDateOfBirth(student.profile?.dateOfBirth || "");
      setIdNumber(student.profile?.idNumber || "");
      setEmail(student.email || "");
      setMobileNumber(student.profile?.mobileNumber || "");
      setGender(student.profile?.gender || "");
      setHomeLanguage(student.profile?.homeLanguage || "");
      setPhotoPreview(student.profile?.avatar || "");
      setAddress(
        student.profile?.address || {
          street1: "",
          street2: "",
          city: "",
          province: "",
          country: "",
          postalCode: "",
        }
      );
      setPostalAddress(
        student.profile?.postalAddress || {
          street1: "",
          street2: "",
          city: "",
          province: "",
          country: "",
          postalCode: "",
        }
      );
      setGuardians(
        student.guardians || [
          {
            firstName: "",
            lastName: "",
            email: "",
            relation: "",
            mobileNumber: "",
          },
        ]
      );
    }
  }, [student, isSuccess]);

  // Redirect on successful update
  useEffect(() => {
    if (isUpdateSuccess) {
      router.push(`/admin/students/${id}`);
    }
  }, [isUpdateSuccess, id, router]);

  const onSaveStudentClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (photo) {
      formData.append("photo", photo);
    }

    formData.append("admissionNumber", admissionNumber);
    formData.append("firstName", firstName);
    formData.append("middleName", middleName);
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("idNumber", idNumber);
    formData.append("mobileNumber", mobileNumber);
    formData.append("email", email);
    formData.append("homeLanguage", homeLanguage);
    formData.append("cityAndGuildNumber", cityAndGuildNumber);
    formData.append("admissionDate", admissionDate);
    formData.append("accommodation", accommodation);
    formData.append("qualification", qualification);

    // Append address
    Object.keys(address).forEach((key) => {
      const typedKey = key as keyof Address;
      formData.append(`address[${key}]`, address[typedKey]);
    });

    Object.keys(postalAddress).forEach((key) => {
      const typedKey = key as keyof Address;
      formData.append(`postalAddress[${key}]`, postalAddress[typedKey]);
    });

    // Append guardian objects
    guardians.forEach((guardian, index) => {
      Object.keys(guardian).forEach((key) => {
        const typedKey = key as keyof Guardian;
        formData.append(`guardians[${index}][${key}]`, guardian[typedKey]);
      });
    });

    console.log(
      "FormData before sending:",
      Object.fromEntries(formData.entries())
    );

    await updateStudent({ id, formData });
  };

  return (
    <Card>
      <form
        className="m-10"
        onSubmit={onSaveStudentClicked}
        encType="multipart/form-data"
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Study Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              All the info regarding study info
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="admissionNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Student Number *
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-600 sm:max-w-md">
                    <input
                      type="text"
                      name="admissionNumber"
                      id="admissionNumber"
                      autoComplete="username"
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Admission Number"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="cityAndGuildNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  City And Guild Registration Number
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-600 sm:max-w-md">
                    <input
                      type="text"
                      name="cityAndGuildNumber"
                      id="cityAndGuildNumber"
                      autoComplete="cityAndGuildNumber"
                      value={cityAndGuildNumber}
                      onChange={(e) => setCityAndGuildNumber(e.target.value)}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="City And Guild Number"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div
                  {...getRootProps()}
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-gray-600">Drop the files here ...</p>
                  ) : (
                    <div className="text-center">
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-600 focus-within:ring-offset-2 hover:text-brand-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            {...getInputProps()}
                          />
                        </label>
                        <span className="pl-1">or drag and drop</span>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {photo && (
                        <p className="mt-2 text-sm text-gray-600">
                          {photo.name}
                        </p>
                      )}
                      {photoPreview && (
                        <div className="mt-2">
                          <Image
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-full mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <QualificationSelect
                  selectedQualification={qualification}
                  setSelectedQualification={setQualification}
                />
              </div>
              <div className="sm:col-span-3">
                <AccommodationSelect
                  selectedAccommodation={accommodation}
                  setSelectedAccommodation={setAccommodation}
                  currentAccommodation={student?.currentAccommodation || null}
                />
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="admissionDate"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Admission Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="admissionDate"
                    id="admissionDate"
                    autoComplete="admissionDate"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              All The students personal Information
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name *
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Middle name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    autoComplete="middleName"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name *
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date of Birth *
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    autoComplete="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="idNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  ID/Passport number *
                </label>
                <div className="mt-2">
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    autoComplete="idNumber"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number *
                </label>
                <div className="mt-2">
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="text"
                    autoComplete="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="homeLanguage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Home Language
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="homeLanguage"
                    id="homeLanguage"
                    autoComplete="homeLanguage"
                    value={homeLanguage}
                    onChange={(e) => setHomeLanguage(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Gender *
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    autoComplete="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Address Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              <button
                type="button"
                onClick={() => setShowAddress(!showAddress)}
                className="flex items-center text-sm font-semibold leading-6 text-gray-900 mt-4"
              >
                {showAddress
                  ? "Hide Student's Address Information"
                  : "Show Student's Address Information"}
                {showAddress ? (
                  <FiChevronUp className="ml-1" />
                ) : (
                  <FiChevronDown className="ml-1" />
                )}
              </button>
            </p>
            {showAddress && (
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address
                  </label>
                  <div className="mt-2 flex flex-col space-y-2">
                    <input
                      type="text"
                      name="addressStreet1"
                      id="addressStreet1"
                      placeholder="Street Address 1"
                      value={address.street1}
                      onChange={(e) =>
                        setAddress({ ...address, street1: e.target.value })
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      name="addressStreet2"
                      id="addressStreet2"
                      placeholder="Street Address 2"
                      value={address.street2}
                      onChange={(e) =>
                        setAddress({ ...address, street2: e.target.value })
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      name="addressCity"
                      id="addressCity"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      name="addressProvince"
                      id="addressProvince"
                      placeholder="Province"
                      value={address.province}
                      onChange={(e) =>
                        setAddress({ ...address, province: e.target.value })
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      name="addressCountry"
                      id="addressCountry"
                      placeholder="Country"
                      value={address.country}
                      onChange={(e) =>
                        setAddress({ ...address, country: e.target.value })
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      name="addressPostalCode"
                      id="addressPostalCode"
                      placeholder="Postal Code"
                      value={address.postalCode}
                      onChange={(e) =>
                        setAddress({ ...address, postalCode: e.target.value })
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                    />
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id="useAsPostalAddress"
                        checked={useAsPostalAddress}
                        onChange={() => {
                          setUseAsPostalAddress(!useAsPostalAddress);
                          if (!useAsPostalAddress) {
                            setPostalAddress(address);
                          }
                        }}
                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="useAsPostalAddress"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Use as Postal Address
                      </label>
                    </div>
                  </div>
                </div>
                {!useAsPostalAddress && (
                  <>
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Postal Address
                      </label>
                      <div className="mt-2 flex flex-col space-y-2">
                        <input
                          type="text"
                          name="postalAddressStreet1"
                          id="postalAddressStreet1"
                          placeholder="Street Address 1"
                          value={postalAddress.street1}
                          onChange={(e) =>
                            setPostalAddress({
                              ...postalAddress,
                              street1: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                        <input
                          type="text"
                          name="postalAddressStreet2"
                          id="postalAddressStreet2"
                          placeholder="Street Address 2"
                          value={postalAddress.street2}
                          onChange={(e) =>
                            setPostalAddress({
                              ...postalAddress,
                              street2: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                        <input
                          type="text"
                          name="postalAddressCity"
                          id="postalAddressCity"
                          placeholder="City"
                          value={postalAddress.city}
                          onChange={(e) =>
                            setPostalAddress({
                              ...postalAddress,
                              city: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                        <input
                          type="text"
                          name="postalAddressProvince"
                          id="postalAddressProvince"
                          placeholder="Province"
                          value={postalAddress.province}
                          onChange={(e) =>
                            setPostalAddress({
                              ...postalAddress,
                              province: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                        <input
                          type="text"
                          name="postalAddressCountry"
                          id="postalAddressCountry"
                          placeholder="Country"
                          value={postalAddress.country}
                          onChange={(e) =>
                            setPostalAddress({
                              ...postalAddress,
                              country: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                        <input
                          type="text"
                          name="postalAddressPostalCode"
                          id="postalAddressPostalCode"
                          placeholder="Postal Code"
                          value={postalAddress.postalCode}
                          onChange={(e) =>
                            setPostalAddress({
                              ...postalAddress,
                              postalCode: e.target.value,
                            })
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Parent/Guardian/Sponsor
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Details about the students Parent/Guardian/Sponsor
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {guardians.map((guardian, index) => (
                <div
                  key={index}
                  className="sm:col-span-6 border-b border-gray-300 pb-4"
                >
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">{`Guardian ${
                      guardians.length > 1 ? index + 1 : ""
                    }`}</legend>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id={`guardianTypeFather-${index}`}
                          name={`guardianType-${index}`}
                          type="radio"
                          value="Father"
                          checked={guardian.relation === "Father"}
                          onChange={(e) =>
                            handleGuardianChange(
                              index,
                              "relation",
                              e.target.value
                            )
                          }
                          className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-600"
                        />
                        <label
                          htmlFor={`guardianTypeFather-${index}`}
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Father
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id={`guardianTypeMother-${index}`}
                          name={`guardianType-${index}`}
                          type="radio"
                          value="Mother"
                          checked={guardian.relation === "Mother"}
                          onChange={(e) =>
                            handleGuardianChange(
                              index,
                              "relation",
                              e.target.value
                            )
                          }
                          className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-600"
                        />
                        <label
                          htmlFor={`guardianTypeMother-${index}`}
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Mother
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id={`guardianTypeOther-${index}`}
                          name={`guardianType-${index}`}
                          type="radio"
                          value="Other"
                          checked={guardian.relation === "Other"}
                          onChange={(e) =>
                            handleGuardianChange(
                              index,
                              "relation",
                              e.target.value
                            )
                          }
                          className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-600"
                        />
                        <label
                          htmlFor={`guardianTypeOther-${index}`}
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Other
                        </label>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor={`guardianFirstName-${index}`}
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First name *
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name={`guardianFirstName-${index}`}
                          id={`guardianFirstName-${index}`}
                          value={guardian.firstName}
                          onChange={(e) =>
                            handleGuardianChange(
                              index,
                              "firstName",
                              e.target.value
                            )
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor={`guardianLastName-${index}`}
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Last name *
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name={`guardianLastName-${index}`}
                          id={`guardianLastName-${index}`}
                          value={guardian.lastName}
                          onChange={(e) =>
                            handleGuardianChange(
                              index,
                              "lastName",
                              e.target.value
                            )
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor={`guardianEmail-${index}`}
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name={`guardianEmail-${index}`}
                          id={`guardianEmail-${index}`}
                          value={guardian.email}
                          onChange={(e) =>
                            handleGuardianChange(index, "email", e.target.value)
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor={`guardianPhoneNumber-${index}`}
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone Number
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name={`guardianPhoneNumber-${index}`}
                          id={`guardianPhoneNumber-${index}`}
                          value={guardian.mobileNumber}
                          onChange={(e) =>
                            handleGuardianChange(
                              index,
                              "mobileNumber",
                              e.target.value
                            )
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {guardians.length > 1 && (
                      <button
                        type="button"
                        className="mt-2 text-sm text-red-600 hover:text-red-900"
                        onClick={() => removeGuardian(index)}
                      >
                        Remove Guardian
                      </button>
                    )}
                  </fieldset>
                </div>
              ))}
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-500"
                onClick={addGuardian}
              >
                Add Guardian
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => router.push(`/admin/students/${id}`)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {isUpdating ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V2.5a.5.5 0 011 0V4a8 8 0 01-8 8zm8 8a8 8 0 008-8h1.5a.5.5 0 010 1H20a8 8 0 00-8 8z"
                ></path>
              </svg>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}
