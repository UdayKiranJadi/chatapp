import { Route, Routes } from "react-router-dom"
import Auth from "./pages/Auth/Auth"
import Chat from "./pages/Chat/Chat"
import {Toaster} from "sonner"



const App: React.FC = () => {


  return (
    <>
      <Routes>
         <Route path="/" element={<Chat />}/>
        <Route path="/auth" element={<Auth />}/>
       
      </Routes>
      <Toaster richColors position="top-right"/>
    </>
  )
}

export default App
