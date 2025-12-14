import { isLogin } from "@/middleware/isLogin"
import { redirect } from "next/navigation"



export const metadata={
    title: "Tanvir Ahmmed | Profile",
    description:'Main profile'
}

const MainLayout = async({children}) => {

    const auth= await isLogin()

    if(!auth.success){
        return redirect('/signin')
    }
    
  return (
    <div>
      {children}
    </div>
  )
}

export default MainLayout
