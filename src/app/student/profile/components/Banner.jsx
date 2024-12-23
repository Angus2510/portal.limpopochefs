import Card from "@/components/card";
import Image from "next/image";
import React, { useState } from "react";

const getInitials = (name) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return initials.toUpperCase();
};

const Banner = ({
  name,
  avatar,
  intakeGroup,
  studentNo,
  campus,
  arrears,
  dueDate,
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);

  return (
    <Card className={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover bg-[url('/img/profile/banner.png')]">
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-gray-400 dark:!border-navy-700">
          {avatar && !imageError ? (
            <Image
              className="h-full w-full rounded-full"
              src={avatar}
              alt=""
              onError={() => setImageError(true)}
              width={300}
              height={300}
            />
          ) : (
            <span className="text-xl font-medium text-white">{initials}</span>
          )}
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {name}
        </h4>
        <p className="text-base font-normal text-gray-600">{intakeGroup}</p>
      </div>

      {/* Post followers */}
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {studentNo}
          </p>
          <p className="text-sm font-normal text-gray-600">Student Number</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {campus}
          </p>
          <p className="text-sm font-normal text-gray-600">Campus</p>
        </div>
      </div>
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p
            className={`text-2xl font-bold ${
              arrears > 0 ? "text-red-500" : "text-navy-700"
            } dark:text-white`}
          >
            R {arrears}
          </p>
          <p className="text-sm font-normal text-gray-600">Arrears</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {dueDate}
          </p>
          <p className="text-sm font-normal text-gray-600">Due Date</p>
        </div>
      </div>
    </Card>
  );
};

export default Banner;
