"use client";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import ToastNotification, { showToast } from "../(components)/toast/Toast";
import { ChangeEvent, useEffect, useState } from "react";
interface FormData {
  fullname: string;
  email: string;
  file: string;
  id: string;
}

type Change = {
  target: {
    name: string;
    value: string;
  };
};

interface Image {
  secure_url?: string;
}
type ChangeImage = {
  target: {
    files: FileList;
  };
};

export default function Home() {
  const [users, setUsers] = useState<FormData[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [state, setState] = useState<FormData>({
    fullname: "",
    email: "",
    file: "",
    id: "",
  });
  const handleChange = (e: Change) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      if (response.ok) {
        showToast("User  successfully Saved", "success");
        setState({ fullname: "", email: "", file: "", id: "" });
      }
    } catch (error) {
      showToast("Error While Saving User", "error");
      // console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        id: id,
      });

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
      };

      await fetch("http://localhost:3000/api/users", requestOptions).then(
        () => {
          showToast("User  successfully Deleted", "success");
        }
      );
    } catch (error) {
      showToast("Error While Deleting User", "error");
    }
  };

  useEffect(() => {
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data.users || []);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  }, [state]);
  const handleSetData = (user: FormData) => {
    setState(user);
    setUpdate(true);
  };

  const handleUpdate = async (id: string) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        fullname: state.fullname,
        email: state.email,
        file: state.file,
      });
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        `http://localhost:3000/api/users?id=${id}`,
        requestOptions
      );
      const result = await response.json();

      if (response.ok) {
        showToast("User Successfully Update", "success");
      } else {
        console.log("Update failed:", result);
        showToast("Error While Updating User", "erro");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-24 flex-col items-center h-screen">
        <div className="flex flex-col w-full max-w-lg text-center gap-4 border rounded-md p-6 shadow-lg bg-white">
          <h1 className="text-2xl font-semibold mb-4">User Form</h1>
          <input
            type="text"
            name="fullname"
            value={state.fullname}
            placeholder="Full Name"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            value={state.email}
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            onChange={handleChange}
          />
          <CldUploadWidget
            uploadPreset="ml_default"
            onSuccess={(result) => {
              if (typeof result?.info === "object" && result.info) {
                const imageUrl = result.info.secure_url;
                setState((prevState) => ({ ...prevState, file: imageUrl }));
              } else {
                console.error("Unexpected upload result format:", result);
              }
            }}
          >
            {({ open }) => {
              return (
                <div
                  onClick={() => open()}
                  className="p-2 border border-gray-300 rounded-md cursor-pointer"
                >
                  {state.file ? (
                    <CldImage
                      src={state.file as string}
                      width="100"
                      height="100"
                      priority
                      crop={{
                        type: "auto",
                        source: true,
                      }}
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                      alt="User Image"
                    />
                  ) : (
                    "Upload image"
                  )}
                </div>
              );
            }}
          </CldUploadWidget>
          {update ? (
            <button
              className="p-2 rounded-md bg-blue-600 text-white w-full"
              onClick={() => handleUpdate(state.id)}
            >
              Update
            </button>
          ) : (
            <button
              className="p-2 rounded-md bg-blue-600 text-white w-full"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>

        <div className="mt-10 w-full max-w-5xl overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-6 py-4">Profile</th>
                <th className="border border-gray-300 px-6 py-4">Full Name</th>
                <th className="border border-gray-300 px-6 py-4">Email</th>
                <th className="border border-gray-300 px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4">
                    <CldImage
                      src={user.file as string}
                      width="50"
                      height="50"
                      alt="Profile Image"
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                      className="rounded-full"
                    />
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    {user.fullname}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-6 py-4">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleSetData(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastNotification />
    </>
  );
}
