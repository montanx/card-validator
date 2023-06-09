import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  /* React Hook Form initialization, getting errors,
   registering and handling Submit ❤️*/
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // Useful for finding the response error and highlighting the input that contains the error!
  const [failedInput, setFailedInput] = useState();

  /* onSubmit function that will only be triggered 
  once the form's validations (required) are correct.
  
  NOTE: Decided to create a onSubmit function rather than triggering a fetch request
  on every change for performance purposes. IMO, in a project we shouldn't request 
  16+ times when the user inputs its card, even though, this could be avoided using a debouncer, sending
  every piece of information at a time will show errors for the other inputs. (such as, imputing a card number)
  while having an empty CVV.

  Last problem described could be fixed by creating endpoints to different inputs 
  e.g (one input for the card number, one for the cvv, one for expiration)
  */
  const onSubmit = (): any => {
    const values = getValues(); // Getting the values from the React Hook Form
    axios // Axios post request to my custom endpoint /api/card in which I send the card information.
      .post("/api/card", {
        card: values.cardNumber,
        cvv: values.cvv,
        date: new Date(values.date),
      })
      .then((res) => {
        setFailedInput(undefined);
        // If the request is completed correctly (status 200), Fire Sweet Alert to show me a success modal.
        Swal.fire({
          title: "Success!",
          text: res?.data?.success,
          icon: "success",
          confirmButtonText: "Cool",
        });
      })
      // If the request is completed correctly (status 406), Fire Sweet Alert to show me an error modal.
      .catch((err) => {
        // Setting the input that contains the error for then handling the red border ❌
        setFailedInput(err.response.data.wrongInput);
        Swal.fire({
          title: "Error!",
          text: err?.response?.data?.failed,
          icon: "error",
          confirmButtonText: "Cool",
        });
      });
  };

  // JSX!
  return (
    <main
      className={`font-inter flex justify-center items-center h-screen ${inter.className}`}
    >
      <Head>
        <title>Card Validator | Fernando Montano</title>
      </Head>
      <article className="max-w-[1300px] mx-auto px-4">
        <section>
          {/* Form section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-5"
          >
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                className={`rounded-lg border-dashed px-2 py-5 text-black ${
                  errors?.name?.type == "required"
                    ? "border-2 border-red-500 hover:border-red-500 outline-none"
                    : "border-2 border-black hover:border-black outline-none"
                }`}
                {...register("name", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="">
                Lastname
              </label>
              <input
                type="text"
                placeholder="Lastname"
                className={`rounded-lg border-dashed px-2 py-5 text-black ${
                  errors?.lastname?.type == "required"
                    ? "border-2 border-red-500 hover:border-red-500 outline-none"
                    : "border-2 border-black hover:border-black outline-none"
                }`}
                {...register("lastname", { required: true })}
              />
            </div>
            {/* Validation won't be made in the Frontend 
            as the whole purpose of the practice is to valide it via backend. */}
            <div className="flex flex-col col-span-2">
              <label className="font-bold" htmlFor="">
                Card number
              </label>
              <input
                type="number"
                placeholder="Card number"
                className={`rounded-lg border-dashed px-2 py-5 text-black col-span-2 ${
                  errors?.cardNumber?.type == "required" ||
                  failedInput == "CardNumber"
                    ? "border-2 border-red-500 hover:border-red-500 outline-none"
                    : "border-2 border-black hover:border-black outline-none"
                }`}
                {...register("cardNumber", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="">
                Expiration date
              </label>
              <input
                type="date"
                placeholder="Expiration Date"
                className={`rounded-lg border-dashed px-2 py-5 text-black ${
                  errors?.date?.type == "required" ||
                  failedInput == "Expiration"
                    ? "border-2 border-red-500 hover:border-red-500 outline-none"
                    : "border-2 border-black hover:border-black outline-none"
                }`}
                {...register("date", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold" htmlFor="">
                CVV
              </label>
              <input
                type="number"
                placeholder="CVV"
                className={`rounded-lg border-dashed px-2 py-5 text-black ${
                  errors?.cvv?.type == "required" || failedInput == "CVV"
                    ? "border-2 border-red-500 hover:border-red-500 outline-none"
                    : "border-2 border-black hover:border-black outline-none"
                }`}
                {...register("cvv", { required: true })}
              />
            </div>
            {/* Submit button which first validates and then sends the request */}
            <button
              type="submit"
              className="w-full bg-black font-bold rounded-lg py-5 text-white col-span-2"
            >
              Send data
            </button>
          </form>
          <Link
            href="/onchange"
            className="flex mt-4 cursor-pointer justify-center underline font-bold bg-white px-5 py-2 rounded-xl"
          >
            <div>Check on change</div>
          </Link>
        </section>
      </article>
    </main>
  );
}
