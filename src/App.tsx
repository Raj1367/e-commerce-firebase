import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import store from './ReduxToolkit/Store'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
const App = () => {
  return (
    <>
      <Provider store={store}>
        <div>
          <div className="flex flex-col min-h-screen m-2 md:m-0">
            <header><Navbar /></header>
            <main><Outlet></Outlet></main>
            <div className="flex justify-center items-center relative">
              <footer className="fixed bottom-0"><Footer /></footer>
            </div>
          </div>
        </div>
      </Provider>
    </>
  )
}

export default App