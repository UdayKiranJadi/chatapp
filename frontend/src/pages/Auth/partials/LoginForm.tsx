import {z} from "zod"
import { useNavigate}  from "react-router"
import { useAuthStore } from "../../../stores/authStore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../../../services/authService"
import { toast } from "sonner"



interface LoginFormProps {
    onSwitch: () => void
}

const loginSchema = z.object({
    email: z.email({message:"Invalid email address"}),
    password: z.string().min(6,{message:"Password must be at least 6 characters long"})
})

type LoginFormData = z.infer<typeof loginSchema>



const LoginForm: React.FC<LoginFormProps> = ({onSwitch}) => {
    const navigate = useNavigate();
    const {setUser} = useAuthStore();

    const {register , handleSubmit, formState :{errors}} = useForm({
        resolver:zodResolver(loginSchema)
    })

    const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            const {user} = data;
            setUser(user);
            toast.success("Login Succesfull!")
            return navigate('/');
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Login Failed"
        }
    })

    const onSubmit = (data: LoginFormData) => mutation.mutate(data);

    return (
    <>
    Login Form
    </>
    )
    
}

export default LoginForm;