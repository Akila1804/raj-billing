"use client";

import { useState } from "react";
import { ArrowLeftFromLineIcon, PlusCircle } from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import { DASHBOARD } from "@/constants/path";

const initialForm = {
  jobno: "",
  job_name: "",
  description: "",
  offset_name: "",
  paper: "",
  paper_qty: "",
  paper_qty_unit: "",
  paper_printing_type: "Single Side",
  plate_com_name: "",
  plate_type: "",
  plate_name: "",
  plate_color: "",
  lamination: false,
  lamination_type: "",
  lamination_com_name: "",
  scoring: false,
  scoring_type: "",
  scoring_com_name: "",
  pasting: false,
  pasting_type: "",
  pasting_com_name: "",
  folding: false,
  folding_type: "",
  folding_com_name: "",
  binding: false,
  binding_type: "",
  binding_com_name: "",
  cutting: false,
  cutting_type: "",
  cutting_com_name: "",
  extra_work: "",
};

const offsetNameOptions = [
  "Select offset name",
  "ABC Offset",
  "Bright Print House",
  "Metro Offset",
  "Sunrise Press",
];

const paperOptions = [
  "Select paper",
  "Art Paper",
  "Maplitho",
  "Glossy Paper",
  "CB Paper",
];

const finishingCompanyOptions = [
  "Select company",
  "ABC Finishing",
  "Bright Press",
  "Metro Bindery",
  "Global Works",
];

const AddJobCard = () => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (
    field: keyof typeof initialForm,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      { key: "jobno", label: "Job No" },
      { key: "job_name", label: "Job Name" },
      { key: "offset_name", label: "Offset Name" },
      { key: "paper", label: "Paper" },
      { key: "paper_qty", label: "Paper Qty" },
      { key: "plate_com_name", label: "Plate Company Name" },
      { key: "plate_type", label: "Plate Type" },
      { key: "plate_name", label: "Plate Name" },
      { key: "plate_color", label: "Plate Color" },
    ] as const;

    const missingField = requiredFields.find(
      (field) => !String(form[field.key]).trim(),
    );

    if (missingField) {
      Swal.fire({
        title: "Required field missing",
        text: `${missingField.label} is required.`,
        icon: "warning",
      });
      return;
    }

    Swal.fire({
      title: "Success",
      text: "Job card details saved successfully.",
      icon: "success",
    });
    console.log("Job card form", form);
  };

  const finishingOptions = [
    {
      key: "lamination",
      label: "Lamination",
      typeKey: "lamination_type",
      companyKey: "lamination_com_name",
    },
    {
      key: "scoring",
      label: "Scoring",
      typeKey: "scoring_type",
      companyKey: "scoring_com_name",
    },
    {
      key: "pasting",
      label: "Pasting",
      typeKey: "pasting_type",
      companyKey: "pasting_com_name",
    },
    {
      key: "folding",
      label: "Folding",
      typeKey: "folding_type",
      companyKey: "folding_com_name",
    },
    {
      key: "binding",
      label: "Binding",
      typeKey: "binding_type",
      companyKey: "binding_com_name",
    },
    {
      key: "cutting",
      label: "Cutting",
      typeKey: "cutting_type",
      companyKey: "cutting_com_name",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-2 flex justify-between items-center">
          <Link href={DASHBOARD}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={600}
              height={600}
              className="w-52 h-20"
            />
          </Link>
          <Link
            href={DASHBOARD}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
          >
            <ArrowLeftFromLineIcon size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Job Card</p>
              <h1 className="text-2xl font-semibold text-gray-800">
                Add New Job Card
              </h1>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              New Entry
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Basic Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Job No <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.jobno}
                    onChange={(e) => handleChange("jobno", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="JOB-001"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Job Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.job_name}
                    onChange={(e) => handleChange("job_name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Enter job name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Offset Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.offset_name}
                    onChange={(e) =>
                      handleChange("offset_name", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {offsetNameOptions.map((option) => (
                      <option
                        key={option}
                        value={option === "Select offset name" ? "" : option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 xl:col-span-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Enter job description"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Printing Details
              </h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Paper <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.paper}
                    onChange={(e) => handleChange("paper", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {paperOptions.map((option) => (
                      <option
                        key={option}
                        value={option === "Select paper" ? "" : option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Paper Qty <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.paper_qty}
                    onChange={(e) => handleChange("paper_qty", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Qty Unit
                  </label>
                  <select
                    value={form.paper_qty_unit}
                    onChange={(e) =>
                      handleChange("paper_qty_unit", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Sheets">Sheets</option>
                    <option value="Copies">Copies</option>
                    <option value="Packets">Packets</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Printing Type
                  </label>
                  <select
                    value={form.paper_printing_type}
                    onChange={(e) =>
                      handleChange("paper_printing_type", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Single Side">Single Side</option>
                    <option value="Double Side">Double Side</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Plate Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.plate_com_name}
                    onChange={(e) =>
                      handleChange("plate_com_name", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Plate Company"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Plate Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.plate_type}
                    onChange={(e) => handleChange("plate_type", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Type A"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Plate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.plate_name}
                    onChange={(e) => handleChange("plate_name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Plate Name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Plate Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.plate_color}
                    onChange={(e) =>
                      handleChange("plate_color", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Finishing Works
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {finishingOptions.map((option) => {
                  const isEnabled = Boolean(form[option.key]);
                  const typeKey = option.typeKey as keyof typeof form;
                  const companyKey = option.companyKey as keyof typeof form;

                  return (
                    <div
                      key={option.key}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) =>
                            handleChange(option.key, e.target.checked)
                          }
                        />
                        {option.label}
                      </label>

                      {isEnabled && (
                        <div className="mt-3 space-y-3">
                          <input
                            value={String(form[typeKey])}
                            onChange={(e) =>
                              handleChange(typeKey, e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            placeholder={`${option.label} type`}
                          />
                          <select
                            value={String(form[companyKey])}
                            onChange={(e) =>
                              handleChange(companyKey, e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >
                            {finishingCompanyOptions.map((company) => (
                              <option
                                key={company}
                                value={
                                  company === "Select company" ? "" : company
                                }
                              >
                                {company}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Additional Work
              </h2>
              <textarea
                value={form.extra_work}
                onChange={(e) => handleChange("extra_work", e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="Enter any extra work details"
              />
            </section>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <PlusCircle size={16} />
                Save Job Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobCard;
