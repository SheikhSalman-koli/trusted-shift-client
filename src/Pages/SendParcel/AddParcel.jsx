import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router";



const AddParcelForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const parcelType = watch("type");
    const [userName] = useState("John Doe");

    const warehouses = useLoaderData()

    // Extract unique regions
    const uniqueRegions = [...new Set(warehouses.map(item => item.region))];

    // Map each region to its districts
    const groupByRegion = warehouses.reduce((acc, item) => {
        if (!acc[item.region]) acc[item.region] = new Set();
        acc[item.region].add(item.district);
        return acc;
    }, {});

    // Controlled states for region and district
    const [senderRegion, setSenderRegion] = useState("");
    const [receiverRegion, setReceiverRegion] = useState("");

    const calculateDeliveryCost = (data) => {
        const isSameRegion = data.senderRegion === data.receiverRegion;
        const isDocument = data.type === "document";
        const weight = parseFloat(data.weight || 0);

        if (isDocument) {
            return isSameRegion ? 60 : 80;
        }

        // Non-document logic
        if (weight <= 3) {
            return isSameRegion ? 110 : 150;
        } else {
            const extraKg = weight - 3;
            const extraCost = 40 * extraKg;

            if (isSameRegion) {
                return 110 + extraCost;
            } else {
                return 150 + extraCost + 40; // extra 40 if outside
            }
        }
    };


    const confirmAndSave = async (data, cost) => {
        const payload = {
            ...data,
            deliveryCost: cost,
            creation_date: new Date().toISOString(),
        };
        console.log(payload);
        toast.success("Parcel saved successfully!");
        // try {
        //   const res = await fetch("https://your-api-endpoint.com/parcels", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(payload),
        //   });

        //   if (res.ok) {
        //     toast.success("Parcel saved successfully!");
        //     reset();
        //     setSenderRegion("");
        //     setReceiverRegion("");
        //   } else {
        //     toast.error("Failed to save parcel.");
        //   }
        // } catch (err) {
        //   toast.error("An error occurred.");
        // }
    };

    const onSubmit = (data) => {
        const cost = calculateDeliveryCost(data);
        toast((t) => (
            <div className="bg-white shadow-lg rounded p-4 border">
                <p className="text-lg font-semibold">Delivery Cost: ৳{cost}</p>
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmAndSave(data, cost);
                        }}
                        className="btn btn-sm btn-success"
                    >
                        Confirm
                    </button>

                    <button
                        onClick={() => toast.dismiss(t.id)} // ✅ close without saving
                        className="btn btn-sm btn-outline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-1">Add Parcel</h1>
            <p className="text-gray-600 mb-6">Fill out the form to create a new door-to-door delivery request.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Parcel Info */}
                <div className="bg-base-100 p-5 rounded shadow space-y-4">
                    <h2 className="text-xl font-semibold">Parcel Info</h2>
                    <div>
                        <label className="label">Parcel Type *</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input type="radio" value="document" {...register("type", { required: true })} className="radio radio-primary" />
                                <span>Document</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" value="non-document" {...register("type", { required: true })} className="radio radio-primary" />
                                <span>Non-document</span>
                            </label>
                        </div>
                        {errors.type && <p className="text-red-500 text-sm">Parcel type is required.</p>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Title *</label>
                            <input className="input input-bordered w-full" {...register("title", { required: true })} />
                            {errors.title && <p className="text-red-500 text-sm">Title is required.</p>}
                        </div>
                        {parcelType === "non-document" && (
                            <div>
                                <label className="label">Weight (kg)</label>
                                <input type="number" className="input input-bordered w-full" {...register("weight")} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Sender and Receiver Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sender Info */}
                    <div className="bg-base-100 p-5 rounded shadow space-y-4">
                        <h2 className="text-xl font-semibold">Sender Info</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input type="hidden" {...register("senderRegion", { required: true })} />
                            <input type="hidden" {...register("senderServiceCenter", { required: true })} />

                            <input type="hidden" {...register("receiverRegion", { required: true })} />
                            <input type="hidden" {...register("receiverServiceCenter", { required: true })} />

                            <input className="input input-bordered w-full" defaultValue={userName} {...register("senderName", { required: true })} />
                            <input className="input input-bordered w-full" placeholder="Sender Contact" {...register("senderContact", { required: true })} />

                            <select className="select select-bordered w-full" value={senderRegion} onChange={(e) => {
                                setSenderRegion(e.target.value);
                                setValue("senderRegion", e.target.value);
                                setValue("senderServiceCenter", "");
                            }}>
                                <option value="">Select Region</option>
                                {uniqueRegions.map(r => <option key={r}>{r}</option>)}
                            </select>

                            <select className="select select-bordered w-full" disabled={!senderRegion} onChange={(e) => setValue("senderServiceCenter", e.target.value)}>
                                <option value="">Select District</option>
                                {[...(groupByRegion[senderRegion] || [])].map(d => <option key={d}>{d}</option>)}
                            </select>

                            <input className="input input-bordered w-full md:col-span-2" placeholder="Sender Address" {...register("senderAddress", { required: true })} />
                            <input className="input input-bordered w-full md:col-span-2" placeholder="Pickup Instructions" {...register("pickupInstructions", { required: true })} />
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="bg-base-100 p-5 rounded shadow space-y-4">
                        <h2 className="text-xl font-semibold">Receiver Info</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input className="input input-bordered w-full" placeholder="Receiver Name" {...register("receiverName", { required: true })} />
                            <input className="input input-bordered w-full" placeholder="Receiver Contact" {...register("receiverContact", { required: true })} />

                            <select className="select select-bordered w-full" value={receiverRegion} onChange={(e) => {
                                setReceiverRegion(e.target.value);
                                setValue("receiverRegion", e.target.value);
                                setValue("receiverServiceCenter", "");
                            }}>
                                <option value="">Select Region</option>
                                {uniqueRegions.map(r => <option key={r}>{r}</option>)}
                            </select>

                            <select className="select select-bordered w-full" disabled={!receiverRegion} onChange={(e) => setValue("receiverServiceCenter", e.target.value)}>
                                <option value="">Select District</option>
                                {[...(groupByRegion[receiverRegion] || [])].map(d => <option key={d}>{d}</option>)}
                            </select>

                            <input className="input input-bordered w-full md:col-span-2" placeholder="Receiver Address" {...register("receiverAddress", { required: true })} />
                            <input className="input input-bordered w-full md:col-span-2" placeholder="Delivery Instructions" {...register("deliveryInstructions", { required: true })} />
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary text-black">Submit Parcel</button>
                </div>
            </form>
        </div>
    );
};

export default AddParcelForm;
