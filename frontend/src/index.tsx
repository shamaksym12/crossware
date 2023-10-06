import React,  {Suspense} from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'redux/store'
// import { PersistGate } from 'redux-persist/integration/react'
// import { persistStore } from 'redux-persist'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './i18n'

window.onload = () => {
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                {/* <PersistGate loading={null} persistor={persistStore(store)}> */}
                <Suspense fallback="...loading">
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Suspense>
                {/* </PersistGate> */}
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    )
}
