import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    useDisclosure,
    Button
} from "@heroui/react";
import CustomModal from "@/components/Modal/CustomModal";
import {useMutation} from "@tanstack/react-query";
import {putData} from "@/core/api/apiHandler";
import { bidsRoutes} from "@/core/api/apiRoutes";
import {useParams} from "next/navigation";
import {toast} from "sonner";
import {useState} from "react";

interface OrderTableProps {
    columnHeaders: string[];
    rows: Array<{
        _id : any;
        createdBy: {
            name: string;
            email: string;
        };
        bidAmount: number;
    }>;
    showButton : boolean
}

export default function OrderTable({ columnHeaders, rows,showButton }: OrderTableProps) {
    const {onOpen,isOpen,onOpenChange,onClose} = useDisclosure();
    const { id } = useParams();
    const [orderid,setorderid]  = useState<any>(null);
    
    const updateStatus = useMutation({
        mutationKey : ["update_Status"],
        mutationFn : async (bid  : any) => {
            return  await putData(`${bidsRoutes.acceptOrder}${id}/${bid}`,{},{});
        },
        onSuccess : (data : any) => {
            console.log(data.data.data,"Success Data");
            toast.success("Accepted the Order Succesfully",{
                position : "top-right",
            });
            onClose(); 
        },
        onError : (error : any) => {
            console.log("Failure Data",error);
            toast.error("Error while accepting the order",{
                position : "top-right",
            });
            onClose(); 
        }
    });
    return (
     <>
        <Table className="w-2/3">
            <TableHeader>

        <TableHeader>
                {columnHeaders.map((c, index) => {
                    if (showButton === false && c === "Action") {
                        return <TableColumn className="hidden">Action</TableColumn>;
                    }
                    return <TableColumn key={index}>{c}</TableColumn>;
        })}
</TableHeader>
            </TableHeader>
            <TableBody>
                {rows.map((row, idx) => (
                    <TableRow key={idx}>
                        <TableCell>{row.createdBy.name}</TableCell>
                        <TableCell>{row.createdBy.email}</TableCell>
                        <TableCell>Rs {row.bidAmount}</TableCell>
                        {showButton ? <TableCell className="flex flex-wrap">
                            <Button color="primary" className="rounded-xl" onPress={() => {
                                        setorderid(row._id);
                                        onOpen();
                                }}>Accept</Button>
                        </TableCell> : <></>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
       <CustomModal isOpen={isOpen} onOpenChange={onOpenChange} heading="Confirma To Aceept this Order" bottomContent={
            <div className="flex flex-row items-center gap-4 p-4">
                <Button color="primary" onPress={onClose}>Cancel</Button>
                <Button color="warning" onPress={() => updateStatus.mutate(orderid)}>Accept</Button>
            </div>
        }>
        <h1>Are You Sure you want to accept the Order?</h1>
      </CustomModal>
      </>
    );
}
