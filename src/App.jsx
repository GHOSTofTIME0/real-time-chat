import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers } from "./store/slicers/usersSlice";
import SearchUsers from "./components/SearchUsers";
import AppRouter from "./components/AppRouter";

function App() {

  return (
    <div>
      <AppRouter />
    </div>
  )
}

export default App
