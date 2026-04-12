import { useEffect } from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2,Wifi } from "lucide-react";

import { conversationService } from "../../services/conversationService";
import { useSocketContext } from "../../contexts/SocketContext";
import Modal from "../ui/Modal";


const addConversationSchema = z.object({
    connectCode: z.string().min(6,{message:"Invalid connect ID"})

})

type AddConversationFormData = z.infer<typeof addConversationSchema>


interface AddConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddConversationModal: React.FC<AddConversationModalProps> = ({
    isOpen,
    onClose,

}) => {

    const {
        register,
        handleSubmit,
        watch,
        reset
    } = useForm<AddConversationFormData>({
        resolver:zodResolver(addConversationSchema)
    })
    const {socket} = useSocketContext


    return <>
    
    </>
}

export default AddConversationModal;