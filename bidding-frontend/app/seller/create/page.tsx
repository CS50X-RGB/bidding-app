'use client';
import { postData, postMultipart } from "@/core/api/apiHandler";
import { bidsRoutes, categoryRoutes } from "@/core/api/apiRoutes";
import { localBackend } from "@/core/api/axiosInstance";
import CrossIcon from "@/public/Icons/CrossIcon";
import { Button, Card, CardBody, Input, Textarea, Autocomplete, AccordionItem, AutocompleteItem, Chip, CardHeader, Image, form } from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Type = "name" | "description" | "totalPrice" | "category" | "images" | "incrementalValue" | "bidPublishedDate" | "durationInDays";

export default function BidCreate() {
    const [bid, setBid] = useState<any>({
        name: "",
        description: "",
        totalPrice: 0,
        incrementalValue: 100,
        category: [],
        images: [],
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [files, setFiles] = useState<any[]>([]);
    const [catToShow, setCatToShow] = useState<any[]>([]);
    let list = useAsyncList({
        async load({ filterText }) {
            let res = await fetch(`${localBackend}/${categoryRoutes.getAll}/?search=${filterText}`, {});
            console.log(res, "RES");
            let json = await res.json();
            console.log(json, "JSON");
            return {
                items: json.data,
            };
        },
    });
    const router = useRouter();
    const createBid = useMutation({
        mutationKey: ["create-bid"],
        mutationFn: async (data: any) => {
            return await postMultipart(bidsRoutes.createBid, {}, data);
        },
        onSuccess: (data: any) => {
            console.log(data.data.data, "Data from Create Bid Endpoint");
            toast.success("Created Bid Successfully", {
                position: "top-right",
            });
            setIsSubmitting(false);
            router.push("/seller/view");
        },
        onError: (error: any) => {
            console.error(error);
            setIsSubmitting(false);
        }
    });
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", bid.name);
        formData.append("description", bid.description);
        formData.append("totalPrice", bid.totalPrice);
        formData.append("incrementalValue", bid.incrementalValue);

        bid.category.forEach((cat: any) => {
            formData.append("category", bid.category);
        });
        if (bid.images.length > 0) {
            bid.images.forEach((file: File) => {
                console.log(file, "Image");
                formData.append("images", file);
            });
        }

        if (bid.bidPublishedDate) {
            formData.append("bidPublishedDate", bid.bidPublishedDate.toISOString());
        }

        if (bid.durationInDays) {
            formData.append("durationInDays", String(bid.durationInDays));
        }


        createBid.mutate(formData);
    }
    const handleChange = (type: Type, e: any) => {
        if (!e || e === "") return;
        switch (type) {
            case "images":
                const selectedFile = e.target.files;
                if (!selectedFile) return;

                const filesArray = Array.from(selectedFile);

                setBid((prev: any) => {
                    const combinedFiles = [...prev.images, ...filesArray];
                    const limitedFiles = combinedFiles.slice(0, 5 - prev.images.length);  // limit to max 5 files
                    return {
                        ...prev,
                        images: limitedFiles,
                    };
                });
                setFiles((prev: any) => {
                    const combinedPreviews = [...prev, ...filesArray.map((file) => URL.createObjectURL(file))];
                    return combinedPreviews.slice(0, 5 - prev.length);
                });
                break;
            case "category":
                const { _id, name }: any = list.items.find((item: any) => item._id === e);

                if (bid.category.includes(_id)) {
                    toast.error("Category already selected", {
                        position: "top-right",
                    });
                    return;
                }

                setBid((prev: any) => ({
                    ...prev,
                    category: [...prev.category, _id]
                }));

                setCatToShow((prev: any[]) => [...prev, { name, _id }]);

                list.setFilterText("");
                break;

            case "incrementalValue":
                setBid((prev: any) => ({
                    ...prev,
                    incrementalValue: parseFloat(e),
                }));
                break;

            case "bidPublishedDate":
                setBid((prev: any) => ({
                    ...prev,
                    bidPublishedDate: new Date(e),
                }));
                break;
            case "durationInDays":
                setBid((prev: any) => ({
                    ...prev,
                    durationInDays: parseInt(e),
                }));
                break;

            default:
                setBid((prev: any) => ({
                    ...prev,
                    [type]: e,
                }));
        }
    }

    return (
        <div className="flex flex-col w-full items-center justify-center">
            <Card className="rounded-xl w-1/3 shadow-xl">
                <CardHeader className="flex w-full text-2xl font-bold items-center justify-center">Create a Bid</CardHeader>
                <CardBody>
                    <form onSubmit={(e) => handleFormSubmit(e)} className="flex flex-col gap-4 justify-around p-4">
                        <Input type="name" label="Name" labelPlacement="outside" onValueChange={(e) => handleChange("name", e)} />
                        <Textarea label="Description" labelPlacement="outside" onValueChange={(e) => handleChange("description", e)} />
                        <Input
                            label="Price"
                            labelPlacement="outside"
                            onValueChange={(e) => handleChange("totalPrice", e)}
                            placeholder="0.00"
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">Rs</span>
                                </div>
                            }
                            type="number"
                        />
                        <Input
                            label="Incremental Bid Value"
                            labelPlacement="outside"
                            onValueChange={(e) => handleChange("incrementalValue", e)}
                            placeholder="minimum 100"
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">Rs</span>
                                </div>
                            }
                            type="number"
                            min={100}
                        />
                        <Input
                            type="date"
                            label="Bid Publish Date"
                            labelPlacement="outside"
                            //min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            min={new Date(Date.now() - 60 * 60 * 1000).toISOString().split('T')[0]} // allow today or even 1 hour ago

                            onChange={(e) => handleChange("bidPublishedDate", e.target.value)}
                        />
                        <Input
                            type="number"
                            label="Bid Duration (in days)"
                            min={1}
                            max={60}
                            onChange={(e) => handleChange("durationInDays", e.target.value)}
                        />

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-4 flex-wrap">
                                {files.map((src: any, index: number) => (
                                    <div key={index} className="relative w-32 h-32">
                                        <button
                                            type="button"
                                            className="bg-black/50 text-white rounded-full p-1 hover:bg-red-600 z-50 absolute top-0"
                                            onClick={() => {
                                                setFiles((prev: any[]) => prev.filter((_, i) => i !== index));
                                                setBid((prev: any) => ({
                                                    ...prev,
                                                    images: prev.images.filter((_, i) => i !== index)
                                                }));
                                                console.log(bid.images, files, "After State");
                                            }}
                                        >
                                            <CrossIcon className="cursor-pointer" size={15} height={20} width={20} />
                                        </button>
                                        <Image
                                            src={src}
                                            alt={`preview ${index}`}
                                            className="w-32 h-32 object-cover shadow-xl rounded-xl"
                                        />
                                    </div>
                                ))}
                            </div>
                            <label
                                htmlFor="image-upload"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg cursor-pointer w-fit"
                            >
                                Upload Images (5 Images)
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                onChange={(e) => handleChange("images", e)}
                                multiple={true}
                                max={5}
                                accept="image/jpeg, image/png"
                                className="hidden"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 p-2">
                                {catToShow.map((c: any) => (
                                    <Chip
                                        color="primary"
                                        key={c._id}
                                        onClose={() => {
                                            setBid((prev: any) => ({
                                                ...prev,
                                                category: prev.category.filter((id: string) => id !== c._id),
                                            }));
                                            setCatToShow((prev: any[]) => prev.filter(item => item._id !== c._id));
                                        }}
                                    >
                                        {c.name}
                                    </Chip>
                                ))}

                            </div>
                            <Autocomplete
                                className="max-w-xl"
                                inputValue={list.filterText}
                                isLoading={list.isLoading}
                                items={list.items}
                                // isRequired={true}
                                onSelectionChange={(e) => {
                                    handleChange("category", e);
                                }}
                                label="Select Categories"
                                variant="bordered"
                                onInputChange={list.setFilterText}
                            >
                                {(item: any) => (
                                    <AutocompleteItem key={item._id} className="capitalize">
                                        {item.name}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                        </div>
                        <Button isLoading={isSubmitting} type="submit" color="primary">Submit</Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}
