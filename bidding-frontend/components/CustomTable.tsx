import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Spinner,
    Chip,
    Switch,
    useDisclosure,
    Button
} from "@heroui/react";
import Delete from "@/public/Icons/Delete";
import { useMutation } from "@tanstack/react-query";
import { deleteData, putData } from "@/core/api/apiHandler";
import { accountRoutes } from "@/core/api/apiRoutes";
import { queryClient } from "@/app/providers";
import { toast } from "sonner";
import { CheckIcon } from "@/public/Icons/CheckIcon";
import CrossIcon from "@/public/Icons/CrossIcon";
import CustomModal from "./Modal/CustomModal";

// Interface for props of a custom table component with pagination and data
interface CustomTableProps {
    page: number,
    pages: number,
    setPage: Dispatch<SetStateAction<number>>;
    loadingState: any,
    data: any[]
}

export default function CustomTable({
    page,
    pages,
    setPage,
    loadingState,
    data,
}: CustomTableProps) {

    // Mutation to delete a user by ID.
    const deleteById = useMutation({
        mutationKey: ["deletebyId"],
        mutationFn: async (id: any) => {
            return await deleteData(`${accountRoutes.deleteById}/${id}`, {});
        },
        onSuccess: (data: any) => {
            console.log(data.data);
            toast.success("User Deleted Successfully");
            queryClient.invalidateQueries();
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Error caused while deleting user");
        }
    });

    // Mutation to block/unblock a user by ID.
    const updateBlockById = useMutation({
        mutationKey: ["updateBlockyId"],
        mutationFn: async (id: any) => {
            return await putData(`${accountRoutes.block}/${id}`, {},{});
        },
        onSuccess: (data: any) => {
            console.log(data.data);
            toast.success("User Status Updated Successfully",{
                position : "top-right"
            });
            queryClient.invalidateQueries();
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Error caused while deleting user",{
                position : "top-right"
            });
        }
    });

    // Define colors for user roles.
    const roleColors: Record<string, "primary" | "warning" | "success" | "danger" | "default" | "secondary"> = {
        ADMIN: "primary",
        BIDDER: "warning",
        SELLER: "secondary",
    };


    // Disclosure hook for modal state to confirm block/unblock.
    const {
        isOpen: isOpenStatus,
        onOpen: onOpenStatus,
        onOpenChange: onOpenChangeStatus,
        onClose: onCloseStatus
    } = useDisclosure();

    // State to hold the currently selected item.
    const [item, setItem] = useState<any>({});

    // Handler to open modal and set selected item.
    const clickChip = (item: any) => {
        onOpenStatus();
        setItem(item);
        console.log(item,"Item");
    }

    // Function to return the value to render in a cell based on column key.
    const getValue = (item: any, columnKey: any): React.ReactNode => {
        switch (columnKey) {
            case "role":
                return <Chip color={roleColors[item.role.name] || "default"}>{item.role.name}</Chip>
            case "action":
                return (<div className="flex flex-row gap-4 items-center w-full">
                    <Delete className={"size-4 fill-red-300 cursor-pointer"} onClick={() => deleteById.mutate(item._id)} />
                    {item.isBlocked === false ? (
                        <Chip
                            size="sm"
                            onClick={() => clickChip(item)}
                            className="text-sm cursor-pointer"
                            color="success"
                            startContent={<CheckIcon size={15} height={6} width={6} />}
                            variant="faded">
                            Active
                        </Chip>
                    ) : (
                        <Chip
                            size="sm"
                            onClick={() => clickChip(item)}
                            className="text-sm cursor-pointer"
                            color="danger"
                            startContent={<CrossIcon size={15} height={6} width={6} />}
                            variant="faded">
                            Blocked
                        </Chip>
                    )}
                </div>);
            default:
                return <p>{item[columnKey]}</p>
        }
    }

    return (
        <>
            <Table
                aria-label="Example table with client async pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
            >
                <TableHeader>
                    <TableColumn key="name">User Name</TableColumn>
                    <TableColumn key="email">Email</TableColumn>
                    <TableColumn key="role">Role</TableColumn>
                    <TableColumn key="action">Action</TableColumn>
                </TableHeader>
                <TableBody
                    items={data ?? []}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                >
                    {(item) => (
                        <TableRow key={item?._id}>
                            {(columnKey) => <TableCell>{getValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <CustomModal
                isOpen={isOpenStatus}
                onOpenChange={onOpenChangeStatus}
                heading="Update Status"
                bottomContent={<div className="flex p-2">
                    <Button onPress={onCloseStatus} color="danger">Close</Button>
                </div>}>
                <div className="flex flex-col">
                    <Switch onChange={() => updateBlockById.mutate(item._id)} value={item.isBlocked}>
                     User Not Blocked
                    </Switch>
                </div>
            </CustomModal>
        </>
    )
}
